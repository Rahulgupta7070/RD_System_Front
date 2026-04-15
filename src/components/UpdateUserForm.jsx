import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UpdateUserForm = ({ userData, onSuccess }) => {

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(userData);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Session expired ❌");
      return;
    }

    fetch(`http://localhost:8080/rdusers/update/${user.rid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Forbidden");
          throw new Error("Update failed");
        }

        toast.success("User Updated Successfully ✏️");
        onSuccess();
      })
      .catch((err) => {
        if (err.message === "Forbidden") {
          toast.error("Access Denied (403) ❌");
        } else {
          toast.error("Update failed ❌");
        }
      });
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">

      {/* TITLE */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        Update User ✏️
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

        <input
          name="name"
          value={user?.name || ""}
          onChange={handleChange}
          placeholder="Full Name"
          className="input"
        />

        <input
          name="gender"
          value={user?.gender || ""}
          onChange={handleChange}
          placeholder="Gender"
          className="input"
        />

        <input
          type="date"
          name="dob"
          value={user?.dob || ""}
          onChange={handleChange}
          className="input"
        />

        <input
          name="occupation"
          value={user?.occupation || ""}
          onChange={handleChange}
          placeholder="Occupation"
          className="input"
        />

        <input
          name="accountNumber"
          value={user?.accountNumber || ""}
          onChange={handleChange}
          placeholder="Account Number"
          className="input"
        />

        <input
          name="aadharNo"
          value={user?.aadharNo || ""}
          onChange={handleChange}
          placeholder="Aadhar Number"
          className="input"
        />

        <input
          name="panNo"
          value={user?.panNo || ""}
          onChange={handleChange}
          placeholder="PAN Number"
          className="input"
        />

        <input
          name="address"
          value={user?.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="input"
        />

        <input
          type="number"
          name="rdAmount"
          value={user?.rdAmount || ""}
          onChange={handleChange}
          placeholder="RD Amount"
          className="input"
        />

        <input
          type="date"
          name="rdDate"
          value={user?.rdDate || ""}
          onChange={handleChange}
          className="input"
        />

      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2 rounded-xl shadow hover:scale-105 transition"
      >
        Update User
      </button>

    </form>
  );
};

export default UpdateUserForm;