package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.UserEventInterest;
import com.vibra.social.repository.UserEventInterestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class GatekeeperService {

    private final UserEventInterestRepository userEventInterestRepository;

    public GatekeeperService(UserEventInterestRepository userEventInterestRepository) {
        this.userEventInterestRepository = userEventInterestRepository;
    }

    @Transactional(readOnly = true)
    public boolean canSwipe(User user, Event event) {
        Optional<UserEventInterest> interest = userEventInterestRepository.findByUserAndEvent(user, event);
        
        return interest.map(ui -> ui.isFavorite() || ui.isHasTicket())
                       .orElse(false);
    }
}
