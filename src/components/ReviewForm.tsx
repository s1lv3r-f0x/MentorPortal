import React, { useState } from 'react';
import { CreateReviewDto, User } from '../types';

interface ReviewFormProps {
  users: User[];
  onSubmit: (data: CreateReviewDto) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ users, onSubmit }) => {
  const [formData, setFormData] = useState<CreateReviewDto>({
    revieweeId: 0,
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.revieweeId === 0) {
      setError('Please select an employee');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({ revieweeId: 0, content: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Select Employee: *
          <select
            value={formData.revieweeId}
            onChange={(e) => setFormData({ ...formData, revieweeId: Number(e.target.value) })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value={0}>-- Select an employee --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label>
          Review Content: *
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={6}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Write your review here..."
          />
        </label>
      </div>
      <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px' }}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;

