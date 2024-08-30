import api, { ErrorCodes, IResponse, IResponseType } from '@/api-client';
import axios, { AxiosError } from 'axios';
import { Toast } from 'toastify-react-native';
import { useGuardStore } from '../useGuardStore';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete',
}

interface RequestOptions {
  endpoint: string;
  method: RequestMethod;
  data?: any;
  set: (fn: (state: any) => void) => void;
  pagination?: boolean;
}

export const makeRequest = async ({ endpoint, method, data, set, pagination }: RequestOptions) => {
  set((state) => {
    if (!pagination) {
      state.loading = true;
    }
  });

  let errorCode: string | null = null;

  try {
    if (environment === 'development') {
      await delay(1000);
    }

    const response = await api.request<IResponse<IResponseType>>({
      url: endpoint,
      method,
      data,
    });

    set((state) => {
      if (pagination && Array.isArray(response.data.results)) {
        const { results, ...rest } = response.data;
        const prevResults = state?.data?.results ?? [];
        state.data = { ...rest, results: [...prevResults, ...results] };
      } else {
        state.data = response.data;
      }
    });
  } catch (error: unknown) {
    handleRequestError(error, method, set, errorCode);
  } finally {
    set((state) => {
      state.loading = false;
    });
  }
};

const handleRequestError = (
  error: unknown,
  method: RequestMethod,
  _set: (fn: (state: any) => void) => void,
  errorCode: string | null
) => {
  let errorMessage = 'Failed to make request. Internal server error.';

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<IResponse<IResponseType>>;

    if (axiosError.response) {
      const apiError = axiosError.response.data;
      errorMessage = apiError.message || errorMessage;
      if (apiError.errorCode) {
        errorCode = apiError.errorCode;
      }
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }
  }

  if (method !== RequestMethod.GET) {
    Toast.error(errorMessage, 'top');
  } else {
    const guardStore = useGuardStore.getState();
    guardStore.error = errorMessage;
    if (errorCode) {
      Toast.error(errorMessage, 'top');
      guardStore.errorCode = errorCode as ErrorCodes;
    }
  }
};
