import api from './api';
import { User } from '../types';

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
};

