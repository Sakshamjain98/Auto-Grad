import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../api/auth';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getProfile(user.token);
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{profile?.name}</h2>
            <p className="text-gray-600">{profile?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {profile?.role === 'teacher' ? 'Teacher' : 'Student'}
            </span>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
