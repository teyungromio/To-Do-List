import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Login() {
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email.trim(), password);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark large">✓</div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your tasks.</p>

        <Alert message={error} onClose={() => setError("")} />

        <form onSubmit={submit} className="auth-form">
          <label>Email
            <input type="email" value={email} required autoComplete="email"
              onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>

          <label>Password
            <input type="password" value={password} required autoComplete="current-password"
              onChange={e => setPassword(e.target.value)} placeholder="Your password" />
          </label>

          <button className="btn primary full" disabled={authLoading}>
            {authLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
