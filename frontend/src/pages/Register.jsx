import { useState } from "react";
import API from "../api/api";
import "../styles/theme.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg && msg.toLowerCase().includes("email")) {
        setError("Email already registered");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>

        <form onSubmit={registerUser}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />

          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Register</button>
        </form>

        {error && <p style={{ color: '#c94' }}>{error}</p>}

        <p>
          Already have account?
          <a href="/"> Login</a>
        </p>
      </div>
    </div>
  );
}
