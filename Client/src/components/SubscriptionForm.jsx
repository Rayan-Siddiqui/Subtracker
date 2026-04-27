// Import React state
import { useState } from 'react';

export default function SubscriptionForm({ onAdd, loading }) {
  // Store form input values
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    monthlyCost: '',
    billingDate: '',
    notes: ''
  });

  // Update form fields as the user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send cleaned data to parent component
    await onAdd({
      ...formData,
      monthlyCost: Number(formData.monthlyCost)
    });

    // Clear form after success
    setFormData({
      serviceName: '',
      category: '',
      monthlyCost: '',
      billingDate: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Add subscription</h2>
        <p className="mt-1 text-sm text-slate-500">
          Keep track of every recurring charge in one place.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Service Name
          </label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="Netflix"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="Streaming"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monthly Cost
            </label>
            <input
              type="number"
              name="monthlyCost"
              value={formData.monthlyCost}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="15.99"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Billing Date
            </label>
            <input
              type="date"
              name="billingDate"
              value={formData.billingDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="Optional notes"
            rows="4"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Add Subscription'}
      </button>
    </form>
  );
}