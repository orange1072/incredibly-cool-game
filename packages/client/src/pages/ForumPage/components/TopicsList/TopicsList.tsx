import React, { useState } from 'react'
import { ForumComment, ForumTopic } from '../../types'
import styles from './TopicsList.module.scss'
import { MessageCircle, MessageSquare, Tag, ThumbsUp } from 'lucide-react'
import { comments as mockComments } from '../../mockData'
import Comment from './components/Comment'
import ReplyForm from './components/ReplyForm'

type TopicId = number | null

type TopicsListProps = {
  filteredTopics: ForumTopic[]
  setSelectedTopic: React.Dispatch<React.SetStateAction<TopicId>>
  selectedTopic: TopicId
}

const TopicsList = ({
  filteredTopics,
  setSelectedTopic,
  selectedTopic,
}: TopicsListProps) => {
  const [comments, setComments] = useState<ForumComment[]>(mockComments)

  return (
    <div className={styles.wrapper}>
      {filteredTopics.map((topic) => (
        <article
          key={topic.id}
          className={styles.topicWrapper}
          onClick={() =>
            setSelectedTopic((prevId) =>
              prevId === topic.id ? null : topic.id
            )
          }
        >
          <header className={styles.header}>
            <div>
              <h3>{topic.title}</h3>
              <div className={styles.topicInfo}>
                <span>
                  <span className={styles.inlineIcon}>☢</span> {topic.author}
                </span>
                <span className={styles.badge}>{topic.authorBadge}</span>
                <span>{topic.date}</span>
              </div>
            </div>
            <MessageSquare className={`forum-icon ${styles.bright}`} />
          </header>
          <p className={styles.preview}>{topic.preview}</p>
          <div className={styles.tags}>
            {topic.tags.map((tag, i) => (
              <span key={i}>
                <Tag className={styles.tagIcon} />
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.stats}>
            <span className={styles.bright}>
              <ThumbsUp className="forum-icon" />
              {topic.likes}
            </span>
            <span>
              <MessageCircle className="forum-icon" />
              {topic.comments}
            </span>
          </div>
          {selectedTopic === topic.id && (
            <div
              className={styles.commentsSection}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>COMMENTS</h4>
              {comments.map((comment) => (
                <Comment key={comment.id} {...comment} />
              ))}
              <ReplyForm setComments={setComments} />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export default TopicsList
