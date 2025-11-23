import api from './api';
import { Employee, Goal, UpdateGoalDto } from '../types';

export const mentorsService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/mentors/employees');
    return response.data;
  },

  getEmployeeGoals: async (employeeId: number): Promise<Goal[]> => {
    const response = await api.get<Goal[]>(`/mentors/employees/${employeeId}/goals`);
    return response.data;
  },

  approveGoal: async (goalId: number, data: UpdateGoalDto): Promise<void> => {
    await api.put(`/mentors/goals/${goalId}/approve`, data);
  },
};

