import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorsService } from '../services/mentorsService';
import { Employee } from '../types';

const MentorDashboardPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await mentorsService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Mentor Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.fullName}</span>
          <button onClick={() => navigate('/mentor/reviews')} style={{ marginRight: '10px' }}>
            Reviews
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h2>My Employees</h2>
      {employees.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>No employees assigned yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {employees.map((employee) => (
            <div
              key={employee.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/mentor/employees/${employee.id}/goals`)}
            >
              <h3 style={{ margin: 0 }}>{employee.fullName}</h3>
              <p style={{ color: '#666', margin: '5px 0' }}>{employee.email}</p>
              <div style={{ marginTop: '15px', fontSize: '14px' }}>
                <div>Total Goals: {employee.totalGoals}</div>
                <div>Active Goals: {employee.activeGoals}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorDashboardPage;

