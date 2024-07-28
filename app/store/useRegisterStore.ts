import { IResponse } from '@/api';
import { setUserInStorage } from '@/utils/user';
import { router } from 'expo-router';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useGuardStore } from './useGuardStore';
import { makeRequest, RequestMethod } from './utils/makeRequest';
import { useLoginStore } from './useLoginStore';

interface RegisterData {
  id: string;
  email: string;
}

export interface RegisterState {
  data: IResponse<RegisterData> | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useRegisterStore = create(
  immer<RegisterState>((set) => ({
    data: null,
    loading: false,
    register: async (name: string, email: string, password: string) => {
      await makeRequest({
        endpoint: '/auth/register',
        method: RequestMethod.POST,
        data: { name, email, password },
        set,
      });

      router.replace('/login');
    },
  }))
);
