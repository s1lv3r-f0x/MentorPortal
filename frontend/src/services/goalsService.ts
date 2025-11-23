import api from './api';
import { Goal, CreateGoalDto, UpdateGoalDto } from '../types';

export const goalsService = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
  },

  getById: async (id: number): Promise<Goal> => {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  create: async (data: CreateGoalDto): Promise<Goal> => {
    const response = await api.post<Goal>('/goals', data);
    return response.data;
  },

  update: async (id: number, data: UpdateGoalDto): Promise<void> => {
    await api.put(`/goals/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};

