import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsService } from '../services/reviewsService';
import { Review } from '../types';
import ReviewList from '../components/ReviewList';

const MentorReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewsService.getMentorReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = selectedEmployeeId
    ? reviews.filter(r => r.revieweeId === selectedEmployeeId)
    : reviews;

  const uniqueEmployees = Array.from(
    new Set(reviews.map(r => ({ id: r.revieweeId, name: r.revieweeName })))
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Reviews</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.fullName}</span>
          <button onClick={() => navigate('/mentor/dashboard')} style={{ marginRight: '10px' }}>
            Back to Dashboard
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Filter by employee:
          <select
            value={selectedEmployeeId || ''}
            onChange={(e) => setSelectedEmployeeId(e.target.value ? Number(e.target.value) : null)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">All employees</option>
            {uniqueEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </label>
      </div>

      {filteredReviews.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          No reviews found
        </div>
      ) : (
        <ReviewList reviews={filteredReviews} />
      )}
    </div>
  );
};

export default MentorReviewsPage;

