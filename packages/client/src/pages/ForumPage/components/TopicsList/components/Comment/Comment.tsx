import { ForumComment } from '@/pages/ForumPage/types'
import styles from './Comment.module.scss'

type CommentProps = ForumComment & {
  key: number
}

const Comment = ({ id, author, avatar, date, text }: CommentProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.avatar}>{avatar}</span>
      <div className={styles.main}>
        <div className={styles.header}>
          <span>{author}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default Comment
