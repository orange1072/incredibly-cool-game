-- Create topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  author_badge VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  preview TEXT,
  tags TEXT[]
);

-- Create index on topic id for faster lookups
CREATE INDEX IF NOT EXISTS idx_topics_id ON topics(id);

