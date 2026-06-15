package com.vibra.admin.controller;

import com.vibra.admin.dto.ConversionsResponse;
import com.vibra.admin.dto.DemographicsResponse;
import com.vibra.admin.dto.InteractionsResponse;
import com.vibra.admin.service.AnalyticsService;
import com.vibra.events.entity.Event;
import com.vibra.events.repository.EventRepository;
import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private EventRepository eventRepository;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(roles = "PRODUCER", username = "prod@test.com")
    void shouldGetDemographicsWhenOwner() throws Exception {
        UUID eventId = UUID.randomUUID();
        UUID producerId = UUID.randomUUID();
        
        User producer = User.builder().id(producerId).email("prod@test.com").build();
        Event event = Event.builder().id(eventId).producerId(producerId).build();

        when(userService.findUserByEmail("prod@test.com")).thenReturn(producer);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(analyticsService.getDemographics(eventId)).thenReturn(
                DemographicsResponse.builder()
                        .averageAge(25.5)
                        .genderDistribution(List.of(new DemographicsResponse.DataPoint("MASCULINO", 10L)))
                        .build()
        );

        mockMvc.perform(get("/api/v1/admin/events/" + eventId + "/analytics/demographics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageAge").value(25.5))
                .andExpect(jsonPath("$.genderDistribution[0].label").value("MASCULINO"));
    }

    @Test
    @WithMockUser(roles = "PRODUCER", username = "prod2@test.com")
    void shouldDenyAccessWhenNotOwner() throws Exception {
        UUID eventId = UUID.randomUUID();
        UUID otherProducerId = UUID.randomUUID();
        UUID currentProducerId = UUID.randomUUID();
        
        User currentProducer = User.builder().id(currentProducerId).email("prod2@test.com").build();
        Event event = Event.builder().id(eventId).producerId(otherProducerId).build();

        when(userService.findUserByEmail("prod2@test.com")).thenReturn(currentProducer);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        mockMvc.perform(get("/api/v1/admin/events/" + eventId + "/analytics/demographics"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Access denied: You are not the owner of this event"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldDenyAccessToNonProducers() throws Exception {
        UUID eventId = UUID.randomUUID();
        mockMvc.perform(get("/api/v1/admin/events/" + eventId + "/analytics/demographics"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Access Denied"));
    }
}
