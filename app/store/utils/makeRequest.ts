import api, { ErrorCodes, IResponse, IResponseType } from '@/api';
import axios, { AxiosError, AxiosResponse } from 'axios';
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
}

// TODO: Test + refactor

export const makeRequest = async ({ endpoint, method, data, set }: RequestOptions) => {
  set((state) => {
    state.loading = true;
  });
  let errorCode: string | null = null;

  try {
    environment === 'development' && (await delay(1000));

    let response: AxiosResponse<IResponse<IResponseType>>;

    switch (method) {
      case RequestMethod.GET:
        response = await api.get<IResponse<IResponseType>>(endpoint);
        break;
      case RequestMethod.POST:
        response = await api.post<IResponse<IResponseType>>(endpoint, data);
        break;
      case RequestMethod.PATCH:
        response = await api.patch<IResponse<IResponseType>>(endpoint, data);
        break;
      case RequestMethod.PUT:
        response = await api.put<IResponse<IResponseType>>(endpoint, data);
        break;
      case RequestMethod.DELETE:
        response = await api.delete<IResponse<IResponseType>>(endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    set((state) => {
      state.data = response.data;
    });
  } catch (error: unknown) {
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

    useGuardStore.getState().error = errorMessage;
    if (errorCode === ErrorCodes.GUARD_FAILURE) {
      useGuardStore.getState().errorCode = ErrorCodes.GUARD_FAILURE;
    }
    if (method !== RequestMethod.GET) {
      Toast.error(errorMessage, 'top');
    }
  } finally {
    set((state) => {
      state.loading = false;
    });
  }
};
