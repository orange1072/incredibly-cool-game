import { useMemo, useState } from 'react';
import { ForumComment } from '@/pages/ForumPage/types';
import { useAddReactionMutation, useGetReactionsQuery } from '@/api/emojiApi';
import styles from './Comment.module.scss';

const fallbackEmojiPalette = ['👍', '🔥', '💀', '❤️', '😂'] as const;
const CURRENT_USER_ID = 1; // TODO: заменить на реального пользователя после интеграции auth

export const Comment: React.FC<ForumComment> = ({
  id,
  topicId,
  author,
  avatar,
  date,
  content,
  reactions: initialReactions = [],
}) => {
  const {
    data,
    isFetching: isLoadingReactions,
    isError,
    refetch,
  } = useGetReactionsQuery(
    { targetType: 'post', targetId: id },
    {
      skip: !id,
    }
  );

  const [addReaction, { isLoading: isAdding }] = useAddReactionMutation();
  const [reactedEmojis, setReactedEmojis] = useState<Set<string>>(
    () => new Set()
  );
  const [optimisticBump, setOptimisticBump] = useState<Record<string, number>>(
    {}
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const backendReactions =
    data?.stats?.map(({ emoji, count }) => ({ emoji, count })) ||
    initialReactions;

  const availableEmojis = useMemo(() => {
    const fromBackend = backendReactions.map((r) => r.emoji);
    return Array.from(new Set([...fromBackend, ...fallbackEmojiPalette]));
  }, [backendReactions]);

  const sortedReactions = useMemo(
    () =>
      [...backendReactions]
        .map((reaction) => ({
          ...reaction,
          count:
            reaction.count +
            (optimisticBump[reaction.emoji]
              ? optimisticBump[reaction.emoji]
              : 0),
        }))
        .sort((a, b) => {
          if (b.count === a.count) {
            return a.emoji.localeCompare(b.emoji);
          }
          return b.count - a.count;
        }),
    [backendReactions, optimisticBump]
  );

  const handleAddReaction = async (emoji: string) => {
    if (reactedEmojis.has(emoji) || isAdding) {
      return;
    }

    setReactedEmojis((prev) => new Set(prev).add(emoji));
    setOptimisticBump((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
    setIsPickerOpen(false);

    try {
      await addReaction({
        targetType: 'post',
        targetId: id,
        body: { user_id: CURRENT_USER_ID, emoji },
      }).unwrap();
      setOptimisticBump((prev) => {
        const { [emoji]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      setReactedEmojis((prev) => {
        const next = new Set(prev);
        next.delete(emoji);
        return next;
      });
      setOptimisticBump((prev) => {
        const { [emoji]: _, ...rest } = prev;
        return rest;
      });
    } finally {
      refetch();
    }
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.avatar}>{avatar}</span>
      <div className={styles.main}>
        <div className={styles.header}>
          <span>{author}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <p>{content}</p>
        <div className={styles.reactions}>
          <div className={styles.reactionsList}>
            {isError && (
              <span className={styles.error}>Не удалось загрузить реакции</span>
            )}
            {sortedReactions.map((reaction) => (
              <button
                key={`${id}-${reaction.emoji}`}
                className={`${styles.reaction} ${
                  reactedEmojis.has(reaction.emoji) ? styles.reacted : ''
                }`}
                type="button"
                onClick={() => handleAddReaction(reaction.emoji)}
                aria-label={`Добавить реакцию ${reaction.emoji}`}
                disabled={isAdding}
              >
                <span>{reaction.emoji}</span>
                <span className={styles.count}>{reaction.count}</span>
              </button>
            ))}
          </div>
          <div className={styles.pickerWrapper}>
            <button
              type="button"
              className={styles.addReaction}
              onClick={() => setIsPickerOpen((open) => !open)}
              aria-expanded={isPickerOpen}
              disabled={isAdding}
            >
              {isLoadingReactions ? 'Загрузка...' : '+ Эмодзи'}
            </button>
            {isPickerOpen && (
              <div className={styles.picker}>
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={styles.pickerEmoji}
                    onClick={() => handleAddReaction(emoji)}
                    aria-label={`Поставить ${emoji}`}
                    disabled={reactedEmojis.has(emoji) || isAdding}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
