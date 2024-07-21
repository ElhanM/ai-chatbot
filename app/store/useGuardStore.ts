import { ErrorCodes } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface GuardState {
  errorCode: ErrorCodes | null;
  resetErrorCode: () => void;
}

export const useGuardStore = create(
  immer<GuardState>((set) => ({
    errorCode: null,
    resetErrorCode: () => {
      set((state) => {
        state.errorCode = null;
      });
    },
  }))
);
