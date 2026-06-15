package com.vibra.social.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class ChatRequestResponse {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private String senderPhotoUrl;
    private String status;
    private ZonedDateTime createdAt;
}
