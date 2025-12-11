export const API_ENDPOINTS = {
  USER: {
    BASE: '/user',
    PROFILE: {
      AVATAR: '/user/profile/avatar',
      PASSWORD: '/user/profile/password',
    },
  },
  TOPICS: '/api/topics',
  POSTS: '/api/posts',
} as const;
