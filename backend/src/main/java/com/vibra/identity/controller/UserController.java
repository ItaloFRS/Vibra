package com.vibra.identity.controller;

import com.vibra.identity.dto.PublicUserResponse;
import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicUserResponse> getPublicProfile(@PathVariable UUID id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(PublicUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .bio(user.getBio())
                .preferences(user.getPreferences() != null ? user.getPreferences() : Map.of())
                .build());
    }
}
