package com.vibra.events.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class LineupItemResponse {
    private UUID id;
    private String artistName;
    private String artistImageUrl;
}
