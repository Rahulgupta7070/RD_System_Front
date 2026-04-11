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

    // ❗ TOKEN CHECK
    if (!token) {
      toast.error("Session expired ❌");
      return;
    }

    if (!validate()) {
      toast.warning("Please fix form errors ⚠️");
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

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Forbidden");
        }
        throw new Error();
      }

      toast.success("User Added Successfully 🎉");

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

    } catch (err) {
      if (err.message === "Forbidden") {
        toast.error("Access Denied (403) ❌");
      } else {
        toast.error("Server Error ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-4">

      <div>
        <input name="name" placeholder="Name" value={user.name}
          onChange={handleChange}
          className={`border p-2 w-full ${errors.name ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.name}</p>
      </div>

      <div>
        <input name="gender" placeholder="Gender" value={user.gender}
          onChange={handleChange}
          className={`border p-2 w-full ${errors.gender ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.gender}</p>
      </div>

      <input type="date" name="dob" value={user.dob}
        onChange={handleChange} className="border p-2 w-full" />

      <input name="occupation" placeholder="Occupation" value={user.occupation}
        onChange={handleChange} className="border p-2 w-full" />

      <div>
        <input name="accountNumber" placeholder="Account No"
          value={user.accountNumber} onChange={handleChange}
          className={`border p-2 w-full ${errors.accountNumber ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.accountNumber}</p>
      </div>

      <div>
        <input name="aadharNo" placeholder="Aadhar No"
          value={user.aadharNo} onChange={handleChange}
          className={`border p-2 w-full ${errors.aadharNo ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.aadharNo}</p>
      </div>

      <div>
        <input name="panNo" placeholder="PAN No"
          value={user.panNo} onChange={handleChange}
          className={`border p-2 w-full ${errors.panNo ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.panNo}</p>
      </div>

      <div>
        <input name="address" placeholder="Address"
          value={user.address} onChange={handleChange}
          className={`border p-2 w-full ${errors.address ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.address}</p>
      </div>

      <div>
        <input type="number" name="rdAmount" placeholder="RD Amount"
          value={user.rdAmount} onChange={handleChange}
          className={`border p-2 w-full ${errors.rdAmount ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.rdAmount}</p>
      </div>

      <div>
        <input type="date" name="rdDate"
          value={user.rdDate} onChange={handleChange}
          className={`border p-2 w-full ${errors.rdDate ? "border-red-500" : ""}`} />
        <p className="text-red-500 text-sm">{errors.rdDate}</p>
      </div>

      <button
        disabled={loading}
        className="col-span-2 bg-blue-500 text-white p-3 rounded"
      >
        {loading ? "Saving..." : "Save User"}
      </button>

    </form>
  );
};

export default AddUserForm;