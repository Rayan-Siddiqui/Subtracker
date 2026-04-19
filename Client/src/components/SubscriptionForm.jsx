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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Add Subscription</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Service Name</label>
        <input
          type="text"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          className="w-full rounded border p-2"
          placeholder="Netflix"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded border p-2"
          placeholder="Streaming"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Monthly Cost</label>
        <input
          type="number"
          name="monthlyCost"
          value={formData.monthlyCost}
          onChange={handleChange}
          className="w-full rounded border p-2"
          placeholder="15.99"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Billing Date</label>
        <input
          type="date"
          name="billingDate"
          value={formData.billingDate}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full rounded border p-2"
          placeholder="Optional notes"
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Add Subscription'}
      </button>
    </form>
  );
}