import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "./logo.png"; // adjust path if needed

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.role) {
      setError("Please select a role");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Server not reachable");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT */}
      <div className="auth-left">
        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <p className="subtitle">Register to get started</p>

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="manager">Manager</option>
            <option value="salesperson">Salesperson</option>
          </select>

          <button type="submit">Register</button>

          <p className="switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
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

export default Register;
