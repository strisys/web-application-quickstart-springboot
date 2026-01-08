import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type LocationState = {
  from?: { pathname: string };
};

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const from = (state?.from?.pathname || "/");

  function handleLogin() {
    login();
    navigate(from, { replace: true });
  }

  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Login</h1>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
}
