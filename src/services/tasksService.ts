import api from './api';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';

export const tasksService = {
  getByGoalId: async (goalId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks/goals/${goalId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (goalId: number, data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>(`/tasks/goals/${goalId}`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateTaskDto): Promise<void> => {
    await api.put(`/tasks/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  reorder: async (goalId: number, taskIds: number[]): Promise<void> => {
    await api.put(`/tasks/goals/${goalId}/reorder`, { taskIds });
  },
};

