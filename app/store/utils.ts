import api, { IResponse } from '@/api';
import axios, { AxiosError } from 'axios';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface FetchOptions {
  endpoint: string;
  set: (fn: (state: any) => void) => void;
}

export const fetchData = async ({ endpoint, set }: FetchOptions) => {
  set((state) => {
    state.loading = true;
    state.error = null;
  });

  try {
    environment === 'development' && (await delay(1000));
    const response = await api.get<IResponse>(endpoint);

    set((state) => {
      state.data = response.data;
    });
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch data. Internal server error.';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IResponse>;

      if (axiosError.response) {
        const apiError = axiosError.response.data;
        errorMessage = apiError.message || errorMessage;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    }

    set((state) => {
      state.error = errorMessage;
    });
  } finally {
    set((state) => {
      state.loading = false;
    });
  }
};
