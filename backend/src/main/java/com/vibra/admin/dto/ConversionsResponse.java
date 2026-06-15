package com.vibra.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversionsResponse {
    private Long usersReached;
    private Long purchaseLinkClicks; // For now placeholder
}
