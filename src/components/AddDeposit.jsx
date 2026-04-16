import { useState } from "react";
import { toast } from "react-toastify";

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

      toast.success("Deposit Added 🎉");

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
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* TITLE */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Add Deposit 💰
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter monthly deposit details
        </p>
      </div>

      {/* DATE */}
      <div className="flex flex-col">
        <label className="text-xs mb-1 text-gray-600 dark:text-gray-300">
          Deposit Date
        </label>
        <input
          type="date"
          name="rdDate"
          value={data.rdDate}
          onChange={handleChange}
          className="p-2 rounded-md text-sm 
          bg-gray-100 dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600 
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* AMOUNT */}
      <div className="flex flex-col">
        <label className="text-xs mb-1 text-gray-600 dark:text-gray-300">
          Amount
        </label>
        <input
          type="number"
          name="rdAmount"
          value={data.rdAmount}
          placeholder="Enter Amount"
          onChange={handleChange}
          className="p-2 rounded-md text-sm 
          bg-gray-100 dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600 
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="px-3 py-1 rounded-md 
            bg-gray-200 dark:bg-gray-700 
            text-gray-800 dark:text-white 
            hover:bg-green-500 hover:text-white 
            transition"
          >
            ₹ {amt}
          </button>
        ))}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl text-white 
        bg-gradient-to-r from-green-500 to-emerald-600 
        hover:from-green-600 hover:to-emerald-700
        shadow-lg transition transform hover:scale-[1.02]"
      >
        {loading ? "Adding..." : "Add Deposit"}
      </button>

    </form>
  );
};

export default AddDeposit;