package com.vibra.social.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private UUID messageId;
    private UUID eventId;
    private UUID channelId;
    private UUID senderId;
    private String senderName;
    private String senderPhotoUrl;
    private UUID matchId;
    private String content;
    private ZonedDateTime createdAt;
    private boolean isSystem;
}
