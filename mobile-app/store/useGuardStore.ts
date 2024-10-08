import { ErrorCodes } from '@/api-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface GuardState {
  errorCode: ErrorCodes | null;
  error: string | null;
  reset: () => void;
}

export const useGuardStore = create(
  immer<GuardState>((set) => ({
    errorCode: null,
    error: null,
    reset: () => {
      set((state) => {
        state.error = null;
        state.errorCode = null;
      });
    },
  }))
);
