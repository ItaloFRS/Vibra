package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.Swipe;
import com.vibra.social.repository.SwipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SwipeService {

    private final SwipeRepository swipeRepository;
    private final MatchService matchService;
    private final GatekeeperService gatekeeperService;

    public SwipeService(SwipeRepository swipeRepository, MatchService matchService, GatekeeperService gatekeeperService) {
        this.swipeRepository = swipeRepository;
        this.matchService = matchService;
        this.gatekeeperService = gatekeeperService;
    }

    @Transactional
    public Swipe recordSwipe(Event event, User swiper, User swiped, boolean isLike) {
        if (!gatekeeperService.canSwipe(swiper, event)) {
            throw new RuntimeException("User must favorite the event or have a ticket to swipe.");
        }

        Swipe swipe = Swipe.builder()
                .event(event)
                .swiper(swiper)
                .swiped(swiped)
                .isLike(isLike)
                .build();
        
        Swipe savedSwipe = swipeRepository.save(swipe);

        if (isLike) {
            matchService.checkAndCreateMatch(event, swiper, swiped);
        }

        return savedSwipe;
    }
}
