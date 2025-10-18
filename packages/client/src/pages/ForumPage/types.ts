export type ForumPageProps = {
  onNavigate: (page: string) => void
}

export type ForumTopic = {
  id: number
  title: string
  author: string
  authorBadge: string
  date: string
  likes: number
  comments: number
  tags: string[]
  preview: string
}

export type ForumComment = {
  id: number
  author: string
  date: string
  text: string
  avatar: string
}
