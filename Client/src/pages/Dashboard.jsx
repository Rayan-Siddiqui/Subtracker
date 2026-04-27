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




        {/* Summary cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-white p-6 rounded-2xl shadow">
    <p className="text-gray-500">Total Monthly Cost</p>
    <h2 className="text-2xl font-bold">$0.00</h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <p className="text-gray-500">Total Subscriptions</p>
    <h2 className="text-2xl font-bold">0</h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <p className="text-gray-500">Due Soon</p>
    <h2 className="text-2xl font-bold">0</h2>
  </div>
</div>
<div className="bg-white p-6 rounded-2xl shadow">
  <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>

  <p className="text-gray-500">Subscriptions will show here.</p>
</div>




      </div>
    </div>
  );
}