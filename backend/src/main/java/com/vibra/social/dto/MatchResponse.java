package com.vibra.social.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class MatchResponse {
    private UUID matchId;
    private UUID matchedUserId;
    private String matchedUserName;
    private String matchedUserPhotoUrl;
    private ZonedDateTime matchedAt;
}
