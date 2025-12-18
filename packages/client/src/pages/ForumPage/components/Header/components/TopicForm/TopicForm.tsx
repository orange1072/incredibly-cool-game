import { PixelButton } from '@/components/PixelButton';
import styles from './TopicForm.module.scss';
import { Plus, Send } from 'lucide-react';
import { FormEvent, useReducer, useState } from 'react';
import { Input } from '@/components/Input';
import { useSelector } from '@/store/store';
import { selectUser } from '@/store/slices/userSlice';
import { useCreateTopicMutation } from '@/api';

export const TopicForm = () => {
  const [isOpen, toggleOpen] = useReducer((open) => !open, false);
  const user = useSelector(selectUser);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicPreview, setTopicPreview] = useState('');
  const [createTopic, { isLoading }] = useCreateTopicMutation();

  const formSubmit = async (e: FormEvent) => {
    try {
      await createTopic({
        title: topicTitle,
        preview: topicPreview,
        user_id: Number(user?.id),
      });
    } catch (error) {
      console.error(`Creating topic error: ${error}`);
    } finally {
      e.preventDefault();
      setTopicTitle('');
      setTopicPreview('');
      toggleOpen();
    }
  };

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
              <PixelButton
                variant="primary"
                type="submit"
                disabled={isLoading}
                icon={<Send />}
              >
                Publish
              </PixelButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
