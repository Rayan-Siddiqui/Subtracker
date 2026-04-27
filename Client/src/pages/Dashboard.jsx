// Basic clean dashboard layout

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">SubTracker</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Placeholder box */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          Dashboard working ✅
        </div>

      </div>
    </div>
  );
}