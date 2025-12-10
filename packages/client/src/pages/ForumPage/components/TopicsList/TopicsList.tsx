import React from 'react';
import styles from './TopicsList.module.scss';
import { MessageCircle, MessageSquare, Tag, ThumbsUp } from 'lucide-react';
import { Comment } from './components/Comment';
import { ReplyForm } from './components/ReplyForm';
import { TopicReactions } from './components/TopicReactions';
import { TopicResponse } from '@/api/topicApi';
import { useGetTopicPostsQuery } from '@/api';

type TopicId = number | null;

type TopicsListProps = {
  filteredTopics: TopicResponse[] | [];
  setSelectedTopic: React.Dispatch<React.SetStateAction<TopicId>>;
  selectedTopic: TopicId;
};

export const TopicsList = ({
  filteredTopics,
  setSelectedTopic,
  selectedTopic,
}: TopicsListProps) => {
  const {
    data: postsData,
    isLoading,
    isError,
  } = useGetTopicPostsQuery(selectedTopic!, {
    skip: !selectedTopic,
  });

  if (!filteredTopics.length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyState}>
          <h3>Темы не найдены</h3>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {filteredTopics.map((topic) => (
        <article key={topic.id} className={styles.topicWrapper}>
          <section
            onClick={() =>
              setSelectedTopic((prevId) =>
                prevId === topic.id ? null : topic.id
              )
            }
            className={styles.topicSection}
          >
            <header className={styles.header}>
              <div>
                <h3>{topic.title}</h3>
                <div className={styles.topicInfo}>
                  <span>
                    <span className={styles.inlineIcon}>☢️</span> {topic.login}
                  </span>
                  {/*<span className={styles.badge}>{topic.authorBadge}</span>*/}
                  <span>{topic.date}</span>
                </div>
              </div>
              <MessageSquare className={`forum-icon ${styles.bright}`} />
            </header>
            <p className={styles.preview}>{topic.preview}</p>
            <div className={styles.tags}>
              {Array.isArray(topic.tags) &&
                topic.tags.length > 0 &&
                topic.tags.map((tag, i) => (
                  <span key={i}>
                    <Tag className={styles.tagIcon} />
                    {tag}
                  </span>
                ))}
            </div>
            <div className={styles.stats}>
              <span className={styles.bright}>
                <ThumbsUp className="forum-icon" />
                {topic.reactions_count}
              </span>
              <span>
                <MessageCircle className="forum-icon" />
                {topic.comments_count}
              </span>
              <TopicReactions topicId={topic.id} />
            </div>
          </section>
          {selectedTopic === topic.id && (
            <div className={styles.commentsSection}>
              <h4>COMMENTS</h4>
              {isLoading && (
                <div className={styles.loading}>Loading comments...</div>
              )}

              {postsData && postsData.length > 0
                ? postsData
                    .filter((comment) => comment.topic_id === topic.id)
                    .map((comment) => (
                      <Comment
                        key={comment.id}
                        {...comment}
                        topicId={topic.id}
                      />
                    ))
                : 'No comments'}
              <ReplyForm topicId={topic.id} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
};
