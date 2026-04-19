// Import the shared API helper
import API from './api';

// Build the auth header using the saved token
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Get all subscriptions for the logged-in user
export const fetchSubscriptions = async () => {
  const res = await API.get('/subscriptions', authConfig());
  return res.data;
};

// Create a new subscription
export const createSubscription = async (subscriptionData) => {
  const res = await API.post('/subscriptions', subscriptionData, authConfig());
  return res.data;
};

// Delete a subscription by ID
export const deleteSubscription = async (id) => {
  const res = await API.delete(`/subscriptions/${id}`, authConfig());
  return res.data;
};