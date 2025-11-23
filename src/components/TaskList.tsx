import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (taskId: number, data: { title: string; description: string; status: TaskStatus; dueDate?: string | null }) => void;
  onDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  if (tasks.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No tasks yet. Add your first task!</div>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={(data) => onUpdate(task.id, data)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;

