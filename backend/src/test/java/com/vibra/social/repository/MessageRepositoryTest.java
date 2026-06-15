package com.vibra.social.repository;

import com.vibra.identity.entity.User;
import com.vibra.identity.repository.UserRepository;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Message;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@org.springframework.boot.test.context.SpringBootTest
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
class MessageRepositoryTest {

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @Autowired
    private MessageRepository messageRepository;

    @Test
    void shouldCountUnreadDirectChatsCorrectly() {
        // Arrange
        User user1 = User.builder()
                .email("u1@test.com")
                .fullName("User 1")
                .password("password")
                .role(com.vibra.identity.entity.UserRole.ROLE_USER)
                .build();
        User user2 = User.builder()
                .email("u2@test.com")
                .fullName("User 2")
                .password("password")
                .role(com.vibra.identity.entity.UserRole.ROLE_USER)
                .build();
        entityManager.persist(user1);
        entityManager.persist(user2);

        com.vibra.events.entity.Event event = com.vibra.events.entity.Event.builder()
                .title("Test Event")
                .eventDate(java.time.ZonedDateTime.now().plusDays(1))
                .category("Party")
                .producerId(user1.getId())
                .build();
        entityManager.persist(event);

        Match match = Match.builder().user1(user1).user2(user2).event(event).build();
        entityManager.persist(match);

        // Unread message from user 2 to user 1
        Message m1 = Message.builder().match(match).event(event).sender(user2).content("Hi").build();
        entityManager.persist(m1);

        entityManager.flush();

        // Act
        long count = messageRepository.countUnreadDirectChatsForUser(user1.getId());

        // Assert
        assertEquals(1, count);
    }

    @Test
    void shouldCountUnreadChannelChatsCorrectly() {
        // Arrange
        User user1 = User.builder()
                .email("c1@test.com")
                .fullName("User 1")
                .password("password")
                .role(com.vibra.identity.entity.UserRole.ROLE_USER)
                .build();
        User sender = User.builder()
                .email("s1@test.com")
                .fullName("Sender")
                .password("password")
                .role(com.vibra.identity.entity.UserRole.ROLE_USER)
                .build();
        entityManager.persist(user1);
        entityManager.persist(sender);

        com.vibra.events.entity.Event event = com.vibra.events.entity.Event.builder()
                .title("Channel Event")
                .eventDate(java.time.ZonedDateTime.now().plusDays(1))
                .category("Party")
                .producerId(user1.getId())
                .build();
        entityManager.persist(event);

        // User 1 has interest in the event
        com.vibra.social.entity.UserEventInterest interest = com.vibra.social.entity.UserEventInterest.builder()
                .user(user1)
                .event(event)
                .isFavorite(true)
                .build();
        entityManager.persist(interest);

        com.vibra.social.entity.ChatChannel channel = com.vibra.social.entity.ChatChannel.builder()
                .name("General")
                .event(event)
                .build();
        entityManager.persist(channel);

        // Unread message in channel from sender
        Message m1 = Message.builder().channel(channel).event(event).sender(sender).content("Hello").build();
        entityManager.persist(m1);

        entityManager.flush();

        // Act
        long count = messageRepository.countUnreadChannelChatsForUser(user1.getId(), java.time.ZonedDateTime.now().minusDays(5));

        // Assert
        assertEquals(1, count);
    }
}
