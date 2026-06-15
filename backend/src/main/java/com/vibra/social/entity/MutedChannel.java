package com.vibra.social.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "muted_channels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MutedChannel {

    @EmbeddedId
    private MutedChannelId id;
    
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MutedChannelId implements Serializable {
        private UUID userId;
        private UUID channelId;
    }
}
