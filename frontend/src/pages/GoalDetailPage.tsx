import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { goalsService } from '../services/goalsService';
import { tasksService } from '../services/tasksService';
import { Goal, Task, CreateTaskDto, UpdateTaskDto } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import GoalForm from '../components/GoalForm';

const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    try {
      const [goalData, tasksData] = await Promise.all([
        goalsService.getById(Number(id)),
        tasksService.getByGoalId(Number(id!)),
      ]);
      setGoal(goalData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskDto) => {
    try {
      await tasksService.create(Number(id!), data);
      await loadData();
      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: number, data: UpdateTaskDto) => {
    try {
      await tasksService.update(taskId, data);
      await loadData();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.delete(taskId);
        await loadData();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleUpdateGoal = async (data: { title: string; description: string }) => {
    if (!goal) return;
    try {
      await goalsService.update(goal.id, {
        ...data,
        status: goal.status,
      });
      await loadData();
      setShowGoalForm(false);
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!goal) {
    return <div>Goal not found</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate('/goals')}>← Back to Goals</button>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.fullName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        {showGoalForm ? (
          <div>
            <h2>Edit Goal</h2>
            <GoalForm
              onSubmit={handleUpdateGoal}
              onCancel={() => setShowGoalForm(false)}
              initialData={{ title: goal.title, description: goal.description }}
            />
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h1>{goal.title}</h1>
                <p style={{ color: '#666' }}>{goal.description || 'No description'}</p>
              </div>
              <button onClick={() => setShowGoalForm(true)}>Edit Goal</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Tasks</h2>
          <button onClick={() => setShowTaskForm(!showTaskForm)}>
            {showTaskForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>

        {showTaskForm && (
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
            />
          </div>
        )}

        <TaskList
          tasks={tasks}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default GoalDetailPage;

