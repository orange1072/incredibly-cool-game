import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { API_URL } from '@/config/api';

export interface SignupRequestProps {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword?: string;
}

export interface SigninRequestProps {
  login: string;
  password: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
}

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUser: builder.mutation<UserProfile, void>({
      query: () => ({
        url: `/auth/user`,
        method: 'GET',
      }),
    }),
    signUp: builder.mutation<{ id: number }, SignupRequestProps>({
      query: (body) => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<void, SigninRequestProps>({
      query: (body) => ({
        url: 'auth/signin',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetUserMutation,
  useSignUpMutation,
  useSignInMutation,
  useLogoutMutation,
} = authAPI;
