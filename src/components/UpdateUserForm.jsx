import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UpdateUserForm = ({ userData, onSuccess }) => {

  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: "",
    address: "",
    dob: "",
    gender: "",
    email: "",
    rdDate: "",
    rdAmount: "",
    occupation: "",
    accountNumber: "",
    aadharNo: "",
    panNo: "",
    nomineeName: "",
    nomineeAddress: "",
    nomineeAadharNo: "",
    totalMonths: ""
  });

  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        dob: userData.dob || "",
        rdDate: userData.rdDate || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: name === "rdAmount" ? Number(value) : value
    });
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

        toast.success("User Updated Successfully ");
        onSuccess();
      })
      .catch((err) => {
        if (err.message === "Forbidden") {
          toast.error("Access Denied (403) ");
        } else {
          toast.error("Update failed ");
        }
      });
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">

      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Update User 
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* PERSONAL */}
        <input name="name" value={user.name} onChange={handleChange} placeholder="Full Name" className="input" />

        <input name="email" value={user.email} onChange={handleChange} placeholder="Email" className="input" />

        <select name="gender" value={user.gender} onChange={handleChange} className="input">
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <input type="date" name="dob" value={user.dob} onChange={handleChange} className="input" />

        <div className="col-span-1 sm:col-span-2">
          <input name="address" value={user.address} onChange={handleChange} placeholder="Address" className="input" />
        </div>

        {/* ACCOUNT */}
        <input name="occupation" value={user.occupation} onChange={handleChange} placeholder="Occupation" className="input" />

        <input name="accountNumber" value={user.accountNumber} onChange={handleChange} placeholder="Account Number" className="input" />

        <input name="aadharNo" value={user.aadharNo} onChange={handleChange} placeholder="Aadhar Number" className="input" />

        <input name="panNo" value={user.panNo} onChange={handleChange} placeholder="PAN Number" className="input" />

        {/* RD */}
        <input type="number" name="rdAmount" value={user.rdAmount} onChange={handleChange} placeholder="RD Amount" className="input" />

        <input type="date" name="rdDate" value={user.rdDate} onChange={handleChange} className="input" />

       
        <select
          name="totalMonths"
          value={user.totalMonths}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Duration</option>
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
          <option value="24">24 Months</option>
        </select>

        {/* NOMINEE */}
        <input name="nomineeName" value={user.nomineeName} onChange={handleChange} placeholder="Nominee Name" className="input" />

        <input name="nomineeAadharNo" value={user.nomineeAadharNo} onChange={handleChange} placeholder="Nominee Aadhar" className="input" />

        <div className="col-span-1 sm:col-span-2">
          <input name="nomineeAddress" value={user.nomineeAddress} onChange={handleChange} placeholder="Nominee Address" className="input" />
        </div>

      </div>

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