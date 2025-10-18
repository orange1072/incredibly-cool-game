import { PixelButton } from '@/components/PixelButton'
import styles from './TopicForm.module.scss'
import { Plus, Send } from 'lucide-react'
import { FormEvent, useReducer, useState } from 'react'
import { Input } from '@/components/Input'

export const TopicForm = () => {
  const [isOpen, toggleOpen] = useReducer((open) => !open, false)
  const [topicTitle, setTopicTitle] = useState('')
  const [topicPreview, setTopicPreview] = useState('')

  const formSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTopicTitle('')
    setTopicPreview('')
    toggleOpen()
  }

  return (
    <>
      <PixelButton
        onClick={() => toggleOpen()}
        variant="primary"
        icon={<Plus />}
      >
        New Topic
      </PixelButton>
      {isOpen && (
        <div onClick={() => toggleOpen()} className={styles.dialogWrapper}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>Create New Topic</h3>
            <form onSubmit={formSubmit} className={styles.form}>
              <Input
                label="Title"
                placeholder="Topic title..."
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
              />
              <div>
                <label className={styles.label} htmlFor="topic-description">
                  Description
                </label>
                <textarea
                  name="preview"
                  id="topic-description"
                  placeholder="Describe your topic..."
                  value={topicPreview}
                  onChange={(e) => setTopicPreview(e.target.value)}
                />
              </div>
              <PixelButton variant="primary" icon={<Send />}>
                Publish
              </PixelButton>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
