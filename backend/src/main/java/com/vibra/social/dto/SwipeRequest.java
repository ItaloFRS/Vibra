package com.vibra.social.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class SwipeRequest {
    @NotNull
    private UUID eventId;
    @NotNull
    private UUID swipedUserId;
    @NotNull
    private Boolean isLike;
}
