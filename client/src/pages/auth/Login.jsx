import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "./logo.png"; // adjust path if needed

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/sales/dashboard");
      }
    } catch {
      setError("Server not reachable");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT */}
      <div className="auth-left">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to your account</p>

          {error && <p className="error">{error}</p>}

          <input
            type="email"
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

          <p className="switch">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </form>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
}

export default Login;
