import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Deposit = () => {

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [data, setData] = useState({
    rid: "",
    rdDate: "",
    rdAmount: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 SEARCH USERS
  useEffect(() => {

    if (!token) {
      toast.error("Session expired, please login again ❌");
      return;
    }

    if (!showDropdown) return;

    if (search.trim() === "") {
      setUsers([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://localhost:8080/rdusers/search?keyword=${search}&page=0&size=5`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then(d => setUsers(d.content || []))
        .catch(() => {
          setUsers([]);
        });
    }, 300);

    return () => clearTimeout(timeout);

  }, [search, showDropdown, token]);

  // 🔹 SELECT USER
  const handleSelectUser = (u) => {
    setData({ ...data, rid: u.rid });
    setSearch(`${u.name} (RID: ${u.rid})`);
    setUsers([]);
    setShowDropdown(false);
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first ❌");
      return;
    }

    if (!data.rid || !data.rdAmount || !data.rdDate) {
      toast.warning("Please fill all fields ⚠️");
      return;
    }

    if (data.rdAmount <= 0) {
      toast.error("Amount must be greater than 0 ❌");
      return;
    }

    const formattedData = {
      rid: data.rid,
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
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Forbidden");
        }
        throw new Error("Server error");
      }

      await res.json();

      toast.success("Deposit Added Successfully 🎉");

      setData({
        rid: "",
        rdDate: "",
        rdAmount: "",
      });

      setSearch("");

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

  // 🔹 CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px]">

        <h1 className="text-xl font-bold mb-4 text-center">
          Deposit Page
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* 🔍 SEARCH */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>

            <input
              type="text"
              placeholder="Search by name or RID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="border p-2 w-full rounded"
            />

            {showDropdown && (
              <div className="absolute w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg z-50">

                {users.length > 0 ? (
                  users.map((u) => (
                    <div
                      key={u.rid}
                      onClick={() => handleSelectUser(u)}
                      className="p-2 cursor-pointer hover:bg-blue-100"
                    >
                      <b>{u.name}</b> (RID: {u.rid})
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-center">
                    No user found
                  </div>
                )}

              </div>
            )}

          </div>

          {/* DATE */}
          <input
            type="date"
            value={data.rdDate}
            onChange={(e) => setData({ ...data, rdDate: e.target.value })}
            className="border p-2 w-full rounded"
          />

          {/* AMOUNT */}
          <input
            type="number"
            value={data.rdAmount}
            onChange={(e) => setData({ ...data, rdAmount: e.target.value })}
            placeholder="Enter Amount"
            className="border p-2 w-full rounded"
          />

          {/* QUICK BUTTONS */}
          <div className="flex gap-2">
            {[1000, 2000, 5000].map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setData({ ...data, rdAmount: amt })}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                ₹ {amt}
              </button>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white p-2 w-full rounded"
          >
            {loading ? "Adding..." : "Add Deposit"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Deposit;