
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaTachometerAlt, FaUsers, FaWallet, FaHistory } from "react-icons/fa";
import { MdCalculate, MdAdminPanelSettings } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const role = localStorage.getItem("role");

  const menu = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/users", icon: <FaUsers /> },
    { name: "Deposit", path: "/deposit", icon: <FaWallet /> },
    { name: "Calculator", path: "/interest-cal", icon: <MdCalculate /> },
  ];

  // 🔥 ONLY SUPER ADMIN
  if (role === "ROLE_SUPER_ADMIN") {
    menu.push(
      {
        name: "Create Admin",
        path: "/create-admin",
        icon: <MdAdminPanelSettings />
      },
      {
        name: "Admin List",
        path: "/admin-list",
        icon: <FaUsers />
      },
      {
        name: "Audit Logs",        // 🔥 ADD
        path: "/audit",
        icon: <FaHistory />
      }
    );
  }

  return (
    <div
      className={`h-screen sticky top-0 overflow-y-auto bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-800 shadow-lg p-3 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* TOP */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-lg font-bold text-black dark:text-white">
            RD System
          </h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 dark:text-gray-300 text-xl"
        >
          <HiMenuAlt3 />
        </button>
      </div>

      {/* MENU */}
      <div className="space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-lg w-5">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
