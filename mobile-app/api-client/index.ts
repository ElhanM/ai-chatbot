import { getUserFromStorage } from '@/utils/user';
import axios from 'axios';

export type IResponseType = Record<string, any> | Record<string, any>[];

export enum ErrorCodes {
  GUARD_FAILURE = 'GUARD_FAILURE',
}

export interface IResponse<T extends IResponseType = {}> {
  success: boolean;
  message: string;
  results: T;
  errorCode?: ErrorCodes | null;
  count?: number;
}

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const userId = getUserFromStorage() || '';

  config.headers.Authorization = userId;
  return config;
});

export default api;
