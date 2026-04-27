// Import React hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Import subscription helpers
import {
  fetchSubscriptions,
  createSubscription,
  deleteSubscription,
  updateSubscription
} from '../services/subscriptionService';

// Import form and chart components
import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionChart from '../components/SubscriptionChart';

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

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  // Start editing a subscription
  const handleEditClick = (sub) => {
    setEditingId(sub._id);
    setEditData({
      serviceName: sub.serviceName || '',
      category: sub.category || '',
      monthlyCost: sub.monthlyCost || '',
      billingDate: sub.billingDate ? sub.billingDate.slice(0, 10) : '',
      notes: sub.notes || ''
    });
  };

  // Update edit form fields
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // Save edited subscription
  const handleSaveEdit = async () => {
    try {
      setSaving(true);

      await updateSubscription(editingId, {
        ...editData,
        monthlyCost: Number(editData.monthlyCost)
      });

      setEditingId(null);
      setEditData({});
      await loadSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subscription');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
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

        {/* Chart */}
        <SubscriptionChart subscriptions={subscriptions} />

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
                      {editingId === sub._id ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Service Name
                            </label>
                            <input
                              type="text"
                              name="serviceName"
                              value={editData.serviceName}
                              onChange={handleEditChange}
                              className="w-full rounded border p-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Category
                            </label>
                            <input
                              type="text"
                              name="category"
                              value={editData.category}
                              onChange={handleEditChange}
                              className="w-full rounded border p-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Monthly Cost
                            </label>
                            <input
                              type="number"
                              name="monthlyCost"
                              value={editData.monthlyCost}
                              onChange={handleEditChange}
                              className="w-full rounded border p-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Billing Date
                            </label>
                            <input
                              type="date"
                              name="billingDate"
                              value={editData.billingDate}
                              onChange={handleEditChange}
                              className="w-full rounded border p-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Notes
                            </label>
                            <textarea
                              name="notes"
                              value={editData.notes}
                              onChange={handleEditChange}
                              className="w-full rounded border p-2"
                              rows="3"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="rounded bg-green-600 px-3 py-2 text-white"
                            >
                              Save
                            </button>

                            <button
                              onClick={handleCancelEdit}
                              className="rounded bg-gray-500 px-3 py-2 text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Normal view mode
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

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleEditClick(sub)}
                              className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteSubscription(sub._id)}
                              className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
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