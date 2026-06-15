package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Swipe;
import com.vibra.social.repository.MatchRepository;
import com.vibra.social.repository.SwipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import com.vibra.identity.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MatchService {

    private final MatchRepository matchRepository;
    private final SwipeRepository swipeRepository;
    private final UserRepository userRepository;

    public MatchService(MatchRepository matchRepository, SwipeRepository swipeRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.swipeRepository = swipeRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getPotentialSwipersWithSorting(java.util.UUID eventId, User currentUser) {
        validateUserProfile(currentUser);

        log.debug("Finding potential matches for user: {} (ID: {}) in event: {}", 
            currentUser.getEmail(), currentUser.getId(), eventId);

        List<User> candidates = userRepository.findPotentialSwipers(eventId, currentUser.getId());
        log.debug("Found {} initial candidates from database", candidates.size());

        List<User> filtered = candidates.stream()
                .filter(candidate -> isMutualMatch(currentUser, candidate))
                .collect(Collectors.toList());

        log.debug("Filtered down to {} candidates after mutual preference check", filtered.size());

        if (filtered.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> userVibes = extractVibes(currentUser);
        Set<String> userVibesSet = new HashSet<>(userVibes);

        return filtered.stream()
                .sorted((u1, u2) -> {
                    long score1 = countCommonVibes(u1, userVibesSet);
                    long score2 = countCommonVibes(u2, userVibesSet);
                    return Long.compare(score2, score1);
                })
                .collect(Collectors.toList());
    }

    private void validateUserProfile(User user) {
        if (user.getPreferences() == null) {
            throw new RuntimeException("Perfil incompleto: por favor, configure suas preferências de match.");
        }
        
        Map<String, Object> prefs = user.getPreferences();
        List<String> missingFields = new java.util.ArrayList<>();
        
        if (prefs.get("gender") == null) missingFields.add("Gênero");
        if (prefs.get("age") == null) missingFields.add("Idade");
        if (prefs.get("matchGender") == null) missingFields.add("Gênero de Interesse");
        if (prefs.get("matchAgeMin") == null) missingFields.add("Idade Mínima");
        if (prefs.get("matchAgeMax") == null) missingFields.add("Idade Máxima");
        
        List<String> vibes = extractVibes(user);
        if (vibes.isEmpty()) missingFields.add("Vibes");
        
        if (!missingFields.isEmpty()) {
            throw new RuntimeException("Perfil incompleto: falta preencher " + String.join(", ", missingFields) + ".");
        }
    }

    private boolean isMutualMatch(User current, User target) {
        // Current user preferences
        Map<String, Object> currentPrefs = current.getPreferences();
        String currentGender = (String) currentPrefs.get("gender");
        Integer currentAge = parseInteger(currentPrefs.get("age"));
        String currentMatchGender = (String) currentPrefs.get("matchGender");
        Integer currentMatchAgeMin = parseInteger(currentPrefs.get("matchAgeMin"));
        Integer currentMatchAgeMax = parseInteger(currentPrefs.get("matchAgeMax"));

        // Target user preferences
        Map<String, Object> targetPrefs = target.getPreferences();
        String targetGender = (String) targetPrefs.get("gender");
        Integer targetAge = parseInteger(targetPrefs.get("age"));
        String targetMatchGender = (String) targetPrefs.get("matchGender");
        Integer targetMatchAgeMin = parseInteger(targetPrefs.get("matchAgeMin"));
        Integer targetMatchAgeMax = parseInteger(targetPrefs.get("matchAgeMax"));

        // 1. Current user's requirements for Target
        if (!checkPreferences(currentMatchGender, currentMatchAgeMin, currentMatchAgeMax, targetGender, targetAge, target.getEmail(), "Current -> Target")) {
            return false;
        }

        // 2. Target user's requirements for Current
        if (!checkPreferences(targetMatchGender, targetMatchAgeMin, targetMatchAgeMax, currentGender, currentAge, target.getEmail(), "Target -> Current")) {
            return false;
        }

        return true;
    }

    private boolean checkPreferences(String matchGender, Integer minAge, Integer maxAge, String actualGender, Integer actualAge, String targetEmail, String direction) {
        // Gender check
        if (matchGender != null && !matchGender.equals("Todos")) {
            if (!matchGender.equals(actualGender)) {
                log.debug("Match rejected ({}): Gender mismatch. Expected: {}, Actual: {} (User: {})", 
                    direction, matchGender, actualGender, targetEmail);
                return false;
            }
        }

        // Age check
        if (actualAge == null) {
            log.debug("Match rejected ({}): Actual age is null (User: {})", direction, targetEmail);
            return false;
        }
        if (minAge != null && actualAge < minAge) {
            log.debug("Match rejected ({}): User too young. Min: {}, Actual: {} (User: {})", 
                direction, minAge, actualAge, targetEmail);
            return false;
        }
        if (maxAge != null && actualAge > maxAge) {
            log.debug("Match rejected ({}): User too old. Max: {}, Actual: {} (User: {})", 
                direction, maxAge, actualAge, targetEmail);
            return false;
        }

        return true;
    }

    private Integer parseInteger(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Integer) return (Integer) obj;
        if (obj instanceof Number) return ((Number) obj).intValue();
        if (obj instanceof String) {
            try {
                return Integer.parseInt((String) obj);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private List<String> extractVibes(User user) {
        if (user.getPreferences() == null) return Collections.emptyList();
        Object vibesObj = user.getPreferences().get("vibes");
        if (vibesObj instanceof List) {
            return (List<String>) vibesObj;
        }
        return Collections.emptyList();
    }

    private long countCommonVibes(User user, Set<String> targetVibes) {
        List<String> vibes = extractVibes(user);
        if (vibes.isEmpty()) return 0;
        return vibes.stream().filter(targetVibes::contains).count();
    }

    @Transactional
    public void checkAndCreateMatch(Event event, User currentSwiper, User swipedUser) {
        Optional<Swipe> mutualSwipe = swipeRepository.findByEventAndSwiperAndSwiped(event, swipedUser, currentSwiper);
        
        if (mutualSwipe.isPresent() && mutualSwipe.get().isLike()) {
            Match match = Match.builder()
                    .event(event)
                    .user1(swipedUser)
                    .user2(currentSwiper)
                    .build();
            matchRepository.save(match);
        }
    }

    @Transactional(readOnly = true)
    public java.util.List<Match> getMatchesForUserInEvent(User user, Event event) {
        return matchRepository.findMatchesByUserAndEvent(user, event);
    }

    @Transactional(readOnly = true)
    public long countAllMatchesForUser(User user) {
        return matchRepository.countAllMatchesForUser(user);
    }
}
