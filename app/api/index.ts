import axios from 'axios';

export type IResponseType = Record<string, any> | Record<string, any>[];

export interface IResponse<T extends IResponseType = {}> {
  success: boolean;
  message: string;
  results: T;
}

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
});

export default api;
