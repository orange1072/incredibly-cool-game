export const API_ENDPOINTS = {
  USER: {
    BASE: '/user',
    PROFILE: {
      AVATAR: '/user/profile/avatar',
      PASSWORD: '/user/profile/password',
    },
  },
  LEADERBOARD: {
    BASE: '/leaderboard',
    ALL: '/leaderboard/all',
  },
} as const;
