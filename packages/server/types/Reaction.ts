export interface Reaction {
  id: number
  topic_id: number
  user_id: number
  emoji: string
  created_at: Date
}

export interface CreateReactionRequest {
  user_id: number
  emoji: string
}

export interface ReactionResponse {
  id: number
  topic_id: number
  user_id: number
  emoji: string
  created_at: string
}

export interface ReactionStats {
  emoji: string
  count: number
  users: number[]
}
