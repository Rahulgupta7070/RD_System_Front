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

  // ✅ FETCH PASSBOOK
  const fetchPassbook = () => {

    if (!token || !rid) return;

    fetch(`http://localhost:8080/passbook/${rid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Forbidden");
          throw new Error();
        }
        return res.json();
      })
      .then(d => {
        if (!Array.isArray(d)) {
          setData([]);
          setTotal(0);
          setTotalFine(0);
          return;
        }

        setData(d);

        const sum = d.reduce((acc, curr) => acc + Number(curr.rdAmount || 0), 0);
        const fineSum = d.reduce((acc, curr) => acc + Number(curr.fineAmount || 0), 0);

        setTotal(sum);
        setTotalFine(fineSum);
      })
      .catch((err) => {
        if (err.message === "Forbidden") {
          toast.error("Access Denied (403) ❌");
        } else {
          toast.error("Failed to load passbook ❌");
        }
        setData([]);
      });
  };

  // ✅ FETCH USER
  const fetchUser = () => {

    if (!token || !rid) return;

    fetch(`http://localhost:8080/rdusers/${rid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(d => setUser(d))
      .catch(() => {
        toast.error("Failed to load user ❌");
        setUser(null);
      });
  };

  // ✅ FETCH MATURITY
  const fetchMaturity = () => {

    if (!token || !rid) return;

    fetch(`http://localhost:8080/scheduler/maturity/${rid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(d => setMaturity(d))
      .catch(() => {
        toast.error("Failed to load maturity ❌");
        setMaturity(0);
      });
  };

  useEffect(() => {
    fetchPassbook();
    fetchUser();
    fetchMaturity();
  }, [rid]);

  // ✅ DELETE ENTRY
  const deleteEntry = (pid) => {

    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-2">Are you sure?</p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                closeToast();

                fetch(`http://localhost:8080/pdelete/${pid}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` }
                })
                  .then(res => {
                    if (!res.ok) {
                      if (res.status === 403) throw new Error("Forbidden");
                      throw new Error();
                    }

                    toast.success("Entry Deleted Successfully ✅");
                    fetchPassbook();
                    fetchMaturity();
                  })
                  .catch((err) => {
                    if (err.message === "Forbidden") {
                      toast.error("Access Denied (403) ❌");
                    } else {
                      toast.error("Delete Failed ❌");
                    }
                  });

              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ✅ UPDATE ENTRY
  const updateEntry = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/pupdate/${editData.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editData),
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Forbidden");
          throw new Error();
        }

        toast.success("Updated Successfully 🔄");
        setEditData(null);
        fetchPassbook();
        fetchMaturity();
      })
      .catch((err) => {
        if (err.message === "Forbidden") {
          toast.error("Access Denied (403) ❌");
        } else {
          toast.error("Update Failed ❌");
        }
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">

      <div className="bg-white p-6 rounded-xl w-[750px] shadow-2xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Passbook - {user?.name || "User"}
          </h2>

          <button onClick={onClose} className="bg-zinc-300 p-2 rounded">
            <FaTimes />
          </button>
        </div>

        <p className="text-green-600 font-bold">Total Deposit: ₹ {total}</p>
        <p className="text-blue-600 font-bold">Interest: ₹ {(maturity - total).toFixed(2)}</p>
        <p className="text-purple-600 font-bold">Maturity: ₹ {maturity.toFixed(2)}</p>
        <p className="text-red-600 font-bold">Fine: ₹ {totalFine}</p>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 my-3 rounded"
        >
          <FaPlus /> Add Deposit
        </button>

        {showForm && (
          <AddDeposit
            rid={rid}
            onSuccess={() => {
              setShowForm(false);
              fetchPassbook();
              fetchMaturity();
              toast.success("Deposit Added Successfully 🎉");
            }}
          />
        )}

        {editData && (
          <form onSubmit={updateEntry} className="mb-4 space-y-2 border p-3 rounded bg-gray-50">

            <input
              type="date"
              value={editData.rdDate}
              onChange={(e) =>
                setEditData({ ...editData, rdDate: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              type="number"
              value={editData.rdAmount}
              onChange={(e) =>
                setEditData({ ...editData, rdAmount: e.target.value })
              }
              className="border p-2 w-full"
            />

            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Update
            </button>
          </form>
        )}

        <table className="w-full border">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th>PID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Late</th>
              <th>Fine</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr key={p.pid} className="text-center">

                <td>{p.pid}</td>
                <td>{new Date(p.rdDate).toLocaleDateString()}</td>
                <td>₹ {p.rdAmount}</td>
                <td>{p.lateDay}</td>
                <td>₹ {p.fineAmount}</td>
                <td>{p.status}</td>

                <td className="space-x-2">

                  <button onClick={() => setEditData({ ...p })}>
                    <FaEdit />
                  </button>

                  <button onClick={() => deleteEntry(p.pid)}>
                    <FaTrash />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default UserPassbook;