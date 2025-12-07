-- Add parent_id column to posts table for nested comments (replies)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES posts(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);

