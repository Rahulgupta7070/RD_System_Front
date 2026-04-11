import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully 👋");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg">

      <div className="flex justify-between items-center px-4 py-3">

        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          RD System
        </h1>

        <div className="hidden md:flex gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/deposit">Deposit</Link>
          <Link to="/interest-cal">Calculator</Link>
          

          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {menuOpen && (
        <div className="md:hidden p-3 space-y-2">
          <Link to="/">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/deposit">Deposit</Link>
          <Link to="/interest-cal">Calculator</Link>

          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 w-full">
            Logout
          </button>
        </div>
      )}

    </nav>
  );
};

export default Navbar;