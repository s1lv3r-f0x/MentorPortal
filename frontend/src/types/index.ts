export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export enum GoalStatus {
  Draft = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface Goal {
  id: number;
  employeeId: number;
  title: string;
  description: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  completedTasks: number;
}

export interface CreateGoalDto {
  title: string;
  description: string;
}

export interface UpdateGoalDto {
  title: string;
  description: string;
  status: GoalStatus;
}

export enum TaskStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  Blocked = 3
}

export interface Task {
  id: number;
  goalId: number;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate?: string | null;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string | null;
}

export interface Employee {
  id: number;
  email: string;
  fullName: string;
  totalGoals: number;
  activeGoals: number;
}

export interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  revieweeId: number;
  revieweeName: string;
  content: string;
  createdAt: string;
}

export interface CreateReviewDto {
  revieweeId: number;
  content: string;
}

