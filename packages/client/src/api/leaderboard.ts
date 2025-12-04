import { API_URL } from '@/constants';
import { getAuthToken } from '@/utils/auth';
import {
  LeaderboardData,
  LeaderboardSubmitRequest,
  LeaderboardFetchRequest,
  LeaderboardResponseItem,
  LeaderboardItem,
} from '@/types/leaderboard';

const TEAM_NAME = 'incredibly-cool-team';
const RATING_FIELD = 'score';

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const sendLeaderboardResult = async (
  data: LeaderboardData
): Promise<void> => {
  const payload: LeaderboardSubmitRequest = {
    data,
    ratingFieldName: RATING_FIELD,
    teamName: TEAM_NAME,
  };

  try {
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to submit leaderboard result: ${response.status}`
      );
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to connect to the server');
    }
    throw error;
  }
};

export const getLeaderboard = async (params?: {
  cursor?: number;
  limit?: number;
}): Promise<LeaderboardItem[]> => {
  const payload: LeaderboardFetchRequest = {
    ratingFieldName: RATING_FIELD,
    cursor: params?.cursor || 0,
    limit: params?.limit || 10,
  };

  try {
    const response = await fetch(`${API_URL}/leaderboard/all`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }

    const result: LeaderboardResponseItem[] = await response.json();

    return result.map((item, index) => ({
      username: item.data.username,
      score: item.data.score,
      level: item.data.level,
      rank: params?.cursor ? params.cursor + index + 1 : index + 1,
    }));
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to connect to the server');
    }
    throw error;
  }
};
