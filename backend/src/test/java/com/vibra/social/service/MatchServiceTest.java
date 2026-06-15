package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Swipe;
import com.vibra.social.repository.MatchRepository;
import com.vibra.social.repository.SwipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.vibra.identity.repository.UserRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;

class MatchServiceTest {

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private SwipeRepository swipeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MatchService matchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldSortPotentialSwipersByVibesAffinity() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        User currentUser = User.builder()
                .id(UUID.randomUUID())
                .preferences(Map.of(
                        "vibes", Arrays.asList("Techno", "Networking", "VIP"),
                        "gender", "Masculino",
                        "age", 25,
                        "matchGender", "Todos",
                        "matchAgeMin", 18,
                        "matchAgeMax", 99
                ))
                .build();

        User highAffinity = User.builder()
                .id(UUID.randomUUID())
                .email("high@test.com")
                .preferences(Map.of(
                        "vibes", Arrays.asList("Techno", "Networking"),
                        "gender", "Feminino",
                        "age", 22,
                        "matchGender", "Todos",
                        "matchAgeMin", 18,
                        "matchAgeMax", 99
                )) // 2 vibes in common
                .build();

        User lowAffinity = User.builder()
                .id(UUID.randomUUID())
                .email("low@test.com")
                .preferences(Map.of(
                        "vibes", Arrays.asList("VIP"),
                        "gender", "Masculino",
                        "age", 30,
                        "matchGender", "Todos",
                        "matchAgeMin", 18,
                        "matchAgeMax", 99
                )) // 1 vibe in common
                .build();

        User noAffinity = User.builder()
                .id(UUID.randomUUID())
                .email("no@test.com")
                .preferences(Map.of(
                        "vibes", Arrays.asList("Rock"),
                        "gender", "Outro",
                        "age", 40,
                        "matchGender", "Todos",
                        "matchAgeMin", 18,
                        "matchAgeMax", 99
                )) // 0 vibes in common
                .build();

        List<User> potentials = Arrays.asList(noAffinity, lowAffinity, highAffinity);
        when(userRepository.findPotentialSwipers(eventId, currentUser.getId())).thenReturn(potentials);

        // Act
        List<User> result = matchService.getPotentialSwipersWithSorting(eventId, currentUser);

        // Assert
        assertEquals(3, result.size());
        assertEquals("high@test.com", result.get(0).getEmail());
        assertEquals("low@test.com", result.get(1).getEmail());
        assertEquals("no@test.com", result.get(2).getEmail());
    }

    @Test
    void shouldFilterPotentialSwipersByMutualPreferences() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        // Current user: Male, 25, wants Females 18-30
        User currentUser = User.builder()
                .id(UUID.randomUUID())
                .preferences(Map.of(
                        "gender", "Masculino",
                        "age", 25,
                        "matchGender", "Feminino",
                        "matchAgeMin", 18,
                        "matchAgeMax", 30,
                        "wantsMatches", true
                ))
                .build();

        // Target: Female, 22, wants Males 20-30 -> SHOULD MATCH
        User validTarget = User.builder()
                .id(UUID.randomUUID())
                .email("valid@test.com")
                .preferences(Map.of(
                        "gender", "Feminino",
                        "age", 22,
                        "matchGender", "Masculino",
                        "matchAgeMin", 20,
                        "matchAgeMax", 30,
                        "wantsMatches", true
                ))
                .build();

        // Target: Female, 35 (too old for current) -> SHOULD BE FILTERED
        User tooOldTarget = User.builder()
                .id(UUID.randomUUID())
                .email("old@test.com")
                .preferences(Map.of(
                        "gender", "Feminino",
                        "age", 35,
                        "matchGender", "Masculino",
                        "matchAgeMin", 20,
                        "matchAgeMax", 40,
                        "wantsMatches", true
                ))
                .build();

        // Target: Female, 22, wants ONLY Females -> SHOULD BE FILTERED
        User wrongPreferenceTarget = User.builder()
                .id(UUID.randomUUID())
                .email("wrong@test.com")
                .preferences(Map.of(
                        "gender", "Feminino",
                        "age", 22,
                        "matchGender", "Feminino",
                        "matchAgeMin", 18,
                        "matchAgeMax", 30,
                        "wantsMatches", true
                ))
                .build();

        List<User> potentials = Arrays.asList(validTarget, tooOldTarget, wrongPreferenceTarget);
        when(userRepository.findPotentialSwipers(eventId, currentUser.getId())).thenReturn(potentials);

        // Act
        List<User> result = matchService.getPotentialSwipersWithSorting(eventId, currentUser);

        // Assert
        assertEquals(1, result.size());
        assertEquals("valid@test.com", result.get(0).getEmail());
    }

    @Test
    void shouldCreateMatchWhenMutualLikeExists() {
        // Arrange
        Event event = Event.builder().id(UUID.randomUUID()).build();
        User user1 = User.builder().id(UUID.randomUUID()).build(); // User who just liked
        User user2 = User.builder().id(UUID.randomUUID()).build(); // User who already liked user1

        // Mock that user2 already liked user1
        Swipe existingSwipe = Swipe.builder().isLike(true).build();
        when(swipeRepository.findByEventAndSwiperAndSwiped(event, user2, user1))
                .thenReturn(Optional.of(existingSwipe));

        // Act
        matchService.checkAndCreateMatch(event, user1, user2);

        // Assert
        verify(matchRepository, times(1)).save(any(Match.class));
    }

    @Test
    void shouldNotCreateMatchWhenMutualLikeDoesNotExist() {
        // Arrange
        Event event = Event.builder().id(UUID.randomUUID()).build();
        User user1 = User.builder().id(UUID.randomUUID()).build();
        User user2 = User.builder().id(UUID.randomUUID()).build();

        // Mock that user2 either hasn't swiped or noped user1
        when(swipeRepository.findByEventAndSwiperAndSwiped(event, user2, user1))
                .thenReturn(Optional.empty());

        // Act
        matchService.checkAndCreateMatch(event, user1, user2);

        // Assert
        verify(matchRepository, never()).save(any(Match.class));
    }
}
