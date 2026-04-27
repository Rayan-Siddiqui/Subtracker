// Import React hooks and router tools
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  // Store form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Get register function from auth context
  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Try registering the user
      await register(name, email, password);

      // Send user to login page after success
      navigate('/');
    } catch (err) {
      // Show backend error message
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left panel */}
        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-2xl">
          <div className="mb-6 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium">
            Start with SubTracker
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            See every subscription in one place.
          </h1>

          <p className="mt-4 max-w-xl text-base text-blue-100">
            Create an account and start managing monthly spending with a simple dashboard built for clarity.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-sm text-blue-100">Private</p>
              <p className="mt-1 text-lg font-semibold">Your own account</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-sm text-blue-100">Fast</p>
              <p className="mt-1 text-lg font-semibold">Quick setup</p>
            </div>
          </div>
        </div>

        {/* Register card */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Register to begin tracking your subscriptions.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Register form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}