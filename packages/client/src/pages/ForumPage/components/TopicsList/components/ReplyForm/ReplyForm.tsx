import { PixelButton } from '@/components/PixelButton'
import styles from './ReplyForm.module.scss'
import { Send } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { ForumComment } from '@/pages/ForumPage/types'

type ReplyFormProps = {
  setComments: React.Dispatch<React.SetStateAction<ForumComment[]>>
}

const ReplyForm = ({ setComments }: ReplyFormProps) => {
  const [commentText, setCommentText] = useState<string>('')

  const formSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (commentText) {
      let now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }
      setComments((prevComments) => {
        let newComments = [...prevComments]
        newComments.push({
          id: prevComments.length,
          author: 'You',
          date: now.toLocaleString('ru-RU', options),
          text: commentText,
          avatar: '☢️',
        })
        return newComments
      })
    }
  }

  return (
    <form onSubmit={formSubmit} className={styles.form}>
      <textarea
        name="comment"
        id="comment"
        value={commentText}
        placeholder="Write a reply..."
        onChange={(e) => setCommentText(e.target.value)}
      />
      <PixelButton type="submit" variant="primary" size="sm" icon={<Send />}>
        Reply
      </PixelButton>
    </form>
  )
}

export default ReplyForm
