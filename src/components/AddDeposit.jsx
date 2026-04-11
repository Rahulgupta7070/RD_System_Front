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

  // ✅ HANDLE CHANGE
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

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❗ TOKEN CHECK
    if (!token) {
      toast.error("Session expired ❌");
      return;
    }

    // ✅ VALIDATION
    if (!data.rdDate || !data.rdAmount) {
      toast.warning("Please fill all fields ⚠️");
      return;
    }

    if (data.rdAmount <= 0) {
      toast.error("Amount must be greater than 0 ❌");
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

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Forbidden");
        }

        const err = await res.text();
        throw new Error(err || "Failed");
      }

      await res.json();

      // ❌ REMOVE SUCCESS TOAST FROM HERE
      // toast.success("Deposit Added Successfully 💰");

      // ✅ RESET FORM
      setData({
        rid: rid,
        rdDate: "",
        rdAmount: ""
      });

      // ✅ CALL PARENT (waha toast show hoga)
      if (onSuccess) onSuccess();

    } catch (err) {
      if (err.message === "Forbidden") {
        toast.error("Access Denied (403) ❌");
      } else {
        toast.error(err.message || "Server Error ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <input
        type="date"
        name="rdDate"
        value={data.rdDate}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="number"
        name="rdAmount"
        value={data.rdAmount}
        placeholder="Enter Amount"
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white p-2 w-full rounded"
      >
        {loading ? "Adding..." : "Add Deposit"}
      </button>

    </form>
  );
};

export default AddDeposit;