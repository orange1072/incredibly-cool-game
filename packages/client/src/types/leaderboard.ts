export interface LeaderboardData {
  username: string;
  score: number;
  level: number;
}

export interface LeaderboardSubmitRequest {
  data: LeaderboardData;
  ratingFieldName: string;
  teamName: string;
}

export interface LeaderboardFetchRequest {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}

export interface LeaderboardResponseItem {
  data: {
    username: string;
    score: number;
    level: number;
    [key: string]: string | number;
  };
}

export interface LeaderboardItem {
  username: string;
  score: number;
  level: number;
  rank?: number;
}
