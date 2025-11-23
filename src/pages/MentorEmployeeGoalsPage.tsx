import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorsService } from '../services/mentorsService';
import { tasksService } from '../services/tasksService';
import { Goal, Task, UpdateTaskDto } from '../types';
import TaskList from '../components/TaskList';

const MentorEmployeeGoalsPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadGoals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const loadGoals = async () => {
    try {
      const data = await mentorsService.getEmployeeGoals(Number(employeeId));
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async (goalId: number) => {
    try {
      const data = await tasksService.getByGoalId(goalId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleGoalClick = async (goal: Goal) => {
    setSelectedGoal(goal);
    await loadTasks(goal.id);
  };

  const handleUpdateTask = async (taskId: number, data: UpdateTaskDto) => {
    try {
      await tasksService.update(taskId, data);
      if (selectedGoal) {
        await loadTasks(selectedGoal.id);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate('/mentor/dashboard')}>← Back to Dashboard</button>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.fullName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div>
          <h2>Goals</h2>
          {goals.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No goals found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleGoalClick(goal)}
                  style={{
                    padding: '15px',
                    border: selectedGoal?.id === goal.id ? '2px solid #2196f3' : '1px solid #ddd',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: selectedGoal?.id === goal.id ? '#e3f2fd' : '#fff',
                  }}
                >
                  <h3 style={{ margin: 0 }}>{goal.title}</h3>
                  <p style={{ color: '#666', fontSize: '12px', margin: '5px 0' }}>
                    {goal.completedTasks} / {goal.totalTasks} tasks completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedGoal ? (
            <div>
              <h2>{selectedGoal.title}</h2>
              <p style={{ color: '#666' }}>{selectedGoal.description || 'No description'}</p>
              <div style={{ marginTop: '20px' }}>
                <h3>Tasks</h3>
                <TaskList
                  tasks={tasks}
                  onUpdate={handleUpdateTask}
                  onDelete={() => {}}
                />
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              Select a goal to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorEmployeeGoalsPage;

