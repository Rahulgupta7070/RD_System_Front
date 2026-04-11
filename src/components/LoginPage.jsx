import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email || !password) {
      toast.warning("Please enter email and password ⚠️");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const token = await res.text();

      if (!res.ok || token === "Invalid credentials") {
        throw new Error();
      }

      if (!token.includes(".")) {
        throw new Error();
      }

      localStorage.setItem("token", token);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        localStorage.setItem("role", payload.role);
      } catch {}

      toast.success("Login Successful 🎉");

      navigate("/");

    } catch {
      toast.error("Invalid Email or Password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
};

export default LoginPage;