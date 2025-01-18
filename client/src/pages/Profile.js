import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setUser({
          name: decodedToken.name,   // Extract name from token
          role: decodedToken.role,   // Extract role from token
        });
        setLoading(false);
      } catch (err) {
        setError('Error decoding token');
        setLoading(false);
      }
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile</h2>
        {user ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-700">
              <strong className="text-lg">Name:</strong>
              <span className="text-gray-600">{user.name}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <strong className="text-lg">Role:</strong>
              <span className="text-gray-600">{user.role}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">User profile not available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
