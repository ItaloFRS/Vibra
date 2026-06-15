CREATE TABLE chat_requests (
    id UUID PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_requests_sender FOREIGN KEY (sender_id) REFERENCES users(id),
    CONSTRAINT fk_chat_requests_receiver FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE INDEX idx_chat_requests_sender ON chat_requests(sender_id);
CREATE INDEX idx_chat_requests_receiver ON chat_requests(receiver_id);
CREATE INDEX idx_chat_requests_status ON chat_requests(status);
