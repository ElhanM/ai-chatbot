import { act, renderHook } from '@testing-library/react';
import useUserCheck from '@/hooks/useUserCheck';
import { useLoginStore } from '@/store/useLoginStore';
import { useGuardStore } from '@/store/useGuardStore';
import { getUserFromStorage } from '@/utils/user';
import { router } from 'expo-router';

jest.mock('@/store/useLoginStore');
jest.mock('@/store/useGuardStore');
jest.mock('@/utils/user');
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  },
}));

describe('useUserCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to /chats if user is found in storage', async () => {
    const setUserIdMock = jest.fn();
    let userId: string | null = null;

    jest.mocked(useLoginStore).mockImplementation(() => ({
      setUserId: (id: string | null) => {
        userId = id;
        setUserIdMock(id);
      },
      userId,
    }));

    jest.mocked(getUserFromStorage).mockReturnValue('test-user-id');

    const { rerender } = renderHook(() => useUserCheck());

    // Simulate state change
    act(() => {
      rerender();
    });

    expect(setUserIdMock).toHaveBeenCalledWith('test-user-id');
    expect(router.replace).toHaveBeenCalledWith('/chats');
  });
  test('redirects to /welcome if user is not found in storage', async () => {
    const setUserIdMock = jest.fn();
    jest.mocked(useLoginStore).mockReturnValue({
      setUserId: setUserIdMock,
      userId: null,
    });
    jest.mocked(useGuardStore).mockReturnValue({ error: null });
    jest.mocked(getUserFromStorage).mockReturnValue(null);

    renderHook(() => useUserCheck());

    expect(setUserIdMock).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/welcome');
  });
});
