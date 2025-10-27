import { SERVER_HOST } from '@/constants';
import { API_ENDPOINTS } from './endpoints';

export const buildApiUrl = (endpoint: string): string => {
  return `${SERVER_HOST}${endpoint}`;
};

export const getEndpoint = (path: keyof typeof API_ENDPOINTS) => {
  return API_ENDPOINTS[path];
};
