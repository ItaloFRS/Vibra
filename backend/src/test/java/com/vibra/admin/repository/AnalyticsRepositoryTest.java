package com.vibra.admin.repository;

import com.vibra.identity.entity.User;
import com.vibra.identity.entity.UserRole;
import com.vibra.events.entity.Event;
import com.vibra.social.entity.UserEventInterest;
import com.vibra.social.entity.Message;
import com.vibra.social.entity.ChatChannel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AnalyticsRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Test
    void shouldCalculateAverageAgeForEvent() {
        // Arrange
        User producer = createUser("prod@test.com", "Producer", UserRole.ROLE_PRODUCER, null);
        Event event = createEvent("Summer Fest", producer.getId());
        
        // Users with different ages in preferences
        User u1 = createUser("u1@test.com", "User 1", UserRole.ROLE_USER, Map.of("idade", 20));
        User u2 = createUser("u2@test.com", "User 2", UserRole.ROLE_USER, Map.of("idade", 30));
        User u3 = createUser("u3@test.com", "User 3", UserRole.ROLE_USER, Map.of("idade", 40));
        
        linkUserToEvent(u1, event);
        linkUserToEvent(u2, event);
        linkUserToEvent(u3, event);
        
        entityManager.flush();

        // Act
        Double avgAge = analyticsRepository.getAverageAgeByEventId(event.getId());

        // Assert
        assertEquals(30.0, avgAge, 0.1);
    }

    @Test
    void shouldGetGenderDistributionForEvent() {
        // Arrange
        User producer = createUser("prod2@test.com", "Producer 2", UserRole.ROLE_PRODUCER, null);
        Event event = createEvent("Tech Night", producer.getId());
        
        User u1 = createUser("m1@test.com", "M 1", UserRole.ROLE_USER, Map.of("genero", "MASCULINO"));
        User u2 = createUser("m2@test.com", "M 2", UserRole.ROLE_USER, Map.of("genero", "MASCULINO"));
        User u3 = createUser("f1@test.com", "F 1", UserRole.ROLE_USER, Map.of("genero", "FEMININO"));
        
        linkUserToEvent(u1, event);
        linkUserToEvent(u2, event);
        linkUserToEvent(u3, event);
        
        entityManager.flush();

        // Act
        List<Object[]> distribution = analyticsRepository.getGenderDistributionByEventId(event.getId());

        // Assert
        // Expecting rows with [gender, count]
        assertEquals(2, distribution.size());
        
        Map<String, Long> results = new HashMap<>();
        for (Object[] row : distribution) {
            results.put((String) row[0], (Long) row[1]);
        }
        
        assertEquals(2L, results.get("MASCULINO"));
        assertEquals(1L, results.get("FEMININO"));
    }

    @Test
    void shouldGetPeakInteractionHoursForEvent() {
        // Arrange
        User producer = createUser("prod3@test.com", "Producer 3", UserRole.ROLE_PRODUCER, null);
        Event event = createEvent("Rave", producer.getId());
        User u1 = createUser("u4@test.com", "User 4", UserRole.ROLE_USER, null);
        
        // Use fixed timestamps to ensure they land in different hours regardless of timezone
        // Hour 10
        createMessage(u1, event, ZonedDateTime.parse("2026-04-28T10:00:00Z"));
        createMessage(u1, event, ZonedDateTime.parse("2026-04-28T10:30:00Z"));
        // Hour 15
        createMessage(u1, event, ZonedDateTime.parse("2026-04-28T15:00:00Z"));
        
        entityManager.flush();

        // Act
        List<Object[]> peakHours = analyticsRepository.getPeakInteractionHoursByEventId(event.getId());

        // Assert
        Map<Integer, Long> results = new HashMap<>();
        for (Object[] row : peakHours) {
            Number hour = (Number) row[0];
            Long count = (Long) row[1];
            results.put(hour.intValue(), count);
        }
        
        // Check if groups are correct
        assertEquals(2, results.size(), "Should have exactly 2 distinct hours of interaction");
        // Values might shift due to DB timezone, but the counts per group must be 2 and 1
        assertTrue(results.values().contains(2L), "One hour group should have 2 messages");
        assertTrue(results.values().contains(1L), "One hour group should have 1 message");
    }

    private void createMessage(User sender, Event event, ZonedDateTime time) {
        Message msg = Message.builder()
                .sender(sender)
                .event(event)
                .content("Test message")
                .createdAt(time)
                .build();
        entityManager.persist(msg);
    }

    private User createUser(String email, String name, UserRole role, Map<String, Object> prefs) {
        User user = User.builder()
                .email(email)
                .fullName(name)
                .password("pass")
                .role(role)
                .preferences(prefs)
                .build();
        entityManager.persist(user);
        return user;
    }

    private Event createEvent(String title, UUID producerId) {
        Event event = Event.builder()
                .title(title)
                .producerId(producerId)
                .eventDate(ZonedDateTime.now().plusDays(10))
                .build();
        entityManager.persist(event);
        return event;
    }

    private void linkUserToEvent(User user, Event event) {
        UserEventInterest interest = UserEventInterest.builder()
                .user(user)
                .event(event)
                .isFavorite(true)
                .build();
        entityManager.persist(interest);
    }
}
