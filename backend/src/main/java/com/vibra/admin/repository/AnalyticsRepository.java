package com.vibra.admin.repository;

import com.vibra.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsRepository extends JpaRepository<User, UUID> {

    @Query(value = "SELECT COALESCE(AVG(CAST(CAST(u.preferences AS jsonb) ->> 'idade' AS INTEGER)), 0) FROM users u " +
           "JOIN user_event_interests uei ON u.id = uei.user_id " +
           "WHERE uei.event_id = :eventId AND CAST(u.preferences AS jsonb) ->> 'idade' IS NOT NULL", 
           nativeQuery = true)
    Double getAverageAgeByEventId(@Param("eventId") UUID eventId);

    @Query(value = "SELECT COALESCE(CAST(u.preferences AS jsonb) ->> 'genero', 'NÃO INFORMADO') as gender, COUNT(*) FROM users u " +
           "JOIN user_event_interests uei ON u.id = uei.user_id " +
           "WHERE uei.event_id = :eventId " +
           "GROUP BY gender", 
           nativeQuery = true)
    List<Object[]> getGenderDistributionByEventId(@Param("eventId") UUID eventId);

    @Query(value = "SELECT CAST(EXTRACT(HOUR FROM created_at) AS INTEGER) as hour, COUNT(*) FROM messages " +
           "WHERE event_id = :eventId " +
           "GROUP BY hour ORDER BY hour", 
           nativeQuery = true)
    List<Object[]> getPeakInteractionHoursByEventId(@Param("eventId") UUID eventId);

    @Query(value = "SELECT COUNT(DISTINCT user_id) FROM user_event_interests " +
           "WHERE event_id = :eventId", 
           nativeQuery = true)
    Long getTotalUsersReachedByEventId(@Param("eventId") UUID eventId);
}
