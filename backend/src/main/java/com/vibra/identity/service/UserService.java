package com.vibra.identity.service;

import com.vibra.identity.dto.ChangePasswordRequest;
import com.vibra.identity.dto.ProfileUpdateRequest;
import com.vibra.identity.entity.User;
import com.vibra.identity.entity.UserRole;
import com.vibra.identity.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CPFService cpfService;
    private final EmailService emailService;
    private final FirebaseService firebaseService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, CPFService cpfService, EmailService emailService, FirebaseService firebaseService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cpfService = cpfService;
        this.emailService = emailService;
        this.firebaseService = firebaseService;
    }

    @Transactional
    public User registerUser(String email, String plainPassword, UserRole role, String fullName, String businessDocument, java.util.Map<String, Object> preferences) {
        log.info("Starting registration for email: {}", email);
        if (userRepository.findByEmail(email).isPresent()) {
            log.warn("Registration failed: Email {} already in use", email);
            throw new RuntimeException("Este e-mail já está em uso.");
        }

        // 1. Validate Password Strength
        try {
            validateStrongPassword(plainPassword);
        } catch (RuntimeException e) {
            log.warn("Registration failed: Weak password for email {}", email);
            throw e;
        }

        // 2. Validate CPF (if provided)
        if (businessDocument != null && role == UserRole.ROLE_USER) {
            if (!cpfService.isValid(businessDocument)) {
                log.warn("Registration failed: Invalid CPF {} for email {}", businessDocument, email);
                throw new RuntimeException("CPF inválido.");
            }
        }
        
        log.info("Data validated. Saving user {}...", email);

        // 3. Generate Verification Code
        String verificationCode = String.format("%06d", new java.util.Random().nextInt(999999));
        java.time.ZonedDateTime expiresAt = java.time.ZonedDateTime.now().plusMinutes(10);

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(plainPassword))
                .role(role)
                .fullName(fullName)
                .businessDocument(businessDocument)
                .preferences(preferences)
                .emailVerified(false)
                .verificationCode(verificationCode)
                .verificationCodeExpiresAt(expiresAt)
                .build();

        user = userRepository.save(user);

        // 4. Send Email
        emailService.sendVerificationCode(email, verificationCode);

        return user;
    }

    private void validateStrongPassword(String password) {
        // Mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula, um número e um caractere especial
        String pattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        if (!password.matches(pattern)) {
            throw new RuntimeException("A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.");
        }
    }

    @Transactional
    public void verifyEmail(String email, String code) {
        User user = findUserByEmail(email);

        if (user.isEmailVerified()) {
            throw new RuntimeException("E-mail já verificado.");
        }

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Código de verificação inválido.");
        }

        if (user.getVerificationCodeExpiresAt().isBefore(java.time.ZonedDateTime.now())) {
            throw new RuntimeException("Código de verificação expirado.");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);
    }

    @Transactional
    public User googleLogin(String idToken) {
        com.google.firebase.auth.FirebaseToken decodedToken = firebaseService.verifyToken(idToken);
        String email = decodedToken.getEmail();
        String name = decodedToken.getName();
        String picture = decodedToken.getPicture();

        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .fullName(name)
                            .profilePhotoUrl(picture)
                            .role(UserRole.ROLE_USER)
                            .emailVerified(true) // Google emails are pre-verified
                            .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password for OAuth users
                            .build();
                    return userRepository.save(newUser);
                });
    }

    @Transactional(readOnly = true)
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public User updateProfile(UUID userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBusinessName() != null) user.setBusinessName(request.getBusinessName());
        if (request.getBusinessDocument() != null) user.setBusinessDocument(request.getBusinessDocument());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfilePhotoUrl() != null) user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        if (request.getBannerUrl() != null) user.setBannerUrl(request.getBannerUrl());
        if (request.getPixKey() != null) user.setPixKey(request.getPixKey());
        if (request.getBankName() != null) user.setBankName(request.getBankName());
        if (request.getBankAgency() != null) user.setBankAgency(request.getBankAgency());
        if (request.getBankAccount() != null) user.setBankAccount(request.getBankAccount());
        if (request.getAccountType() != null) user.setAccountType(request.getAccountType());
        if (request.getPreferences() != null) user.setPreferences(request.getPreferences());

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
