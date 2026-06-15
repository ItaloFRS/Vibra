-- Table for User Event Interests (Gatekeeper)
CREATE TABLE user_event_interests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    event_id UUID NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    has_ticket BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interest_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_interest_event FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE (user_id, event_id)
);

CREATE INDEX idx_user_event_interests_user ON user_event_interests(user_id);
CREATE INDEX idx_user_event_interests_event ON user_event_interests(event_id);
