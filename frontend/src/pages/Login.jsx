import { useState, useContext } from "react";
import API from "../api/api";
import "../styles/theme.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { guessNameFromEmail } from "../utils/session";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const nextUser = res.data.user || {
        name: guessNameFromEmail(email),
        email
      };

      localStorage.setItem("user", JSON.stringify(nextUser));
      login(res.data.token, nextUser);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={loginUser}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {error && <p style={{ color: "#c94" }}>{error}</p>}

        <p>
          Don't have account?
          <a href="/register"> Register</a>
        </p>
      </div>
    </div>
  );
}
