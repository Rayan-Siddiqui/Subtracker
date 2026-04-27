// Import React hooks and router tools
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  // Store form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Get login function from auth context
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Try logging in
      await login(email, password);

      // Go to dashboard after success
      navigate('/dashboard');
    } catch (err) {
      // Show backend error message
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Branding panel */}
        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
          <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
            SubTracker
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Keep your subscriptions visible, organized, and under control.
          </h1>

          <p className="mt-4 max-w-xl text-base text-slate-300">
            Track monthly spending, spot renewals, and manage every recurring charge from one simple dashboard.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Track</p>
              <p className="mt-1 text-lg font-semibold">All services</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Control</p>
              <p className="mt-1 text-lg font-semibold">Monthly costs</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Plan</p>
              <p className="mt-1 text-lg font-semibold">Renewals</p>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Log in to view your dashboard and manage your subscriptions.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}