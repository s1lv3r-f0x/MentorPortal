import React from 'react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div
      style={{
        padding: '20px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>{review.reviewerName}</strong> reviewed <strong>{review.revieweeName}</strong>
        </div>
        <span style={{ color: '#999', fontSize: '12px' }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p style={{ margin: 0, color: '#333' }}>{review.content}</p>
    </div>
  );
};

export default ReviewCard;

