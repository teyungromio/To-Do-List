import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Register() {
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");

  function change(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark large">✓</div>
        <h1>Create account</h1>
        <p className="muted">Create an account and start organizing your work.</p>

        <Alert message={error} onClose={() => setError("")} />

        <form onSubmit={submit} className="auth-form">
          <label>Full name
            <input name="name" value={form.name} maxLength={100} required
              onChange={change} placeholder="Your name" />
          </label>

          <label>Email
            <input name="email" type="email" value={form.email} required
              onChange={change} placeholder="you@example.com" />
          </label>

          <label>Password
            <input name="password" type="password" value={form.password} required
              onChange={change} placeholder="At least 6 characters" />
          </label>

          <label>Confirm password
            <input name="confirm" type="password" value={form.confirm} required
              onChange={change} placeholder="Repeat password" />
          </label>

          <button className="btn primary full" disabled={authLoading}>
            {authLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
