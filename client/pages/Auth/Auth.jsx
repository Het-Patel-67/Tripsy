import { useState } from "react";
import axios from "axios";
import API from "../../src/services/apiService.js"


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    username: "",
    emailOrUsername: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Strong Password Validation
  const validate = () => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+=\[\]{}|;:'",.<>\/?`])(?!.*\s).{8,}$/;

    if (!form.password) return "Password is required";
    if (!strongPassword.test(form.password))
      return "Password must be 8+ chars with uppercase, lowercase, number & special character";

    if (!isLogin) {
      if (!form.username || !form.emailOrUsername)
        return "All fields are required";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.emailOrUsername))
        return "Invalid email format";
    }

    return null;
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);

      if (isLogin) {
        const payload = {
          password: form.password,
        };

        // Detect email or username
        if (form.emailOrUsername.includes("@")) {
          payload.email = form.emailOrUsername;
        } else {
          payload.username = form.emailOrUsername;
        }

        await API.post("/api/users/login", payload);

        alert("Login successful");
        window.location.href = "/";
      } else {
        await API.post("/api/users/register", {
          username: form.username,
          email: form.emailOrUsername,
          password: form.password,
        });

        alert("Registration successful");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col" id="auth-page"
    >
      {/* 🔹 TOP LEFT BRANDING */}
      <div className="p-10">
        <h1 className="font-bold text-4xl mb-2">Tripsy</h1>

        <div className="flex items-center gap-4">
          <img
            src="/assets/aeroplane.png"
            alt="Aeroplane"
            className="h-10"
          />
          <h2 className="text-xl text-gray-700">
            Plan your trip, explore the world!
          </h2>
        </div>
      </div>

      {/* 🔹 CENTER FORM */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white/10 border border-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg">
          
          <h2 className="text-3xl font-bold mb-2 text-black">
            {isLogin ? "Welcome back" : "Create Account"}
          </h2>

          <p className="text-gray-700 mb-6">
            {isLogin
              ? "Login to continue"
              : "Register to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              value={form.emailOrUsername}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>

          {/* 🔹 TOGGLE */}
          <p
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="mt-6 text-purple-700 cursor-pointer text-sm"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}