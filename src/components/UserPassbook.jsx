import { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AddDeposit from "./AddDeposit";
import { toast } from "react-toastify";

const UserPassbook = ({ rid, onClose }) => {

  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalFine, setTotalFine] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [maturity, setMaturity] = useState(0);

  // ================= FETCH =================
  useEffect(() => {
    fetchPassbook();
    fetchUser();
    fetchMaturity();
  }, [rid]);

  const fetchPassbook = () => {
    fetch(`http://localhost:8080/passbook/${rid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        setData(d || []);
        const sum = d.reduce((a, c) => a + Number(c.rdAmount || 0), 0);
        const fine = d.reduce((a, c) => a + Number(c.fineAmount || 0), 0);
        setTotal(sum);
        setTotalFine(fine);
      });
  };

  const fetchUser = () => {
    fetch(`http://localhost:8080/rdusers/${rid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser);
  };

  const fetchMaturity = () => {
    fetch(`http://localhost:8080/scheduler/maturity/${rid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMaturity);
  };

  // ================= DELETE CONFIRM =================
 const deleteEntry = (pid) => {

  toast(
    ({ closeToast }) => (
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
      p-4 rounded-lg shadow-lg text-center">

        <p className="font-semibold mb-3">
          Delete this entry?
        </p>

        <div className="flex justify-center gap-3">

          <button
            onClick={() => {
              closeToast();

              fetch(`http://localhost:8080/pdelete/${pid}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => {
                  if (!res.ok) throw new Error();

                  toast.success("Deleted ✅");
                  fetchPassbook();
                  fetchMaturity();
                })
                .catch(() => toast.error("Delete Failed ❌"));
            }}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>

          <button
            onClick={closeToast}
            className="bg-gray-300 dark:bg-gray-600 
            text-black dark:text-white px-4 py-1 rounded"
          >
            No
          </button>

        </div>

      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      style: {
        background: "transparent",
        boxShadow: "none"
      }
    }
  );
};
  // ================= UPDATE =================
  const updateEntry = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/pupdate/${editData.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editData)
    })
      .then(() => {
        toast.success("Updated ✅");
        setEditData(null);
        fetchPassbook();
        fetchMaturity();
      })
      .catch(() => toast.error("Update Failed ❌"));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
      p-6 rounded-2xl w-[850px] shadow-2xl relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Passbook - {user?.name || "User"}
          </h2>

          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-700 p-2 rounded hover:bg-red-500 hover:text-white transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <p className="text-green-600 font-bold">Total: ₹ {total}</p>
          <p className="text-blue-500 font-bold">
            Interest: ₹ {(maturity - total).toFixed(2)}
          </p>
          <p className="text-purple-500 font-bold">
            Maturity: ₹ {maturity.toFixed(2)}
          </p>
          <p className="text-red-500 font-bold">
            Fine: ₹ {totalFine}
          </p>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded mb-3 hover:bg-green-600"
        >
          <FaPlus /> Add Deposit
        </button>

        {/* TABLE */}
        <div className="overflow-auto max-h-[350px]">
          <table className="w-full border border-gray-300 dark:border-gray-700 text-center">

            <thead className="bg-gray-900 text-white">
              <tr>
                <th>PID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Fine</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((p) => (
                <tr key={p.pid} className="border-b dark:border-gray-700">

                  <td>{p.pid}</td>
                  <td>{new Date(p.rdDate).toLocaleDateString()}</td>
                  <td className="text-green-500 font-bold">₹ {p.rdAmount}</td>
                  <td className="text-red-500">₹ {p.fineAmount}</td>
                  <td>{p.status}</td>

                  <td className="space-x-2">

                    <button
                      onClick={() => setEditData({ ...p })}
                      className="text-yellow-500"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteEntry(p.pid)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= ADD DEPOSIT MODAL ================= */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[10000]">

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl w-[400px] relative">

              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✖
              </button>

              <AddDeposit
                rid={rid}
                onSuccess={() => {
                  setShowForm(false);
                  fetchPassbook();
                  fetchMaturity();
                  toast.success("Deposit Added 🎉");
                }}
              />

            </div>
          </div>
        )}

        {/* ================= EDIT FORM ================= */}
        {editData && (
          <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">

            <form onSubmit={updateEntry} className="space-y-2">

              <input
                type="date"
                value={editData.rdDate}
                onChange={(e) =>
                  setEditData({ ...editData, rdDate: e.target.value })
                }
                className="input"
              />

              <input
                type="number"
                value={editData.rdAmount}
                onChange={(e) =>
                  setEditData({ ...editData, rdAmount: e.target.value })
                }
                className="input"
              />

              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                Update
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default UserPassbook;