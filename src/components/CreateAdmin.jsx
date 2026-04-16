import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CreateAdmin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 ROLE CHECK
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "ROLE_SUPER_ADMIN") {
      toast.error("Access Denied ❌");
      window.location.href = "/";
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); // 🔥 important (form submit control)

    if (!email || !password) {
      toast.warning("Fill all fields ⚠️");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Login required ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Forbidden");
        }
        throw new Error("Error");
      }

      toast.success("Admin Created Successfully 🎉");

      // 🔥 reset fields
      setEmail("");
      setPassword("");

    } catch (err) {
      if (err.message === "Forbidden") {
        toast.error("Only Super Admin allowed ❌");
      } else {
        toast.error("Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-[360px] border dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Admin 👑
        </h2>

        {/* 🔥 FORM START */}
        <form autoComplete="off" onSubmit={handleCreate}>

          {/* EMAIL */}
          <input
            type="email"
            name="random_admin_email"
            autoComplete="off"
            placeholder="New Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border dark:border-gray-600 p-2 mb-4 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="random_admin_password"
            autoComplete="new-password"
            placeholder="New Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border dark:border-gray-600 p-2 mb-5 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white font-semibold transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 hover:scale-105"}
            `}
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>

        </form>
        {/* 🔥 FORM END */}

      </div>

    </div>
  );
};

export default CreateAdmin;