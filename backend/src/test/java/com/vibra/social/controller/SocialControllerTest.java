package com.vibra.social.controller;

import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import com.vibra.social.service.MatchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SocialControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MatchService matchService;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(username = "test@test.com")
    void shouldReturnErrorWhenProfileIsIncomplete() throws Exception {
        // Arrange
        UUID eventId = UUID.randomUUID();
        User currentUser = User.builder().email("test@test.com").build();
        
        when(userService.findUserByEmail("test@test.com")).thenReturn(currentUser);
        when(matchService.getPotentialSwipersWithSorting(eq(eventId), any()))
                .thenThrow(new RuntimeException("Perfil incompleto: falta preencher idade e gênero."));

        // Act & Assert
        mockMvc.perform(get("/api/v1/social/events/" + eventId + "/potential-swipes"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Perfil incompleto: falta preencher idade e gênero."))
                .andExpect(jsonPath("$.status").value(400));
    }
}
