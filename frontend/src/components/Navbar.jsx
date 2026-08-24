import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <span className="brand-mark">✓</span>
          TaskFlow
        </div>

        <div className="nav-user">
          <div className="user-details">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
