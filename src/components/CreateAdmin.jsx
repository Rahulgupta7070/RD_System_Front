import { useState } from "react";
import { toast } from "react-toastify";

const CreateAdmin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [superPassword, setSuperPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {

    // ✅ VALIDATION
    if (!email || !password || !superPassword) {
      toast.warning("Fill all fields ⚠️");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Login required ❌");
        return;
      }

      const res = await fetch("http://localhost:8080/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          email,
          password,
          superEmail: "Rahul@gmail.com",   // 🔥 fixed super admin
          superPassword: superPassword
        })
      });

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      toast.success("Admin Created Successfully 🎉");

      // reset
      setEmail("");
      setPassword("");
      setSuperPassword("");

    } catch (err) {
      toast.error("Super Admin verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-[350px]">

        <h2 className="text-xl font-bold mb-5 text-center">
          Create Admin
        </h2>

        {/* ADMIN EMAIL */}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* ADMIN PASSWORD */}
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* SUPER ADMIN PASSWORD */}
        <input
          type="password"
          placeholder="Enter Super Admin Password"
          value={superPassword}
          onChange={(e) => setSuperPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        {/* BUTTON */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white p-2 w-full rounded"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>

      </div>
    </div>
  );
};

export default CreateAdmin;