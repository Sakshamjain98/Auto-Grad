import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
          <p className="mb-4">
            {user?.role === 'teacher'
              ? 'Create and manage assignments for your students'
              : 'View and submit your assignments'}
          </p>
          <Link
            to="/assignments"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {user?.role === 'teacher' ? 'Manage Assignments' : 'View Assignments'}
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <p className="mb-4">
            Update your profile information and view your account details
          </p>
          <Link
            to="/profile"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
