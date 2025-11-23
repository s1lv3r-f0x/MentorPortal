import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { goalsService } from '../services/goalsService';
import { Goal, CreateGoalDto } from '../types';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalsService.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (data: CreateGoalDto) => {
    try {
      await goalsService.create(data);
      await loadGoals();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsService.delete(id);
        await loadGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Goals</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.fullName}</span>
          <button onClick={() => navigate('/reviews')} style={{ marginRight: '10px' }}>
            Reviews
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ marginRight: '10px' }}>
            {showForm ? 'Cancel' : 'New Goal'}
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>Create New Goal</h2>
          <GoalForm onSubmit={handleCreateGoal} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onView={() => navigate(`/goals/${goal.id}`)}
            onDelete={() => handleDeleteGoal(goal.id)}
          />
        ))}
      </div>

      {goals.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No goals yet. Create your first goal!</p>
          <button onClick={() => setShowForm(true)}>Create Goal</button>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;

