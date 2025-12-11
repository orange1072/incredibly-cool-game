-- Создание таблиц в правильном порядке для обеспечения целостности внешних ключей
-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
                                      id SERIAL PRIMARY KEY,
                                      login VARCHAR(255) NOT NULL,
                                      created_at TIMESTAMP DEFAULT NOW(),
                                      password VARCHAR(255) NOT NULL,
                                      email VARCHAR(255) NOT NULL
);

-- Таблица топиков
CREATE TABLE IF NOT EXISTS topics (
                                      id SERIAL PRIMARY KEY,
                                      title VARCHAR(255) NOT NULL,
                                      login VARCHAR(255) NOT NULL,
                                      preview TEXT NOT NULL,
                                      tags TEXT[]
);

-- Таблица постов (комментариев и ответов)
CREATE TABLE IF NOT EXISTS posts (
                                     id SERIAL PRIMARY KEY,
                                     content TEXT NOT NULL,
                                     login VARCHAR(255) NOT NULL,
                                     topic_id INTEGER NOT NULL,
                                     parent_id INTEGER,
                                     CONSTRAINT fk_topic
                                         FOREIGN KEY(topic_id)
                                             REFERENCES topics(id)
                                             ON DELETE CASCADE,
                                     CONSTRAINT fk_parent
                                         FOREIGN KEY(parent_id)
                                             REFERENCES posts(id)
                                             ON DELETE CASCADE
);

-- Таблица реакций (эмодзи)
CREATE TABLE IF NOT EXISTS reactions (
                                         id SERIAL PRIMARY KEY,
                                         topic_id INTEGER,
                                         post_id INTEGER,
                                         user_id INTEGER NOT NULL,
                                         emoji TEXT NOT NULL,
                                         created_at TIMESTAMP DEFAULT NOW(),
    -- Проверка: должно быть заполнено либо topic_id, либо post_id, но не оба сразу и не ни одного
                                         CONSTRAINT reactions_check
                                             CHECK (
                                                 (topic_id IS NOT NULL AND post_id IS NULL) OR
                                                 (topic_id IS NULL AND post_id IS NOT NULL)
                                                 ),
    -- Внешние ключи
                                         CONSTRAINT fk_reactions_topic
                                             FOREIGN KEY(topic_id)
                                                 REFERENCES topics(id)
                                                 ON DELETE CASCADE,
                                         CONSTRAINT fk_reactions_post
                                             FOREIGN KEY(post_id)
                                                 REFERENCES posts(id)
                                                 ON DELETE CASCADE,
                                         CONSTRAINT fk_users
                                             FOREIGN KEY(user_id)
                                                 REFERENCES users(id)
                                                 ON DELETE CASCADE
);

-- Создание индексов для производительности

-- Индексы для posts
CREATE INDEX IF NOT EXISTS idx_posts_topic_id ON posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);
-- CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Индексы для reactions
CREATE INDEX IF NOT EXISTS idx_reactions_topic_id ON reactions(topic_id) WHERE topic_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id) WHERE post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);

-- Частичные уникальные индексы для предотвращения дубликатов реакций
-- Уникальность для реакций на топики
CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique_topic
    ON reactions (topic_id, user_id, emoji)
    WHERE topic_id IS NOT NULL;

-- Уникальность для реакций на посты
CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique_post
    ON reactions (post_id, user_id, emoji)
    WHERE post_id IS NOT NULL;

-- Индексы для ускорения подсчета реакций
CREATE INDEX IF NOT EXISTS idx_reactions_count_topic ON reactions(topic_id) WHERE topic_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reactions_count_post ON reactions(post_id) WHERE post_id IS NOT NULL;

-- Дополнительные индексы для оптимизации запросов
-- CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at DESC);

--Ограничение reactions_check
ALTER TABLE reactions
    ADD CONSTRAINT reactions_check
        CHECK (
            (topic_id IS NOT NULL AND post_id IS NULL) OR
            (topic_id IS NULL AND post_id IS NOT NULL)
            );


-- Комментарии для документации
COMMENT ON TABLE topics IS 'Топики форума';
COMMENT ON COLUMN topics.tags IS 'Массив тегов для топика';

COMMENT ON TABLE posts IS 'Посты: комментарии к топикам и ответы на комментарии';
COMMENT ON COLUMN posts.parent_id IS 'ID родительского поста для ответов (NULL для корневых комментариев)';

COMMENT ON TABLE reactions IS 'Реакции (эмодзи) на топики и посты';
COMMENT ON COLUMN reactions.emoji IS 'Эмодзи реакции, например: 👍, ❤️, 😂';
COMMENT ON CONSTRAINT reactions_check ON reactions IS 'Гарантирует, что реакция привязана либо к топику, либо к посту, но не к обоим сразу';

-- Функция для рекурсивного получения комментариев (опционально для PostgreSQL)
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
    -- Корневые комментарии (без родителя)
    SELECT
        p.id,
        p.content,
        p.login,
        p.topic_id,
        p.parent_id,
        p.created_at,
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

    -- Рекурсивная часть: ответы на комментарии
    SELECT
        p.id,
        p.content,
        p.login,
        p.topic_id,
        p.parent_id,
        p.created_at,
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

COMMENT ON FUNCTION get_comment_tree IS 'Рекурсивная функция для получения дерева комментариев с ограничением глубины';