package com.vibra.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UUID id;
    private String email;
    private String role;
    private String fullName;
    private String profilePhotoUrl;
    private String bio;
    private Map<String, Object> preferences;
}
