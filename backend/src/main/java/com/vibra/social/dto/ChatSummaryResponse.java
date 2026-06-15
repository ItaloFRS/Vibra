package com.vibra.social.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class ChatSummaryResponse {
    private UUID userId;
    private String userName;
    private String userPhotoUrl;
    private String lastMessage;
    private ZonedDateTime lastMessageAt;
    private boolean unread;
}
