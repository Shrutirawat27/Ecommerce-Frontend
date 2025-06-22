import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBaseUrl } from '../../utils/baseURL';

const UserDebug = () => {
  const { user } = useSelector((state) => state.auth);
  const [localStorageUser, setLocalStorageUser] = useState(null);
  const [serverUser, setServerUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setLocalStorageUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error parsing localStorage user:', err);
    }

    // Fetch user from server
    const fetchUserFromServer = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${getBaseUrl()}/api/user/current`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setServerUser(data.user);
      } catch (err) {
        console.error('Error fetching user from server:', err);
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserFromServer();
  }, []);

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Data Diagnostic</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Redux Store User</h2>
          {user ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">No user in Redux store</p>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage User</h2>
          {localStorageUser ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(localStorageUser, null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">No user in localStorage</p>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Server User Data</h2>
          {loading ? (
            <p>Loading...</p>
          ) : serverUser ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(serverUser, null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">No user data from server</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={refreshData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default UserDebug; 