package com.vibra.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String fullName;
    private String businessName;
    private String businessDocument;
    private String bio;
    private String profilePhotoUrl;
    private String bannerUrl;
    private String pixKey;
    private String bankName;
    private String bankAgency;
    private String bankAccount;
    private String accountType;
    private Map<String, Object> preferences;
}
