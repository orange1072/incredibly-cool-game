import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_HOST } from '@/constants';
import { API_ENDPOINTS } from './endpoints';

export type ReactionTargetType = 'topic' | 'post';

export interface ReactionStat {
  emoji: string;
  count: number;
  users: number[];
}

export interface ReactionResponse {
  id: number;
  target_type: ReactionTargetType;
  target_id: number;
  user_id: number;
  emoji: string;
  created_at: string;
}

export interface TargetReactionsResponse {
  target_type: ReactionTargetType;
  target_id: number;
  stats: ReactionStat[];
  reactions: ReactionResponse[];
}

export interface CreateReactionRequest {
  user_id: number;
  emoji: string;
}

interface ReactionQueryArgs {
  targetId: number | string;
  targetType: ReactionTargetType;
}

interface AddReactionArgs extends ReactionQueryArgs {
  body: CreateReactionRequest;
}

const buildReactionsUrl = ({ targetId, targetType }: ReactionQueryArgs) =>
  targetType === 'topic'
    ? `${API_ENDPOINTS.TOPICS}/${targetId}/reactions`
    : `${API_ENDPOINTS.POSTS}/${targetId}/reactions`;

const getReactionTag = (targetType: ReactionTargetType) =>
  targetType === 'topic' ? 'TopicReactions' : 'PostReactions';

export const emojiApi = createApi({
  reducerPath: 'emojiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_HOST,
    credentials: 'include',
  }),
  tagTypes: ['TopicReactions', 'PostReactions'],
  endpoints: (builder) => ({
    getReactions: builder.query<TargetReactionsResponse, ReactionQueryArgs>({
      query: (args) => buildReactionsUrl(args),
      providesTags: (_, __, { targetType, targetId }) => [
        { type: getReactionTag(targetType), id: targetId },
      ],
    }),
    addReaction: builder.mutation<ReactionResponse, AddReactionArgs>({
      query: ({ body, ...args }) => ({
        url: buildReactionsUrl(args),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
      invalidatesTags: (_, __, { targetType, targetId }) => [
        { type: getReactionTag(targetType), id: targetId },
      ],
    }),
  }),
});

export const { useGetReactionsQuery, useAddReactionMutation } = emojiApi;
