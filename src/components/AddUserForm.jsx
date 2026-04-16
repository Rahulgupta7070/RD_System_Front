import { useState } from "react";
import { toast } from "react-toastify";

const AddUserForm = ({ onSuccess }) => {

  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
    occupation: "",
    accountNumber: "",
    aadharNo: "",
    panNo: "",
    rdAmount: "",
    rdDate: "",
    nomineeName: "",
    nomineeAddress: "",
    nomineeAadharNo: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!user.name) err.name = "Required";
    if (!user.email) err.email = "Required";
    if (!user.gender) err.gender = "Required";
    if (!user.dob) err.dob = "Required";
    if (!user.accountNumber) err.accountNumber = "Required";
    if (!user.rdAmount) err.rdAmount = "Required";
    if (!user.rdDate) err.rdDate = "Required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

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
        email: "",
        gender: "",
        dob: "",
        address: "",
        occupation: "",
        accountNumber: "",
        aadharNo: "",
        panNo: "",
        rdAmount: "",
        rdDate: "",
        nomineeName: "",
        nomineeAddress: "",
        nomineeAadharNo: ""
      });

      onSuccess();

    } catch {
      toast.error("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <h2 className="text-lg font-bold text-center text-gray-800 dark:text-white">
        Add User 👤
      </h2>

      {/* PERSONAL */}
      <Section title="Personal Details">
        <Input label="Name" name="name" value={user.name} onChange={handleChange} error={errors.name}/>
        <Input label="Email" name="email" value={user.email} onChange={handleChange} error={errors.email}/>
        
        <select
          name="gender"
          value={user.gender}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <Input type="date" label="DOB" name="dob" value={user.dob} onChange={handleChange} error={errors.dob}/>

        <div className="col-span-1 sm:col-span-2">
          <Input label="Address" name="address" value={user.address} onChange={handleChange}/>
        </div>
      </Section>

      {/* ACCOUNT */}
      <Section title="Account Details">
        <Input label="Occupation" name="occupation" value={user.occupation} onChange={handleChange}/>
        <Input label="Account Number" name="accountNumber" value={user.accountNumber} onChange={handleChange} error={errors.accountNumber}/>
        <Input label="Aadhar Number" name="aadharNo" value={user.aadharNo} onChange={handleChange}/>
        <Input label="PAN Number" name="panNo" value={user.panNo} onChange={handleChange}/>
      </Section>

      {/* RD */}
      <Section title="RD Details">
        <Input type="number" label="RD Amount" name="rdAmount" value={user.rdAmount} onChange={handleChange} error={errors.rdAmount}/>
        <Input type="date" label="RD Start Date" name="rdDate" value={user.rdDate} onChange={handleChange} error={errors.rdDate}/>
      </Section>

      {/* NOMINEE */}
      <Section title="Nominee Details">
        <Input label="Nominee Name" name="nomineeName" value={user.nomineeName} onChange={handleChange}/>
        <Input label="Nominee Aadhar" name="nomineeAadharNo" value={user.nomineeAadharNo} onChange={handleChange}/>
        <div className="col-span-1 sm:col-span-2">
          <Input label="Nominee Address" name="nomineeAddress" value={user.nomineeAddress} onChange={handleChange}/>
        </div>
      </Section>

      <button
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Save User"}
      </button>

    </form>
  );
};

/* SECTION */
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-300">
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

/* INPUT (FIXED TEXT COLOR ISSUE) */
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs mb-1 text-gray-600 dark:text-gray-300">{label}</label>
    <input
      {...props}
      className={`p-2 rounded-md text-sm 
      bg-gray-100 dark:bg-gray-800 
      text-gray-900 dark:text-white 
      border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
      focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export default AddUserForm;