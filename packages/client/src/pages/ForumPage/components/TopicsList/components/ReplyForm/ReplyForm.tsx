import { PixelButton } from '@/components/PixelButton';
import styles from './ReplyForm.module.scss';
import { Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ForumComment } from '@/pages/ForumPage/types';
import { useCreatePostMutation } from '@/api';
import { useSelector } from '@/store/store';
import { selectUser } from '@/store/slices/userSlice';

type ReplyFormProps = {
  setComments: React.Dispatch<React.SetStateAction<ForumComment[]>>;
  topicId: number;
};

export const ReplyForm = ({ setComments, topicId }: ReplyFormProps) => {
  const [commentText, setCommentText] = useState<string>('');
  const [createPost, { isLoading }] = useCreatePostMutation();
  const user = useSelector(selectUser);

  const formSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createPost({
      topicId: topicId,
      body: {
        user_id: Number(user?.id),
        content: commentText,
        author: user?.first_name || '',
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
      <PixelButton type="submit" variant="primary" size="sm" icon={<Send />}>
        Reply
      </PixelButton>
    </form>
  );
};
