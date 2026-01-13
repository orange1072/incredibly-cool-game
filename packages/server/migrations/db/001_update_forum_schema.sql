-- Отключаем каскадное удаление на время миграции для избежания блокировок
SET lock_timeout = '5s';

-- 1. Обновляем таблицу reactions: добавляем проверки и удаляем старые ограничения
ALTER TABLE reactions
    DROP CONSTRAINT IF EXISTS reactions_check,
    ADD CONSTRAINT reactions_check
        CHECK (
            (topic_id IS NOT NULL AND post_id IS NULL) OR
            (topic_id IS NULL AND post_id IS NOT NULL)
            );

-- 2. Удаляем старые индексы и создаём новые частичные уникальные индексы
DROP INDEX IF EXISTS reactions_topic_id_user_id_emoji_key;
DROP INDEX IF EXISTS reactions_post_id_user_id_emoji_key;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_reactions_unique_topic
    ON reactions (topic_id, user_id, emoji)
    WHERE topic_id IS NOT NULL;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_reactions_unique_post
    ON reactions (post_id, user_id, emoji)
    WHERE post_id IS NOT NULL;

-- 3. Добавляем отсутствующие внешние ключи (если их нет)
DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_reactions_topic' AND table_name = 'reactions'
        ) THEN
            ALTER TABLE reactions
                ADD CONSTRAINT fk_reactions_topic
                    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_reactions_post' AND table_name = 'reactions'
        ) THEN
            ALTER TABLE reactions
                ADD CONSTRAINT fk_reactions_post
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
        END IF;
    END $$;

-- 4. Обновляем индексы для производительности
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reactions_post_id ON reactions(post_id) WHERE post_id IS NOT NULL;

-- 5. Добавляем функцию для древовидных комментариев (если её нет)
CREATE OR REPLACE FUNCTION get_comment_tree(topic_id_param INTEGER, max_depth INTEGER DEFAULT 3)
    RETURNS TABLE (
                      id INTEGER,
                      content TEXT,
                      login TEXT,
                      topic_id INTEGER,
                      parent_id INTEGER,
                      created_at TIMESTAMP,
                      depth INTEGER,
                      reactions_count BIGINT
                  ) AS $$
WITH RECURSIVE comment_tree AS (
    SELECT
        p.id, p.content, p.login, p.topic_id,
        p.parent_id, p.created_at,
        0 AS depth,
        COALESCE(r.reactions_count, 0) AS reactions_count
    FROM posts p
             LEFT JOIN (
        SELECT post_id, COUNT(*) AS reactions_count
        FROM reactions
        WHERE post_id IS NOT NULL
        GROUP BY post_id
    ) r ON p.id = r.post_id
    WHERE p.topic_id = topic_id_param AND p.parent_id IS NULL

    UNION ALL

    SELECT
        p.id, p.content, p.login, p.topic_id,
        p.parent_id, p.created_at,
        ct.depth + 1,
        COALESCE(r.reactions_count, 0)
    FROM posts p
             INNER JOIN comment_tree ct ON p.parent_id = ct.id
             LEFT JOIN (
        SELECT post_id, COUNT(*) AS reactions_count
        FROM reactions
        WHERE post_id IS NOT NULL
        GROUP BY post_id
    ) r ON p.id = r.post_id
    WHERE ct.depth < max_depth - 1
)
SELECT * FROM comment_tree
ORDER BY created_at ASC;
$$ LANGUAGE sql;

-- 6. Обновляем комментарии для документации
COMMENT ON TABLE reactions IS 'Реакции (эмодзи) на топики и посты. Одна реакция может относиться только к одному типу сущности.';
COMMENT ON COLUMN reactions.emoji IS 'Unicode-эмодзи реакции (например: 👍, ❤️, 😂). Валидируется на уровне приложения.';