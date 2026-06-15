package com.vibra.identity.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String businessName;

    private String businessDocument;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String profilePhotoUrl; // Will be used as Logo for Producers

    private String bannerUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Builder.Default
    private boolean emailVerified = false;

    private String verificationCode;

    private java.time.ZonedDateTime verificationCodeExpiresAt;

    private String pixKey;
    private String bankName;
    private String bankAgency;
    private String bankAccount;
    private String accountType; // CORRENTE, POUPANCA

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> preferences;

    private java.time.ZonedDateTime createdAt;
    private java.time.ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.ZonedDateTime.now();
        updatedAt = java.time.ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.ZonedDateTime.now();
    }
}
