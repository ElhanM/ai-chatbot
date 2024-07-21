import { act, renderHook } from '@testing-library/react';
import { ErrorState, useErrorStore } from '../useErrorStore';
import { makeRequest } from '../utils/makeRequest';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  makeRequest: jest.fn(),
}));

describe('useErrorStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch error data and handle it correctly', async () => {
    const errorMessage = 'Internal server error';

    (makeRequest as jest.Mock).mockImplementation(async ({ set }) => {
      set((state: ErrorState) => {
        state.data = null;
        state.loading = false;
        state.error = errorMessage;
      });
    });

    const { result } = renderHook(() => useErrorStore());

    await act(async () => {
      await result.current.fetchError();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(errorMessage);
  });
});
