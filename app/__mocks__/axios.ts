const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

const mockAxios = jest.fn(() => mockAxiosInstance) as any;

mockAxios.create = jest.fn(() => mockAxiosInstance);

export default mockAxios;
