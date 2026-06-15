package com.vibra.admin.service;

import com.vibra.admin.dto.ConversionsResponse;
import com.vibra.admin.dto.DemographicsResponse;
import com.vibra.admin.dto.InteractionsResponse;
import com.vibra.admin.repository.AnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    @Transactional(readOnly = true)
    public DemographicsResponse getDemographics(UUID eventId) {
        Double avgAge = analyticsRepository.getAverageAgeByEventId(eventId);
        List<Object[]> genderData = analyticsRepository.getGenderDistributionByEventId(eventId);
        
        List<DemographicsResponse.DataPoint> distribution = genderData.stream()
                .map(row -> new DemographicsResponse.DataPoint(
                        row[0] != null ? (String) row[0] : "NÃO INFORMADO",
                        (Long) row[1]
                ))
                .collect(Collectors.toList());

        return DemographicsResponse.builder()
                .averageAge(avgAge != null ? avgAge : 0.0)
                .genderDistribution(distribution)
                .build();
    }

    @Transactional(readOnly = true)
    public InteractionsResponse getInteractions(UUID eventId) {
        List<Object[]> peakHoursData = analyticsRepository.getPeakInteractionHoursByEventId(eventId);
        
        List<InteractionsResponse.HourlyInteraction> peakHours = peakHoursData.stream()
                .map(row -> new InteractionsResponse.HourlyInteraction(
                        ((Number) row[0]).intValue(),
                        (Long) row[1]
                ))
                .collect(Collectors.toList());

        return InteractionsResponse.builder()
                .peakHours(peakHours)
                .build();
    }

    @Transactional(readOnly = true)
    public ConversionsResponse getConversions(UUID eventId) {
        Long reached = analyticsRepository.getTotalUsersReachedByEventId(eventId);
        
        return ConversionsResponse.builder()
                .usersReached(reached != null ? reached : 0L)
                .purchaseLinkClicks(0L) // Placeholder for future tracking
                .build();
    }
}
