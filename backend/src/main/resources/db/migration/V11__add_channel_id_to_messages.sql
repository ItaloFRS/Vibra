ALTER TABLE messages ADD COLUMN channel_id UUID;

ALTER TABLE messages 
ADD CONSTRAINT fk_message_channel 
FOREIGN KEY (channel_id) 
REFERENCES chat_channels(id) 
ON DELETE CASCADE;

CREATE INDEX idx_messages_channel_id ON messages(channel_id);
