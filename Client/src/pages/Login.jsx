import { Link } from 'react-router-dom';

// Login page placeholder
export default function Login() {
  return (
    <div>
      <h1>Login Page</h1>

      {/* Navigation links */}
      <Link to="/register">Go to Register</Link>
      <br />
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}