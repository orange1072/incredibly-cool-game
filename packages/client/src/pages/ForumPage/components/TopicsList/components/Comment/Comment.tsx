import { ForumComment } from '@/pages/ForumPage/types'
import styles from './Comment.module.scss'

type CommentProps = ForumComment & {
  key: number
}

const Comment = ({ id, author, avatar, date, text }: CommentProps) => {
  return (
    <div className={styles.wrapper}>
      <span>{avatar}</span>
      <div className={styles.header}>
        <span>{author}</span>
        <span>{date}</span>
      </div>
      <p>{text}</p>
    </div>
  )
}

export default Comment
