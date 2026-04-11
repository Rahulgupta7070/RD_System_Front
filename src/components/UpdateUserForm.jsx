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

    // ❗ TOKEN CHECK
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
          if (res.status === 403) {
            throw new Error("Forbidden");
          }
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
    <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-3">

      <input name="name" value={user?.name || ""} onChange={handleChange} className="border p-2" />
      <input name="gender" value={user?.gender || ""} onChange={handleChange} className="border p-2" />

      <input type="date" name="dob" value={user?.dob || ""} onChange={handleChange} className="border p-2" />
      <input name="occupation" value={user?.occupation || ""} onChange={handleChange} className="border p-2" />

      <input name="accountNumber" value={user?.accountNumber || ""} onChange={handleChange} className="border p-2" />
      <input name="aadharNo" value={user?.aadharNo || ""} onChange={handleChange} className="border p-2" />

      <input name="panNo" value={user?.panNo || ""} onChange={handleChange} className="border p-2" />
      <input name="address" value={user?.address || ""} onChange={handleChange} className="border p-2" />

      <input type="number" name="rdAmount" value={user?.rdAmount || ""} onChange={handleChange} className="border p-2" />
      <input type="date" name="rdDate" value={user?.rdDate || ""} onChange={handleChange} className="border p-2" />

      <button className="col-span-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
        Update User
      </button>

    </form>
  );
};

export default UpdateUserForm;