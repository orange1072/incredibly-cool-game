export type ReactionTargetType = 'topic' | 'post'

export interface CreateReactionRequest {
  user_id: number
  emoji: string
}

export interface ReactionResponse {
  id: number
  target_type: ReactionTargetType
  target_id: number
  user_id: number
  emoji: string
  created_at: string
}

export interface ReactionStats {
  emoji: string
  count: number
  users: number[]
}
