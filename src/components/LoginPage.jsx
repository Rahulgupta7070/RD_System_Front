import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (!email || !password) {
      toast.warning("Please enter email and password ");
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
    <div className="flex items-center justify-center min-h-screen 
    bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 
    dark:from-gray-900 dark:to-black">

      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg 
      p-8 rounded-2xl shadow-2xl w-80 border border-gray-200 dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Admin Login 
        </h2>

        {/* FORM START */}
        <form autoComplete="off" onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="relative mb-4">
            <FiMail className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="random_login_email" 
              autoComplete="off"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg 
              bg-gray-100 dark:bg-gray-800 
              text-gray-800 dark:text-white 
              border border-gray-300 dark:border-gray-600 
              focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative mb-5">
            <FiLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              name="random_login_password" // 
              autoComplete="new-password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg 
              bg-gray-100 dark:bg-gray-800 
              text-gray-800 dark:text-white 
              border border-gray-300 dark:border-gray-600 
              focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
            text-white py-2 rounded-xl shadow-lg hover:scale-105 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        {/*FORM END */}

      </div>
    </div>
  );
};

export default LoginPage;