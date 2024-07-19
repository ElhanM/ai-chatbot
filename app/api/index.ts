import axios from 'axios';

export interface IResponse {
  success: boolean;
  message: string;
  results: Record<string, unknown> | Record<string, unknown>[];
}

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
});

export default api;
