import { useState } from "react";
import { toast } from "react-toastify";
import { FaRupeeSign, FaCalendarAlt } from "react-icons/fa";

const AddDeposit = ({ rid, onSuccess }) => {

  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    rid: rid,
    rdDate: "",
    rdAmount: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "rdAmount") {
      value = value === "" ? "" : Number(value);
    }

    setData({
      ...data,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Session expired ❌");
      return;
    }

    if (!data.rdDate || !data.rdAmount) {
      toast.warning("Fill all fields ⚠️");
      return;
    }

    if (data.rdAmount <= 0) {
      toast.error("Amount must be > 0 ❌");
      return;
    }

    const formattedData = {
      rid: rid,
      rdDate: new Date(data.rdDate).toISOString().split("T")[0],
      rdAmount: Number(data.rdAmount),
      status: "PAID"
    };

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/psave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!res.ok) throw new Error();

      setData({
        rid: rid,
        rdDate: "",
        rdAmount: ""
      });

      if (onSuccess) onSuccess();

    } catch {
      toast.error("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* TITLE */}
      <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center">
        Add Deposit 💰
      </h2>

      {/* DATE */}
      <div className="relative">
        <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
        <input
          type="date"
          name="rdDate"
          value={data.rdDate}
          onChange={handleChange}
          className="input pl-10"
          required
        />
      </div>

      {/* AMOUNT */}
      <div className="relative">
        <FaRupeeSign className="absolute left-3 top-3 text-gray-500" />
        <input
          type="number"
          name="rdAmount"
          value={data.rdAmount}
          placeholder="Enter Amount"
          onChange={handleChange}
          className="input pl-10"
          required
        />
      </div>

      {/* QUICK BUTTONS */}
      <div className="flex gap-2 justify-center">
        {[500, 1000, 2000].map((amt) => (
          <button
            type="button"
            key={amt}
            onClick={() => setData({ ...data, rdAmount: amt })}
            className="bg-gray-200 dark:bg-gray-700 
            text-gray-800 dark:text-white 
            px-3 py-1 rounded hover:scale-105 transition"
          >
            ₹ {amt}
          </button>
        ))}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
        text-white py-2 rounded-xl shadow-lg hover:scale-105 transition"
      >
        {loading ? "Adding..." : "Add Deposit"}
      </button>

    </form>
  );
};

export default AddDeposit;