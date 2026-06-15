package com.vibra.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemographicsResponse {
    private Double averageAge;
    private List<DataPoint> genderDistribution;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DataPoint {
        private String label;
        private Long value;
    }
}
