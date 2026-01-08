import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function AuthControls() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Link to="/login">Login</Link>;
  }

  return (
    <button type="button" onClick={logout}>
      Logout
    </button>
  );
}