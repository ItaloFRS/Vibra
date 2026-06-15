package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.UserEventInterest;
import com.vibra.social.repository.UserEventInterestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InterestService {

    private final UserEventInterestRepository interestRepository;

    public InterestService(UserEventInterestRepository interestRepository) {
        this.interestRepository = interestRepository;
    }

    @Transactional
    public void toggleFavorite(User user, Event event) {
        UserEventInterest interest = interestRepository.findByUserAndEvent(user, event)
                .orElse(UserEventInterest.builder()
                        .user(user)
                        .event(event)
                        .isFavorite(false)
                        .hasTicket(false)
                        .build());

        interest.setFavorite(!interest.isFavorite());
        interestRepository.save(interest);
    }
}
