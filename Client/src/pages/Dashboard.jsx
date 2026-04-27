// React hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth context
import { useAuth } from '../context/AuthContext';

// Subscription API calls
import {
  fetchSubscriptions,
  deleteSubscription,
  createSubscription
} from '../services/subscriptionService';

// Form component (you already have this)
import SubscriptionForm from '../components/SubscriptionForm';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // State
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Load subscriptions
  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  // Add subscription
  const handleAddSubscription = async (data) => {
    try {
      setSaving(true);
      await createSubscription(data);
      loadSubscriptions();
    } catch (err) {
      setError('Failed to add subscription');
    } finally {
      setSaving(false);
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this subscription?');
    if (!confirmDelete) return;

    try {
      await deleteSubscription(id);
      loadSubscriptions();
    } catch (err) {
      setError('Delete failed');
    }
  };

  // Summary calculations
  const totalCost = subscriptions.reduce(
    (sum, sub) => sum + Number(sub.monthlyCost || 0),
    0
  );

  const dueSoon = subscriptions.filter((sub) => {
    const billDate = new Date(sub.billingDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return billDate >= today && billDate <= nextWeek;
  }).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">SubTracker Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {user?.name || 'User'}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Total Monthly Cost</p>
            <h2 className="text-2xl font-bold">
              ${totalCost.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Total Subscriptions</p>
            <h2 className="text-2xl font-bold">
              {subscriptions.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Due Soon</p>
            <h2 className="text-2xl font-bold">{dueSoon}</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Add Subscription Form */}
          <SubscriptionForm
            onAdd={handleAddSubscription}
            loading={saving}
          />

          {/* Subscription List */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Your Subscriptions
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-gray-500">
                No subscriptions yet.
              </p>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub._id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {sub.serviceName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sub.category}
                      </p>
                      <p className="text-sm">
                        ${sub.monthlyCost}/month
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="bg-gray-800 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}