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

  // SEARCH USERS
  useEffect(() => {

    if (!token) {
      toast.error("Session expired");
      return;
    }

    if (!showDropdown) return;

    if (search.trim() === "") {
      setUsers([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://localhost:8080/rdusers/search?keyword=${search}&page=0&size=5`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(d => setUsers(d.content || []))
        .catch(() => setUsers([]));
    }, 300);

    return () => clearTimeout(timeout);

  }, [search, showDropdown, token]);

  // SELECT USER
  const handleSelectUser = (u) => {
    setData({ ...data, rid: u.rid });
    setSearch(`${u.name} (RID: ${u.rid})`);
    setUsers([]);
    setShowDropdown(false);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.rid || !data.rdAmount || !data.rdDate) {
      toast.warning("Fill all fields ");
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

      if (!res.ok) throw new Error();

      toast.success("Deposit Added 🎉");

      setData({ rid: "", rdDate: "", rdAmount: "" });
      setSearch("");

    } catch {
      toast.error("Error ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black">

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
      p-8 rounded-2xl shadow-2xl w-[420px] 
      border border-gray-200 dark:border-gray-700">

        <h1 className="text-2xl font-bold mb-5 text-center 
        text-gray-800 dark:text-white">
          Deposit 
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-3 py-2 rounded-lg 
              bg-gray-100 dark:bg-gray-700 
              text-gray-800 dark:text-white 
              border border-gray-300 dark:border-gray-600 
              outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showDropdown && (
              <div className="absolute w-full bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded mt-1 max-h-40 overflow-y-auto shadow-lg z-[9999]">

                {users.length > 0 ? (
                  users.map((u) => (
                    <div
                      key={u.rid}
                      onClick={() => handleSelectUser(u)}
                      className="p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700"
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
            className="input w-full"
          />

          {/* AMOUNT */}
          <input
            type="number"
            value={data.rdAmount}
            onChange={(e) => setData({ ...data, rdAmount: e.target.value })}
            placeholder="Enter Amount"
            className="input w-full"
          />

          {/* QUICK BUTTONS */}
          <div className="flex gap-2">
            {[1000, 2000, 5000].map((amt) => (
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
      </div>
    </div>
  );
};

export default Deposit;