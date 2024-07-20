const mockAxiosInstance = {
  get: jest.fn(),
  create: jest.fn().mockReturnThis(),
};

const mockAxios = jest.fn(() => mockAxiosInstance) as any;

mockAxios.create = jest.fn(() => mockAxiosInstance);

export default mockAxios;
