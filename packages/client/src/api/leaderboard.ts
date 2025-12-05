import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/constants';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from './endpoints';
import {
  LeaderboardData,
  LeaderboardSubmitRequest,
  LeaderboardFetchRequest,
  LeaderboardResponseItem,
  LeaderboardItem,
} from '@/types/leaderboard';

const TEAM_NAME = '404:Speed Not Found';
const RATING_FIELD = 'score';

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Leaderboard'],
  endpoints: (builder) => ({
    sendLeaderboardResult: builder.mutation<void, LeaderboardData>({
      queryFn: async (data, _api, _extraOptions, fetchWithBQ) => {
        if (data.score < 0) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Score cannot be negative',
            },
          };
        }

        if (data.level < 1) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Level must be at least 1',
            },
          };
        }

        if (!data.username || data.username.trim().length === 0) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Username cannot be empty',
            },
          };
        }

        if (data.username.length > 50) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Username is too long (max 50 characters)',
            },
          };
        }

        const payload: LeaderboardSubmitRequest = {
          data: {
            ...data,
            username: data.username.trim(),
          },
          ratingFieldName: RATING_FIELD,
          teamName: TEAM_NAME,
        };

        const result = await fetchWithBQ({
          url: API_ENDPOINTS.LEADERBOARD.BASE,
          method: 'POST',
          body: JSON.stringify(payload),
        });

        return result.error ? { error: result.error } : { data: undefined };
      },
      invalidatesTags: ['Leaderboard'],
    }),
    getLeaderboard: builder.query<
      LeaderboardItem[],
      { cursor?: number; limit?: number } | void
    >({
      query: (params) => {
        const payload: LeaderboardFetchRequest = {
          ratingFieldName: RATING_FIELD,
          cursor: params?.cursor || 0,
          limit: params?.limit || 10,
        };
        return {
          url: API_ENDPOINTS.LEADERBOARD.ALL,
          method: 'POST',
          body: JSON.stringify(payload),
        };
      },
      transformResponse: (
        response: LeaderboardResponseItem[],
        _meta,
        arg
      ): LeaderboardItem[] => {
        return response.map((item, index) => ({
          username: item.data.username,
          score: item.data.score,
          level: item.data.level,
          rank: arg?.cursor ? arg.cursor + index + 1 : index + 1,
          timeAlive:
            typeof item.data.timeAlive === 'number'
              ? item.data.timeAlive
              : undefined,
          recordDate:
            typeof item.data.recordDate === 'string'
              ? item.data.recordDate
              : undefined,
        }));
      },
      providesTags: ['Leaderboard'],
    }),
  }),
});

export const { useSendLeaderboardResultMutation, useGetLeaderboardQuery } =
  leaderboardApi;
