export interface Topic {
  id: number
  title: string
  author: string
  author_badge: string
  created_at: Date
  preview: string
  tags?: string[]
}
