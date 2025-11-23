import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (data: { title: string; description: string; status: TaskStatus; dueDate?: string | null }) => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      dueDate: formData.dueDate || null,
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Completed:
        return '#4caf50';
      case TaskStatus.InProgress:
        return '#2196f3';
      case TaskStatus.Blocked:
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Completed:
        return 'Completed';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.Blocked:
        return 'Blocked';
      default:
        return 'Not Started';
    }
  };

  if (isEditing) {
    return (
      <div style={{ padding: '15px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) as TaskStatus })}
              style={{ padding: '8px', marginRight: '10px' }}
            >
              <option value={TaskStatus.NotStarted}>Not Started</option>
              <option value={TaskStatus.InProgress}>In Progress</option>
              <option value={TaskStatus.Completed}>Completed</option>
              <option value={TaskStatus.Blocked}>Blocked</option>
            </select>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              style={{ padding: '8px' }}
            />
          </div>
          <div>
            <button type="submit" style={{ marginRight: '10px' }}>Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: task.status === TaskStatus.Completed ? '#f5f5f5' : '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, textDecoration: task.status === TaskStatus.Completed ? 'line-through' : 'none' }}>
            {task.title}
          </h3>
          <p style={{ color: '#666', margin: '5px 0' }}>{task.description || 'No description'}</p>
          <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#999' }}>
            <span
              style={{
                backgroundColor: getStatusColor(task.status),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '3px',
              }}
            >
              {getStatusText(task.status)}
            </span>
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.completedAt && (
              <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={onDelete} style={{ backgroundColor: '#f44336', color: 'white' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

