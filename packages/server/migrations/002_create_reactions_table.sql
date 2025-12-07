-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(topic_id, user_id, emoji)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reactions_topic_id ON reactions(topic_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_emoji ON reactions(emoji);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_reactions_topic_emoji ON reactions(topic_id, emoji);

