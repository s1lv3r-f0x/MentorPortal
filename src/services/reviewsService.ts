import api from './api';
import { Review, CreateReviewDto } from '../types';

export const reviewsService = {
  create: async (data: CreateReviewDto): Promise<Review> => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  getMentorReviews: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/mentor');
    return response.data;
  },

  getMyReviews: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/my');
    return response.data;
  },
};

