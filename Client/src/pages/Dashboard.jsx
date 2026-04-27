// Import React hooks
import { useEffect, useMemo, useState } from 'react';
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
  const dueSoonSubscriptions = subscriptions.filter((sub) => {
    const billDate = new Date(sub.billingDate);
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return billDate >= today && billDate <= sevenDaysFromNow;
  });

  // Group subscriptions by category
  const categorySummary = useMemo(() => {
    const totals = {};

    subscriptions.forEach((sub) => {
      const category = sub.category || 'Other';
      totals[category] = (totals[category] || 0) + Number(sub.monthlyCost || 0);
    });

    return Object.entries(totals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [subscriptions]);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top header */}
        <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
                SubTracker Dashboard
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Welcome, {user?.name || 'User'}
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Track recurring spending, spot upcoming renewals, and stay in control of your monthly subscriptions.
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Total Monthly Cost
            </h2>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              ${totalMonthlyCost.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Total Subscriptions
            </h2>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {subscriptions.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Due Soon
            </h2>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {dueSoonSubscriptions.length}
            </p>
          </div>
        </div>

        {/* Simple category breakdown */}
        <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Spending by Category</h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick breakdown of where your monthly money goes.
              </p>
            </div>
          </div>

          {categorySummary.length === 0 ? (
            <p className="text-slate-500">No category data yet.</p>
          ) : (
            <div className="space-y-4">
              {categorySummary.map((item) => {
                const max = categorySummary[0]?.total || 1;
                const width = Math.max((item.total / max) * 100, 8);

                return (
                  <div key={item.category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <span className="text-slate-500">${item.total.toFixed(2)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-blue-600"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Main content grid */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Add form */}
          <SubscriptionForm onAdd={handleAddSubscription} loading={saving} />

          {/* Subscription list */}
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Subscriptions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Edit, delete, and manage each recurring charge.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading subscriptions...</p>
            ) : subscriptions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No subscriptions added yet.
              </div>
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
                      className={`rounded-2xl border p-4 ${
                        isDueSoon ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {editingId === sub._id ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-slate-700">
                                Service Name
                              </label>
                              <input
                                type="text"
                                name="serviceName"
                                value={editData.serviceName}
                                onChange={handleEditChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-slate-700">
                                Category
                              </label>
                              <input
                                type="text"
                                name="category"
                                value={editData.category}
                                onChange={handleEditChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-slate-700">
                                Monthly Cost
                              </label>
                              <input
                                type="number"
                                name="monthlyCost"
                                value={editData.monthlyCost}
                                onChange={handleEditChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-slate-700">
                                Billing Date
                              </label>
                              <input
                                type="date"
                                name="billingDate"
                                value={editData.billingDate}
                                onChange={handleEditChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Notes
                            </label>
                            <textarea
                              name="notes"
                              value={editData.notes}
                              onChange={handleEditChange}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                              rows="3"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500"
                            >
                              Save
                            </button>

                            <button
                              onClick={handleCancelEdit}
                              className="rounded-2xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Normal view mode
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {sub.serviceName}
                              </h3>
                              {isDueSoon && (
                                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                  Due soon
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {sub.category}
                            </p>

                            <p className="mt-3 text-base font-semibold text-slate-900">
                              ${Number(sub.monthlyCost).toFixed(2)} / month
                            </p>

                            <p className="text-sm text-slate-500">
                              Billing Date: {new Date(sub.billingDate).toLocaleDateString()}
                            </p>

                            {sub.notes && (
                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {sub.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 sm:flex-col">
                            <button
                              onClick={() => handleEditClick(sub)}
                              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteSubscription(sub._id)}
                              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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