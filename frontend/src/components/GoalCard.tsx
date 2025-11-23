import React from 'react';
import { Goal, GoalStatus } from '../types';

interface GoalCardProps {
  goal: Goal;
  onView: () => void;
  onDelete: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onView, onDelete }) => {
  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.Completed:
        return '#4caf50';
      case GoalStatus.InProgress:
        return '#2196f3';
      case GoalStatus.Draft:
        return '#ff9800';
      case GoalStatus.Cancelled:
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.Completed:
        return 'Completed';
      case GoalStatus.InProgress:
        return 'In Progress';
      case GoalStatus.Draft:
        return 'Draft';
      case GoalStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const progress = goal.totalTasks > 0 ? (goal.completedTasks / goal.totalTasks) * 100 : 0;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, flex: 1 }}>{goal.title}</h3>
        <span
          style={{
            backgroundColor: getStatusColor(goal.status),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {getStatusText(goal.status)}
        </span>
      </div>
      <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
        {goal.description || 'No description'}
      </p>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
          <span>Progress</span>
          <span>{goal.completedTasks} / {goal.totalTasks} tasks</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: getStatusColor(goal.status),
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onView} style={{ flex: 1, padding: '8px' }}>
          View Details
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '8px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;

