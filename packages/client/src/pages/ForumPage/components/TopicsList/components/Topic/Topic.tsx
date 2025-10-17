import { ForumTopic } from '@/pages/ForumPage/types'
import styles from './Topic.module.scss'

type TopicProps = {
  key: number
} & ForumTopic

const Topic = ({
  author,
  authorBadge,
  comments,
  date,
  id,
  likes,
  preview,
  tags,
  title,
}: TopicProps) => {
  return <h1>{title}</h1>
}

export default Topic
