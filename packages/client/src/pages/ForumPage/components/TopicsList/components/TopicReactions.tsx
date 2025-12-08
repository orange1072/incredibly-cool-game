import { useMemo, useState } from 'react';
import {
  useAddTopicReactionMutation,
  useGetTopicReactionsQuery,
} from '@/api/emojiApi';
import styles from '../TopicsList.module.scss';

const fallbackEmojiPalette = ['👍', '🔥', '💀', '❤️', '😂'] as const;
const CURRENT_USER_ID = 1; // TODO: заменить на реального пользователя после интеграции auth

type TopicReactionsProps = {
  topicId: number;
};

export const TopicReactions = ({ topicId }: TopicReactionsProps) => {
  const {
    data,
    isFetching: isLoading,
    isError,
    refetch,
  } = useGetTopicReactionsQuery(topicId);
  const [addReaction, { isLoading: isAdding }] = useAddTopicReactionMutation();

  const [reactedEmojis, setReactedEmojis] = useState<Set<string>>(
    () => new Set()
  );
  const [optimisticBump, setOptimisticBump] = useState<Record<string, number>>(
    {}
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const backendReactions = data?.stats || [];

  const availableEmojis = useMemo(() => {
    const fromBackend = backendReactions.map((r) => r.emoji);
    return Array.from(new Set([...fromBackend, ...fallbackEmojiPalette]));
  }, [backendReactions]);

  const sortedReactions = useMemo(
    () =>
      backendReactions
        .map((reaction) => ({
          ...reaction,
          count: Number(reaction.count) + (optimisticBump[reaction.emoji] || 0),
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
        topicId,
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
    <div className={styles.reactionsRow}>
      <div className={styles.reactionList}>
        {isError && (
          <span className={styles.reactionsError}>
            Не удалось загрузить реакции
          </span>
        )}
        {isLoading && sortedReactions.length === 0 && (
          <span className={styles.reactionsLoading}>Загрузка эмодзи...</span>
        )}
        {sortedReactions.map((reaction) => (
          <button
            key={`${topicId}-${reaction.emoji}`}
            className={`${styles.reactionButton} ${
              reactedEmojis.has(reaction.emoji) ? styles.reacted : ''
            }`}
            type="button"
            onClick={() => handleAddReaction(reaction.emoji)}
            disabled={isAdding}
            aria-label={`Поставить реакцию ${reaction.emoji}`}
          >
            <span>{reaction.emoji}</span>
            <span className={styles.reactionCount}>{reaction.count}</span>
          </button>
        ))}
      </div>
      <div className={styles.reactionsPickerWrapper}>
        <button
          type="button"
          className={styles.reactionAdd}
          onClick={() => setIsPickerOpen((open) => !open)}
          aria-expanded={isPickerOpen}
          disabled={isAdding}
        >
          + Эмодзи
        </button>
        {isPickerOpen && (
          <div className={styles.reactionsPicker}>
            {availableEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={styles.reactionPickerEmoji}
                onClick={() => handleAddReaction(emoji)}
                disabled={reactedEmojis.has(emoji) || isAdding}
                aria-label={`Добавить ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
