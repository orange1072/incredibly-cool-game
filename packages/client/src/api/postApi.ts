import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_HOST } from '@/constants';
import { API_ENDPOINTS } from './endpoints';

export interface PostResponse {
  id: number;
  content: string;
  author: string;
  date: string;
  avatar?: string;
  user_id?: number;
  topic_id: number;
  parent_id?: number;
  replies?: PostResponse[];
  replies_count?: number;
  reactions_count?: number;
}

export interface CreatePostRequest {
  content: string;
  author: string;
  user_id?: number;
  parent_id?: number;
}

export interface UpdatePostRequest {
  content: string;
}

export interface CreatePostPayload {
  topicId: number | string;
  body: CreatePostRequest;
}

export interface UpdatePostPayload {
  postId: number | string;
  body: UpdatePostRequest;
  topicId?: number | string;
}

export interface DeletePostPayload {
  postId: number | string;
  topicId?: number | string;
  parentId?: number;
}

export interface GetRepliesPayload {
  postId: number | string;
}

interface DeletePostResponse {
  message: string;
}

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_HOST,
    credentials: 'include',
  }),
  tagTypes: ['TopicPosts', 'Post', 'PostReplies'],
  endpoints: (builder) => ({
    getTopicPosts: builder.query<PostResponse[], number | string>({
      query: (topicId) => `${API_ENDPOINTS.TOPICS}/${topicId}/posts`,
      providesTags: (_, __, topicId) => [{ type: 'TopicPosts', id: topicId }],
    }),
    getPostById: builder.query<PostResponse, number | string>({
      query: (postId) => `${API_ENDPOINTS.POSTS}/${postId}`,
      providesTags: (_, __, postId) => [{ type: 'Post', id: postId }],
    }),
    createPost: builder.mutation<PostResponse, CreatePostPayload>({
      query: ({ topicId, body }) => ({
        url: `${API_ENDPOINTS.TOPICS}/${topicId}/posts`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
      invalidatesTags: (_, __, { topicId, body }) => {
        const tags: {
          type: 'TopicPosts' | 'Post' | 'PostReplies';
          id: number | string;
        }[] = [{ type: 'TopicPosts', id: topicId }];
        if (body.parent_id) {
          tags.push({ type: 'PostReplies', id: body.parent_id });
        }
        return tags;
      },
    }),
    updatePost: builder.mutation<PostResponse, UpdatePostPayload>({
      query: ({ postId, body }) => ({
        url: `${API_ENDPOINTS.POSTS}/${postId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
      invalidatesTags: (_, __, { postId, topicId }) => {
        const tags: {
          type: 'TopicPosts' | 'Post' | 'PostReplies';
          id: number | string;
        }[] = [{ type: 'Post', id: postId }];
        if (topicId) {
          tags.push({ type: 'TopicPosts', id: topicId });
        }
        return tags;
      },
    }),
    deletePost: builder.mutation<DeletePostResponse, DeletePostPayload>({
      query: ({ postId }) => ({
        url: `${API_ENDPOINTS.POSTS}/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { postId, topicId, parentId }) => {
        const tags: {
          type: 'TopicPosts' | 'Post' | 'PostReplies';
          id: number | string;
        }[] = [{ type: 'Post', id: postId }];
        if (topicId) {
          tags.push({ type: 'TopicPosts', id: topicId });
        }
        if (parentId) {
          tags.push({ type: 'PostReplies', id: parentId });
        }
        return tags;
      },
    }),
    getPostReplies: builder.query<PostResponse[], GetRepliesPayload>({
      query: ({ postId }) => `${API_ENDPOINTS.POSTS}/${postId}/replies`,
      providesTags: (_, __, { postId }) => [
        { type: 'PostReplies', id: postId },
      ],
    }),
  }),
});

export const {
  useGetTopicPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostRepliesQuery,
} = postApi;
