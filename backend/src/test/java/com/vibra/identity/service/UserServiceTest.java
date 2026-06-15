package com.vibra.identity.service;

import com.vibra.identity.dto.ProfileUpdateRequest;
import com.vibra.identity.entity.User;
import com.vibra.identity.entity.UserRole;
import com.vibra.identity.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CPFService cpfService;

    @Mock
    private EmailService emailService;

    @Mock
    private FirebaseService firebaseService;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRegisterNewUser() {
        // Arrange
        String email = "user@test.com";
        String password = "Vibra@StrongPassword123";
        UserRole role = UserRole.ROLE_USER;
        String fullName = "Test User";
        String cpf = "52998224725";
        
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        when(cpfService.isValid(cpf)).thenReturn(true);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        User registeredUser = userService.registerUser(email, password, role, fullName, cpf, null);

        // Assert
        assertNotNull(registeredUser);
        assertEquals(email, registeredUser.getEmail());
        assertEquals("encodedPassword", registeredUser.getPassword());
        assertEquals(role, registeredUser.getRole());
        assertEquals(fullName, registeredUser.getFullName());
        assertEquals(cpf, registeredUser.getBusinessDocument());
        assertFalse(registeredUser.isEmailVerified());
        assertNotNull(registeredUser.getVerificationCode());
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendVerificationCode(eq(email), anyString());
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        // Arrange
        String email = "existing@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            userService.registerUser(email, "Vibra@StrongPassword123", UserRole.ROLE_USER, "Test", "52998224725", null)
        );
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsWeak() {
        // Arrange
        String email = "user@test.com";
        String weakPassword = "123";

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            userService.registerUser(email, weakPassword, UserRole.ROLE_USER, "Test", "52998224725", null)
        );
        assertTrue(exception.getMessage().contains("senha deve ter pelo menos 8 caracteres"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenCpfIsInvalid() {
        // Arrange
        String email = "user@test.com";
        String cpf = "invalid_cpf";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(cpfService.isValid(cpf)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            userService.registerUser(email, "Vibra@StrongPassword123", UserRole.ROLE_USER, "Test", cpf, null)
        );
        assertEquals("CPF inválido.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldUpdateProfileSuccessfully() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User existingUser = User.builder()
                .id(userId)
                .fullName("Old Name")
                .build();
        
        ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                .fullName("New Name")
                .businessName("New Business")
                .bio("New Bio")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        User updatedUser = userService.updateProfile(userId, request);

        // Assert
        assertNotNull(updatedUser);
        assertEquals("New Name", updatedUser.getFullName());
        assertEquals("New Business", updatedUser.getBusinessName());
        assertEquals("New Bio", updatedUser.getBio());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldUpdatePreferencesSuccessfully() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User existingUser = User.builder()
                .id(userId)
                .preferences(Map.of("old", "pref"))
                .build();
        
        Map<String, Object> newPrefs = Map.of(
            "wantsMatches", true,
            "matchGender", "Mulher",
            "matchAgeMin", 18,
            "matchAgeMax", 35,
            "age", 25,
            "vibes", List.of("Techno", "Rock")
        );

        ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                .preferences(newPrefs)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        User updatedUser = userService.updateProfile(userId, request);

        // Assert
        assertNotNull(updatedUser);
        assertEquals(newPrefs, updatedUser.getPreferences());
        assertTrue((Boolean) updatedUser.getPreferences().get("wantsMatches"));
        assertEquals("Mulher", updatedUser.getPreferences().get("matchGender"));
        assertEquals(25, updatedUser.getPreferences().get("age"));
        verify(userRepository, times(1)).save(any(User.class));
    }
}
