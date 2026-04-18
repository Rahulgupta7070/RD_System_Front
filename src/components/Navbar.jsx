import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdLightMode,MdDarkMode } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";

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

  // FIXED LOGOUT
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

    // clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully ");

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

     

{/* THEME TOGGLE */}
<button
  onClick={() => setDarkMode(!darkMode)}
  className="bg-gray-200 dark:bg-gray-700 
  text-black dark:text-white p-2 rounded-lg shadow hover:scale-105 transition flex items-center justify-center"
>
  {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
</button>



{/* LOGOUT */}
<button
  onClick={handleLogout}
  className="group bg-red-500 hover:bg-red-600 
  text-white px-4 py-1 rounded-lg shadow 
  flex items-center gap-2 transition-all duration-300"
>
  Logout

  {/* Icon (hidden by default) */}
  <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
    <IoMdLogOut size={18} />
  </span>
</button>

      </div>
    </div>
  );
};

export default Navbar;