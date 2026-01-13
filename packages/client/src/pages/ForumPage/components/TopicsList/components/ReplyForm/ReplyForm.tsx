import { PixelButton } from '@/components/PixelButton';
import styles from './ReplyForm.module.scss';
import { Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useCreatePostMutation } from '@/api';
import { useSelector } from '@/store/store';
import { selectUser } from '@/store/slices/userSlice';

type ReplyFormProps = {
  topicId: number;
};

export const ReplyForm = ({ topicId }: ReplyFormProps) => {
  const [commentText, setCommentText] = useState<string>('');
  const [createPost, { isLoading }] = useCreatePostMutation();
  const user = useSelector(selectUser);

  const formSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createPost({
      topicId: topicId,
      body: {
        content: commentText,
        login: String(user?.login),
        topic_id: topicId,
      },
    });
    setCommentText('');
  };

  return (
    <form onSubmit={formSubmit} className={styles.form}>
      <textarea
        name="comment"
        id="comment"
        value={commentText}
        placeholder="Write a reply..."
        onChange={(e) => setCommentText(e.target.value)}
      />
      <PixelButton
        type="submit"
        variant="primary"
        disabled={isLoading}
        size="sm"
        icon={<Send />}
      >
        Reply
      </PixelButton>
    </form>
  );
};
