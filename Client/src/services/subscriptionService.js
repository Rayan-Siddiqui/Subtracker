// Shared API helper
import API from './api';

// Build auth header from saved token
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Get all subscriptions
export const fetchSubscriptions = async () => {
  const res = await API.get('/subscriptions', authConfig());
  return res.data;
};

// Create a subscription
export const createSubscription = async (subscriptionData) => {
  const res = await API.post('/subscriptions', subscriptionData, authConfig());
  return res.data;
};

// Delete a subscription
export const deleteSubscription = async (id) => {
  const res = await API.delete(`/subscriptions/${id}`, authConfig());
  return res.data;
};

// Update a subscription
export const updateSubscription = async (id, updatedData) => {
  const res = await API.put(`/subscriptions/${id}`, updatedData, authConfig());
  return res.data;
};