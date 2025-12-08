import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_HOST } from '@/constants';
import { API_ENDPOINTS } from './endpoints';

export interface ReactionStat {
  emoji: string;
  count: number;
  users: number[];
}

export interface ReactionResponse {
  id: number;
  topic_id: number;
  user_id: number;
  emoji: string;
  created_at: string;
}

export interface TopicReactionsResponse {
  topic_id: number;
  stats: ReactionStat[];
  reactions: ReactionResponse[];
}

export interface CreateReactionRequest {
  user_id: number;
  emoji: string;
}

export const emojiApi = createApi({
  reducerPath: 'emojiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_HOST,
    credentials: 'include',
  }),
  tagTypes: ['TopicReactions'],
  endpoints: (builder) => ({
    getTopicReactions: builder.query<TopicReactionsResponse, number | string>({
      query: (topicId) => `${API_ENDPOINTS.TOPICS}/${topicId}/reactions`,
      providesTags: (_, __, topicId) => [
        { type: 'TopicReactions', id: topicId },
      ],
    }),
    addTopicReaction: builder.mutation<
      ReactionResponse,
      { topicId: number | string; body: CreateReactionRequest }
    >({
      query: ({ topicId, body }) => ({
        url: `${API_ENDPOINTS.TOPICS}/${topicId}/reactions`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
      invalidatesTags: (_, __, { topicId }) => [
        { type: 'TopicReactions', id: topicId },
      ],
    }),
  }),
});

export const { useGetTopicReactionsQuery, useAddTopicReactionMutation } =
  emojiApi;
