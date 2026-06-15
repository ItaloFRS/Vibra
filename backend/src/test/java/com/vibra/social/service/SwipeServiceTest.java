package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.Swipe;
import com.vibra.social.repository.SwipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SwipeServiceTest {

    @Mock
    private SwipeRepository swipeRepository;

    @Mock
    private MatchService matchService;

    @InjectMocks
    private SwipeService swipeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRecordLikeAndCheckMatch() {
        // Arrange
        Event event = Event.builder().id(UUID.randomUUID()).build();
        User swiper = User.builder().id(UUID.randomUUID()).build();
        User swiped = User.builder().id(UUID.randomUUID()).build();

        // Act
        swipeService.recordSwipe(event, swiper, swiped, true);

        // Assert
        verify(swipeRepository, times(1)).save(any(Swipe.class));
        verify(matchService, times(1)).checkAndCreateMatch(event, swiper, swiped);
    }

    @Test
    void shouldRecordNopeAndNotCheckMatch() {
        // Arrange
        Event event = Event.builder().id(UUID.randomUUID()).build();
        User swiper = User.builder().id(UUID.randomUUID()).build();
        User swiped = User.builder().id(UUID.randomUUID()).build();

        // Act
        swipeService.recordSwipe(event, swiper, swiped, false);

        // Assert
        verify(swipeRepository, times(1)).save(any(Swipe.class));
        verify(matchService, never()).checkAndCreateMatch(any(), any(), any());
    }
}
