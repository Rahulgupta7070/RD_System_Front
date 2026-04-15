import { useState } from "react";
import { toast } from "react-toastify";

const AddUserForm = ({ onSuccess }) => {

  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: "",
    gender: "",
    dob: "",
    occupation: "",
    accountNumber: "",
    aadharNo: "",
    panNo: "",
    address: "",
    rdAmount: "",
    rdDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!user.name) newErrors.name = "Name is required";
    if (!user.gender) newErrors.gender = "Gender is required";
    if (!user.accountNumber) newErrors.accountNumber = "Account number required";

    if (!/^\d{12}$/.test(user.aadharNo)) {
      newErrors.aadharNo = "Aadhar must be 12 digits";
    }

    if (user.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(user.panNo)) {
      newErrors.panNo = "Invalid PAN format";
    }

    if (!user.address) newErrors.address = "Address required";
    if (!user.rdAmount || user.rdAmount <= 0) newErrors.rdAmount = "Amount must be > 0";
    if (!user.rdDate) newErrors.rdDate = "RD date required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Session expired ❌");
      return;
    }

    if (!validate()) {
      toast.warning("Fix errors ⚠️");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/rdusers/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });

      if (!res.ok) throw new Error();

      toast.success("User Added 🎉");

      setUser({
        name: "",
        gender: "",
        dob: "",
        occupation: "",
        accountNumber: "",
        aadharNo: "",
        panNo: "",
        address: "",
        rdAmount: "",
        rdDate: "",
      });

      setErrors({});
      onSuccess();

    } catch {
      toast.error("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Add User 👤
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {/* INPUT FIELD COMPONENT */}
        {[
          { name: "name", placeholder: "Name" },
          { name: "gender", placeholder: "Gender" },
          { name: "dob", type: "date" },
          { name: "occupation", placeholder: "Occupation" },
          { name: "accountNumber", placeholder: "Account No" },
          { name: "aadharNo", placeholder: "Aadhar No" },
          { name: "panNo", placeholder: "PAN No" },
          { name: "address", placeholder: "Address" },
          { name: "rdAmount", type: "number", placeholder: "RD Amount" },
          { name: "rdDate", type: "date" },
        ].map((field, i) => (
          <div key={i}>
            <input
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              value={user[field.name]}
              onChange={handleChange}
              className={`input ${
                errors[field.name] ? "border-red-500 ring-1 ring-red-500" : ""
              }`}
            />
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          </div>
        ))}

      </div>

      {/* BUTTON */}
      <button
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
        text-white py-2 rounded-xl shadow-lg hover:scale-105 transition"
      >
        {loading ? "Saving..." : "Save User"}
      </button>

    </form>
  );
};

export default AddUserForm;