import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import MentorEmployeeGoalsPage from './pages/MentorEmployeeGoalsPage';
import ReviewsPage from './pages/ReviewsPage';
import MentorReviewsPage from './pages/MentorReviewsPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/goals" element={<PrivateRoute><GoalsPage /></PrivateRoute>} />
          <Route path="/goals/:id" element={<PrivateRoute><GoalDetailPage /></PrivateRoute>} />
          <Route path="/mentor/dashboard" element={<PrivateRoute requiredRole="Mentor"><MentorDashboardPage /></PrivateRoute>} />
          <Route path="/mentor/employees/:employeeId/goals" element={<PrivateRoute requiredRole="Mentor"><MentorEmployeeGoalsPage /></PrivateRoute>} />
          <Route path="/mentor/reviews" element={<PrivateRoute requiredRole="Mentor"><MentorReviewsPage /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute><ReviewsPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
