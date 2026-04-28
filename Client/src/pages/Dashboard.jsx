import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  fetchSubscriptions,
  deleteSubscription,
  createSubscription,
  updateSubscription
} from '../services/subscriptionService';

import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionChart from '../components/SubscriptionChart';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await fetchSubscriptions();
      setSubscriptions(data);
    } catch {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    try {
      setSaving(true);
      await createSubscription(data);
      loadSubscriptions();
    } catch {
      setError('Failed to add subscription');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscription?')) return;

    try {
      await deleteSubscription(id);
      loadSubscriptions();
    } catch {
      setError('Delete failed');
    }
  };

  const startEdit = (sub) => {
    setEditingId(sub._id);
    setEditForm({
      serviceName: sub.serviceName,
      category: sub.category,
      monthlyCost: sub.monthlyCost,
      billingDate: sub.billingDate?.slice(0, 10),
      notes: sub.notes || ''   // ✅ FIXED: ensures notes are included
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = async () => {
    try {
      await updateSubscription(editingId, {
        ...editForm,
        monthlyCost: Number(editForm.monthlyCost)
      });

      setEditingId(null);
      loadSubscriptions();
    } catch {
      setError('Update failed');
    }
  };

      setEditingId(null);
      loadSubscriptions();
    } catch {
      setError('Update failed');
    }
  };

  const totalCost = subscriptions.reduce(
    (sum, sub) => sum + Number(sub.monthlyCost || 0),
    0
  );

  const dueSoon = subscriptions.filter((sub) => {
    const d = new Date(sub.billingDate);
    const now = new Date();
    const week = new Date();
    week.setDate(now.getDate() + 7);
    return d >= now && d <= week;
  }).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
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

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p>Total Cost</p>
            <h2 className="text-2xl font-bold">
              ${totalCost.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p>Subscriptions</p>
            <h2 className="text-2xl font-bold">
              {subscriptions.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p>Due Soon</p>
            <h2 className="text-2xl font-bold">{dueSoon}</h2>
          </div>
        </div>

        {/* Chart */}
        <SubscriptionChart subscriptions={subscriptions} />

        {/* Layout */}
        <div className="grid lg:grid-cols-2 gap-6">

          <SubscriptionForm onAdd={handleAdd} loading={saving} />

          {/* List */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Your Subscriptions
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : subscriptions.length === 0 ? (
              <p>No subscriptions yet</p>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div key={sub._id} className="border p-4 rounded-xl">

                    {editingId === sub._id ? (
                      <div className="space-y-2">

                        <input
                          name="serviceName"
                          value={editForm.serviceName}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        />

                        <input
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        />

                        <input
                          type="number"
                          name="monthlyCost"
                          value={editForm.monthlyCost}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        />

                        <input
                          type="date"
                          name="billingDate"
                          value={editForm.billingDate}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        />

                        <textarea
                          name="notes"
                          value={editForm.notes}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                          placeholder="Additional info..."
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">

                        <div>
                          <h3 className="font-semibold">
                            {sub.serviceName}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {sub.category}
                          </p>

                          <p>${sub.monthlyCost}/month</p>

                          {/* ✅ FIXED: show notes */}
                          {sub.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              {sub.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(sub)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="bg-gray-800 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>

                      </div>
                    )}

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