package com.vibra.identity.dto;

import com.vibra.identity.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String fullName;

    private String businessDocument;

    private java.util.Map<String, Object> preferences;

    @NotNull
    private UserRole role;
}
