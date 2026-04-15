import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import UserTable from "./components/UserTable";
import Deposit from "./components/Deposit";
import InterestCalculator from "./components/InterestCalculator";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAdmin from "./components/CreateAdmin";
import AdminList from "./components/AdminList";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// ✅ LAYOUT
const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {

  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>

      <Routes>

        {/* ❌ PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ PROTECTED */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserTable />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/interest-cal" element={<InterestCalculator />} />

          {/* 👑 ONLY SUPER ADMIN */}
          {role === "ROLE_SUPER_ADMIN" && (
            <>
            <Route path="/create-admin" element={<CreateAdmin />} />
             <Route path="/admin-list" element={<AdminList />} />
             </>
          )}

        </Route>

      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        newestOnTop
        theme={
          document.documentElement.classList.contains("dark")
            ? "dark"
            : "light"
        }
      />

    </BrowserRouter>
  );
}

export default App;