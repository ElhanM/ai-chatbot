import { IResponse } from '@/api';
import { act, renderHook } from '@testing-library/react';
import { HealthState, useHealthStore } from '../useHealthStore';
import { makeRequest } from '../utils';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  makeRequest: jest.fn(),
}));

describe('useHealthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch health data successfully', async () => {
    const data: IResponse = {
      success: true,
      message: 'Server is healthy',
      results: {},
    };

    (makeRequest as jest.Mock).mockImplementation(async ({ set }) => {
      set((state: HealthState) => {
        state.data = data;
        state.loading = false;
      });
    });

    const { result } = renderHook(() => useHealthStore());

    await act(async () => {
      await result.current.fetchHealth();
    });

    expect(result.current.data).toEqual(data);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
