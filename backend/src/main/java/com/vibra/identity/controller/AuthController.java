package com.vibra.identity.controller;

import com.vibra.identity.dto.AuthResponse;
import com.vibra.identity.dto.ChangePasswordRequest;
import com.vibra.identity.dto.GoogleLoginRequest;
import com.vibra.identity.dto.LoginRequest;
import com.vibra.identity.dto.ProfileUpdateRequest;
import com.vibra.identity.dto.RegisterRequest;
import com.vibra.identity.dto.VerifyEmailRequest;
import com.vibra.identity.entity.User;
import com.vibra.identity.security.JwtUtils;
import com.vibra.identity.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("DEBUG: Recebendo requisição de registro para email: " + request.getEmail());
        User user = userService.registerUser(
                request.getEmail(),
                request.getPassword(),
                request.getRole(),
                request.getFullName(),
                request.getBusinessDocument(),
                request.getPreferences()
        );

        // We won't auto-login if email is not verified, 
        // but for now, we'll return the user info and expect them to verify.
        // Or if we want to follow the previous logic, we can still generate a token.
        // The Spec says "O usuário não consegue finalizar o cadastro com um CPF inválido...".
        // Usually, we verify email BEFORE giving a full token.
        
        return ResponseEntity.ok(AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .bio(user.getBio())
                .preferences(user.getPreferences())
                .build());
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        userService.verifyEmail(request.getEmail(), request.getCode());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/google-login")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        User user = userService.googleLogin(request.getIdToken());
        
        // Generate token for the user
        String token = jwtUtils.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), "", java.util.Collections.emptyList()));

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .bio(user.getBio())
                .preferences(user.getPreferences())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);
        User user = userService.findUserByEmail(userDetails.getUsername());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(userDetails.getUsername())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .bio(user.getBio())
                .preferences(user.getPreferences())
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.findUserByEmail(userDetails.getUsername()));
    }

    @PatchMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileUpdateRequest request) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.updateProfile(user.getId(), request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        userService.changePassword(user.getId(), request);
        return ResponseEntity.ok().build();
    }
}
