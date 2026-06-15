package com.vibra.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserResponse {
    private UUID id;
    private String fullName;
    private String profilePhotoUrl;
    private String bio;
    private Map<String, Object> preferences;
}
