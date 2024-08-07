import { makeRequest, RequestMethod } from '@/store/utils/makeRequest';
import api from '@/api';
import { useGuardStore } from '@/store/useGuardStore';
import { AxiosError } from 'axios';

const set = jest.fn((fn) => fn({ loading: false }));

jest.mock('@/api');

describe('makeRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request and set data correctly', async () => {
    const mockedData = { data: { message: 'success' } };
    (api.get as jest.Mock).mockResolvedValue(mockedData);

    await makeRequest({
      endpoint: '/test',
      method: RequestMethod.GET,
      set,
    });

    expect(set).toHaveBeenCalledWith(expect.any(Function));
    expect(set).toHaveBeenLastCalledWith(expect.any(Function));
  });

  it('should handle errors and set error message', async () => {
    const errorMessage = 'Failed to make request. Internal server error.';
    const axiosError = new AxiosError(errorMessage);

    (api.get as jest.Mock).mockRejectedValueOnce(axiosError);

    await makeRequest({
      endpoint: '/test',
      method: RequestMethod.GET,
      set,
    });

    expect(useGuardStore.getState().error).toBe(errorMessage);
    expect(set).toHaveBeenCalledWith(expect.any(Function));
    expect(set).toHaveBeenLastCalledWith(expect.any(Function));
  });
});
