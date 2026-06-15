package com.vibra.social.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    private UUID channelId;
    private UUID eventId;
    private UUID senderId;
    private UUID matchId;
    private String content;
    private String type; // CHAT, TYPING, READ_RECEIPT, SYSTEM
    private boolean isSystem;
}
