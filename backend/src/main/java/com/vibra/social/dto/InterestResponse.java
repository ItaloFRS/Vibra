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
public class InterestResponse {
    private UUID eventId;
    private boolean isFavorite;
    private boolean hasTicket;
}
