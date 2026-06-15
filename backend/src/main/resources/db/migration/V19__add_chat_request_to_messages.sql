ALTER TABLE messages ADD COLUMN chat_request_id UUID;
ALTER TABLE messages ADD CONSTRAINT fk_messages_chat_request FOREIGN KEY (chat_request_id) REFERENCES chat_requests(id) ON DELETE CASCADE;
ALTER TABLE messages ALTER COLUMN event_id DROP NOT NULL;
