package com.vibra.events.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LineupItemRequest {
    @NotBlank
    private String artistName;

    private String artistImageUrl;
}
