-- Table for Swipes (Likes/Nopes)
CREATE TABLE swipes (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    swiper_id UUID NOT NULL,
    swiped_id UUID NOT NULL,
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_swipe_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_swiper FOREIGN KEY (swiper_id) REFERENCES users(id),
    CONSTRAINT fk_swiped FOREIGN KEY (swiped_id) REFERENCES users(id),
    UNIQUE (event_id, swiper_id, swiped_id)
);

-- Table for Matches
CREATE TABLE matches (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    user1_id UUID NOT NULL,
    user2_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_match_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_match_user1 FOREIGN KEY (user1_id) REFERENCES users(id),
    CONSTRAINT fk_match_user2 FOREIGN KEY (user2_id) REFERENCES users(id),
    UNIQUE (event_id, user1_id, user2_id)
);

-- Table for Chat Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    match_id UUID,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id),
    CONSTRAINT fk_msg_match FOREIGN KEY (match_id) REFERENCES matches(id)
);

-- Indexes for performance
CREATE INDEX idx_swipes_event ON swipes(event_id);
CREATE INDEX idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX idx_matches_event ON matches(event_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX idx_messages_event ON messages(event_id);
CREATE INDEX idx_messages_match ON messages(match_id);
