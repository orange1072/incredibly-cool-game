export interface LeaderboardData {
  username: string;
  score: number;
  level: number;
  timeAlive?: string;
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
    timeAlive: number;
    time: string | number;
    [key: string]: string | number;
  };
}

export interface LeaderboardItem {
  username: string;
  score: number;
  level: number;
  rank?: number;
  timeAlive?: number;
  time?: string;
}
