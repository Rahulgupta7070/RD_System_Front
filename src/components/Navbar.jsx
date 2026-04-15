import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Navbar = () => {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 🔥 FIXED LOGOUT
  const handleLogout = async () => {

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch("http://localhost:8080/auth/logout", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token
          }
        });
      }
    } catch (err) {
      console.log("Logout API failed");
    }

    // 🧹 clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully 👋");

    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 
    bg-white dark:bg-gray-900 shadow border-b dark:border-gray-700">

      {/* LOGO */}
      <h1
        className="text-xl font-bold cursor-pointer 
        text-gray-800 dark:text-white hover:scale-105 transition"
        onClick={() => navigate("/")}
      >
        RD System
      </h1>

      <div className="flex items-center gap-3">

        {/* 🌙 THEME TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-200 dark:bg-gray-700 
          text-black dark:text-white px-3 py-1 rounded-lg shadow hover:scale-105 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 
          text-white px-4 py-1 rounded-lg shadow hover:scale-105 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;