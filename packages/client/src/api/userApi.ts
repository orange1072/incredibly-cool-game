import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from './endpoints';

interface User {
  name: string;
  secondName: string;
  avatar?: string;
}

interface UpdateAvatarResponse {
  avatar: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    fetchFn: async (url, options = {}) => {
      if (options.body instanceof FormData) {
        const headers = new Headers(options.headers);
        headers.delete('Content-Type');
        options.headers = headers;
      }
      return fetch(url, options);
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => API_ENDPOINTS.USER.BASE,
      providesTags: ['User'],
    }),
    updateUserAvatar: builder.mutation<UpdateAvatarResponse, File>({
      query: (avatar) => {
        const formData = new FormData();
        formData.append('avatar', avatar);
        return {
          url: '/user/profile/avatar',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: API_ENDPOINTS.USER.PROFILE.PASSWORD,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserAvatarMutation,
  useChangePasswordMutation,
} = userApi;
