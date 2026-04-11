import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserTable from "./components/UserTable";
import Deposit from "./components/Deposit";
import InterestCalculator from "./components/InterestCalculator";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAdmin from "./components/CreateAdmin";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-admin" element={<CreateAdmin />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <UserTable />
          </ProtectedRoute>
        } />

        <Route path="/deposit" element={
          <ProtectedRoute>
            <Deposit />
          </ProtectedRoute>
        } />

        <Route path="/interest-cal" element={
          <ProtectedRoute>
            <InterestCalculator />
          </ProtectedRoute>
        } />

      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        newestOnTop
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;