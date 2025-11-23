import React, { useState } from 'react';
import { CreateTaskDto } from '../types';

interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    dueDate: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '', dueDate: null });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.title?.[0] ||
                          err.response?.data?.Title?.[0] ||
                          (typeof err.response?.data === 'string' ? err.response.data : null) ||
                          err.message || 
                          'Failed to save task';
      setError(errorMessage);
      console.error('Task creation error:', err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Title: *
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label>
          Due Date:
          <input
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || null })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px' }}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px' }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

