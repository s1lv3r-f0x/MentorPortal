import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsService } from '../services/reviewsService';
import { usersService } from '../services/usersService';
import { CreateReviewDto, User } from '../types';
import ReviewForm from '../components/ReviewForm';

const ReviewsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsers(data.filter(u => u.id !== user?.id));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async (data: CreateReviewDto) => {
    try {
      await reviewsService.create(data);
      alert('Review created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create review');
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Create Review</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.fullName}</span>
          <button onClick={() => navigate(user?.role === 'Mentor' ? '/mentor/dashboard' : '/goals')} style={{ marginRight: '10px' }}>
            Back
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <ReviewForm users={users} onSubmit={handleCreateReview} />
    </div>
  );
};

export default ReviewsPage;

