// Import React hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Import subscription helpers
import {
  fetchSubscriptions,
  createSubscription,
  deleteSubscription
} from '../services/subscriptionService';

// Import form component
import SubscriptionForm from '../components/SubscriptionForm';

export default function Dashboard() {
  // Get auth info and logout function
  const { user, logout, token } = useAuth();

  // Used for redirecting if token is missing
  const navigate = useNavigate();

  // Store subscription data
  const [subscriptions, setSubscriptions] = useState([]);

  // Store loading and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Send user back to login if token is missing
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Load subscriptions when page first opens
  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Fetch subscriptions from backend
  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new subscription
  const handleAddSubscription = async (subscriptionData) => {
    try {
      setSaving(true);
      await createSubscription(subscriptionData);
      await loadSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subscription');
    } finally {
      setSaving(false);
    }
  };

  // Handle deleting a subscription
  const handleDeleteSubscription = async (id) => {
    const confirmDelete = window.confirm('Delete this subscription?');

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteSubscription(id);
      await loadSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subscription');
    }
  };

  // Calculate the total monthly cost
  const totalMonthlyCost = subscriptions.reduce((sum, sub) => {
    return sum + Number(sub.monthlyCost || 0);
  }, 0);

  // Count subscriptions that are due within the next 7 days
  const dueSoonCount = subscriptions.filter((sub) => {
    const billDate = new Date(sub.billingDate);
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return billDate >= today && billDate <= sevenDaysFromNow;
  }).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top header */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow">
          <div>
            <h1 className="text-3xl font-bold">SubTracker Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {user?.name || 'User'}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-sm text-gray-500">Total Monthly Cost</h2>
            <p className="mt-2 text-3xl font-bold">
              ${totalMonthlyCost.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-sm text-gray-500">Total Subscriptions</h2>
            <p className="mt-2 text-3xl font-bold">{subscriptions.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-sm text-gray-500">Due Soon</h2>
            <p className="mt-2 text-3xl font-bold">{dueSoonCount}</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-2xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add form */}
          <SubscriptionForm onAdd={handleAddSubscription} loading={saving} />

          {/* Subscription list */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Your Subscriptions</h2>

            {loading ? (
              <p>Loading subscriptions...</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-gray-500">No subscriptions added yet.</p>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => {
                  const isDueSoon = (() => {
                    const billDate = new Date(sub.billingDate);
                    const today = new Date();
                    const sevenDaysFromNow = new Date();
                    sevenDaysFromNow.setDate(today.getDate() + 7);
                    return billDate >= today && billDate <= sevenDaysFromNow;
                  })();

                  return (
                    <div
                      key={sub._id}
                      className={`rounded-xl border p-4 ${
                        isDueSoon ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {sub.serviceName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {sub.category}
                          </p>
                          <p className="mt-2 font-medium">
                            ${Number(sub.monthlyCost).toFixed(2)} / month
                          </p>
                          <p className="text-sm text-gray-600">
                            Billing Date:{' '}
                            {new Date(sub.billingDate).toLocaleDateString()}
                          </p>
                          {sub.notes && (
                            <p className="mt-2 text-sm text-gray-700">
                              {sub.notes}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteSubscription(sub._id)}
                          className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}