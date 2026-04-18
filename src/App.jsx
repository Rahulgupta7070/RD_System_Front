
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import UserTable from "./components/UserTable";
import Deposit from "./components/Deposit";
import InterestCalculator from "./components/InterestCalculator";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import CreateAdmin from "./components/CreateAdmin";
import AdminList from "./components/AdminList";
import AuditPage from "./components/AuditPage"; // 🔥 ADD

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};


// ADMIN PROTECTION
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role !== "ROLE_SUPER_ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
};


// LAYOUT
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
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED */}
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

          {/* ADMIN ROUTES */}
          <Route
            path="/create-admin"
            element={
              <AdminRoute>
                <CreateAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin-list"
            element={
              <AdminRoute>
                <AdminList />
              </AdminRoute>
            }
          />

          {/* 🔥 AUDIT ROUTE (ONLY SUPER ADMIN) */}
          <Route
            path="/audit"
            element={
              <AdminRoute>
                <AuditPage />
              </AdminRoute>
            }
          />

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
