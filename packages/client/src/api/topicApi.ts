import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_HOST } from '@/constants';
import { API_ENDPOINTS } from './endpoints';

export interface TopicResponse {
  id: number;
  title: string;
  user_id: number;
  date: string;
  preview: string;
  tags?: string[];
  reactions_count?: number;
  comments_count?: number;
}

export interface CreateTopicRequest {
  title: string;
  user_id: number;
  preview: string;
  tags?: string[];
}

export type UpdateTopicRequest = Partial<CreateTopicRequest>;

interface UpdateTopicPayload {
  topicId: number | string;
  body: UpdateTopicRequest;
}

interface DeleteTopicResponse {
  message: string;
}

export const topicApi = createApi({
  reducerPath: 'topicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_HOST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  tagTypes: ['Topics', 'Topic'],
  endpoints: (builder) => ({
    getTopics: builder.query<TopicResponse[], void>({
      query: () => API_ENDPOINTS.TOPICS,
      providesTags: (result) =>
        result
          ? [
              ...result.map((topic) => ({
                type: 'Topic' as const,
                id: topic.id,
              })),
              { type: 'Topics' as const, id: 'LIST' },
            ]
          : [{ type: 'Topics' as const, id: 'LIST' }],
    }),
    getTopicById: builder.query<TopicResponse, number | string>({
      query: (id) => `${API_ENDPOINTS.TOPICS}/${id}`,
      providesTags: (_, __, id) => [{ type: 'Topic', id }],
    }),
    createTopic: builder.mutation<TopicResponse, CreateTopicRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.TOPICS,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Topics', id: 'LIST' }],
    }),
    updateTopic: builder.mutation<TopicResponse, UpdateTopicPayload>({
      query: ({ topicId, body }) => ({
        url: `${API_ENDPOINTS.TOPICS}/${topicId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { topicId }) => [
        { type: 'Topic', id: topicId },
        { type: 'Topics', id: 'LIST' },
      ],
    }),
    deleteTopic: builder.mutation<DeleteTopicResponse, number | string>({
      query: (topicId) => ({
        url: `${API_ENDPOINTS.TOPICS}/${topicId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, topicId) => [
        { type: 'Topic', id: topicId },
        { type: 'Topics', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGetTopicByIdQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicApi;
