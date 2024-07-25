import { renderHook } from '@testing-library/react';
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
    jest.mocked(useLoginStore).mockReturnValue({
      setUserId: setUserIdMock,
      userId: null,
    });
    jest.mocked(useGuardStore).mockReturnValue({ error: null });
    jest.mocked(getUserFromStorage).mockReturnValue('test-user-id');

    renderHook(() => useUserCheck());

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

  test('does nothing if userId exists', async () => {
    jest.mocked(useLoginStore).mockReturnValue({
      setUserId: jest.fn(),
      userId: 'existing-user-id',
    });
    jest.mocked(useGuardStore).mockReturnValue({ error: null });
    jest.mocked(getUserFromStorage).mockReturnValue(null);

    renderHook(() => useUserCheck());

    expect(router.replace).not.toHaveBeenCalled();
  });

  test('does nothing if there is an error', async () => {
    jest.mocked(useLoginStore).mockReturnValue({
      setUserId: jest.fn(),
      userId: null,
    });
    jest.mocked(useGuardStore).mockReturnValue({ error: 'some error' });
    jest.mocked(getUserFromStorage).mockReturnValue(null);

    renderHook(() => useUserCheck());

    expect(router.replace).not.toHaveBeenCalled();
  });
});
