package com.vibra.social.repository;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.identity.entity.UserRole;
import com.vibra.social.entity.UserEventInterest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibra.identity.repository.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserEventInterestRepositoryTest {

    @Autowired
    private UserRepository repository;

    @Autowired
    private TestEntityManager entityManager;

    private Event event;
    private User mainUser;

    @BeforeEach
    void setUp() {
        User producer = User.builder()
                .email("producer@test.com")
                .password("password")
                .fullName("Producer")
                .role(UserRole.ROLE_PRODUCER)
                .build();
        entityManager.persist(producer);

        event = Event.builder()
                .title("Test Event")
                .description("Description")
                .location("Location")
                .eventDate(java.time.ZonedDateTime.now().plusDays(1))
                .producerId(producer.getId())
                .build();
        entityManager.persist(event);

        mainUser = User.builder()
                .email("main@test.com")
                .password("password")
                .fullName("Main User")
                .role(UserRole.ROLE_USER)
                .preferences(Map.of(
                        "wantsMatches", true,
                        "gender", "Homem",
                        "age", 25,
                        "matchGender", "Mulher",
                        "matchAgeMin", 18,
                        "matchAgeMax", 30
                ))
                .build();
        entityManager.persist(mainUser);

        UserEventInterest mainInterest = UserEventInterest.builder()
                .user(mainUser)
                .event(event)
                .isFavorite(true)
                .build();
        entityManager.persist(mainInterest);
    }

    @Test
    void shouldFindPotentialSwipersWithStrictFilters() {
        // User B: Perfect match
        User userB = createUser("b@test.com", Map.of(
                "wantsMatches", true,
                "gender", "Mulher",
                "age", 22,
                "matchGender", "Homem",
                "matchAgeMin", 20,
                "matchAgeMax", 35
        ));
        createInterest(userB, true);

        // User C: Wrong Gender for Main (Main wants Mulher, C is Homem)
        User userC = createUser("c@test.com", Map.of(
                "wantsMatches", true,
                "gender", "Homem",
                "age", 22,
                "matchGender", "Mulher",
                "matchAgeMin", 18,
                "matchAgeMax", 30
        ));
        createInterest(userC, true);

        // User D: Main matches D, but D doesn't match Main (D wants age 30+, Main is 25)
        User userD = createUser("d@test.com", Map.of(
                "wantsMatches", true,
                "gender", "Mulher",
                "age", 22,
                "matchGender", "Homem",
                "matchAgeMin", 30,
                "matchAgeMax", 45
        ));
        createInterest(userD, true);

        // User E: Outside Main's age range (Main wants 18-30, E is 35)
        User userE = createUser("e@test.com", Map.of(
                "wantsMatches", true,
                "gender", "Mulher",
                "age", 35,
                "matchGender", "Homem",
                "matchAgeMin", 18,
                "matchAgeMax", 40
        ));
        createInterest(userE, true);

        // User F: wantsMatches = false
        User userF = createUser("f@test.com", Map.of(
                "wantsMatches", false,
                "gender", "Mulher",
                "age", 25,
                "matchGender", "Homem",
                "matchAgeMin", 18,
                "matchAgeMax", 30
        ));
        createInterest(userF, true);

        entityManager.flush();

        List<User> results = repository.findPotentialSwipers(event.getId(), mainUser.getId());

        // This test IS EXPECTED TO FAIL until we implement the new filtering logic
        // Currently it only filters by event interest and excluding mainUser
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getEmail()).isEqualTo("b@test.com");
    }

    private User createUser(String email, Map<String, Object> prefs) {
        User user = User.builder()
                .email(email)
                .password("password")
                .fullName("User " + email)
                .role(UserRole.ROLE_USER)
                .preferences(prefs)
                .build();
        return entityManager.persist(user);
    }

    private void createInterest(User user, boolean isFavorite) {
        UserEventInterest interest = UserEventInterest.builder()
                .user(user)
                .event(event)
                .isFavorite(isFavorite)
                .build();
        entityManager.persist(interest);
    }
}
