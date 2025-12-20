export type ForumComment = {
  id: number;
  topicId: number;
  author: string;
  date: string;
  content: string;
  avatar?: string;
  reactions?: {
    emoji: string;
    count: number;
  }[];
};
