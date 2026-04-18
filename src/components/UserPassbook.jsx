import { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AddDeposit from "./AddDeposit";
import { toast } from "react-toastify";
import { BiShow } from "react-icons/bi";
import { RiFileDownloadLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

const UserPassbook = ({ rid, onClose }) => {

  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalFine, setTotalFine] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [maturity, setMaturity] = useState(0);

  useEffect(() => {
    fetchPassbook();
    fetchUser();
    fetchMaturity();
  }, [rid]);

  //FETCH 
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

  //  PDF 
  const viewPdf = async () => {
    try {
      const res = await fetch(`http://localhost:8080/pdf/${rid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch {
      toast.error("PDF open failed ");
    }
  };

  const downloadPdf = async () => {
    try {
      const res = await fetch(`http://localhost:8080/pdf/${rid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `passbook_${rid}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toast.error("Download failed ");
    }
  };

  //  PROGRESS
  const progress = user ? (data.length / user.totalMonths) * 100 : 0;

  // DELETE
  const deleteEntry = (pid) => {
    fetch(`http://localhost:8080/pdelete/${pid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success("Deleted");
        fetchPassbook();
        fetchMaturity();
      })
      .catch(() => toast.error("Delete Failed "));
  };

  // UPDATE 
  const updateEntry = (e) => {
    e.preventDefault();

    const formattedData = {
      ...editData,
      rdDate: editData.rdDate.split("T")[0]
    };

    fetch(`http://localhost:8080/pupdate/${editData.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formattedData)
    })
      .then(() => {
        toast.success("Updated ");
        setEditData(null);
        fetchPassbook();
        fetchMaturity();
      })
      .catch(() => toast.error("Update Failed ❌"));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">

      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
      p-6 rounded-2xl w-[900px] shadow-2xl relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Passbook - {user?.name}
          </h2>

          <button onClick={onClose} className="bg-gray-300 p-2 rounded">
            <FaTimes />
          </button>
        </div>

        <div className="flex gap-6">

          {/* LEFT */}
          <div className="flex flex-col items-center w-[200px]">

            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="50"
                  stroke="#e5e7eb" strokeWidth="10" fill="none" />

                <circle cx="50%" cy="50%" r="50"
                  stroke="#22c55e"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-green-500">
                  {Math.round(progress)}%
                </span>
                <span className="text-xs">
                  {data.length}/{user?.totalMonths}
                </span>
              </div>
            </div>

            <p className="mt-2">RD Progress</p>
          </div>

          {/* RIGHT */}
          <div className="flex-1">

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
              <p className="font-semibold">
                Plan: {user?.totalMonths} Months
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mb-3">

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 hover:shadow-md 
  hover:scale-105 text-white px-4 py-2 rounded-lg"
              >
                <FaPlus /> Add Deposit
              </button>

              <button
                onClick={viewPdf}
                className="bg-purple-500 flex items-center gap-2 hover:bg-purple-600 hover:shadow-md 
  hover:scale-105 text-white px-4 py-2 rounded-lg"
              >
                <span><BiShow size={20} /></span>
                View
                
              </button>

              <button
                onClick={downloadPdf}
                className="bg-blue-500 flex items-center gap-2 hover:bg-blue-600 hover:shadow-md 
  hover:scale-105 text-white px-4 py-2 rounded-lg"
              >
                <span><RiFileDownloadLine size={20} /></span>
                 Download
              </button>

            </div>

            {/* TABLE */}
            <div className="overflow-auto max-h-[350px]">
              <table className="w-full text-sm rounded-xl overflow-hidden">

                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <tr>
                    <th className="p-2">PID</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Fine</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((p) => (
                    <tr key={p.pid} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center">
                      <td>{p.pid}</td>
                      <td>{new Date(p.rdDate).toLocaleDateString()}</td>
                      <td className="text-green-500">₹ {p.rdAmount}</td>
                      <td className="text-red-500">₹ {p.fineAmount}</td>
                      <td>{p.status}</td>

                      <td className="flex justify-center gap-2">
                        <button onClick={() => setEditData(p)} className="text-blue-500">
                          <FaEdit />
                        </button>

                        <button onClick={() => deleteEntry(p.pid)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>

        {/* ADD POPUP */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]">
            <div className="relative w-[380px] p-5 rounded-2xl shadow-2xl bg-white dark:bg-gray-900">

              <button
                     onClick={() => setShowForm(false)}
                     className="sticky top-0 float-right m-3 text-red-500 text-xl z-10 bg-red-100 dark:bg-red-900 
               text-red-600 dark:text-red-300
               hover:bg-red-200 dark:hover:bg-red-800
               hover:scale-110 active:scale-95"
                   >
                     <RxCross2 size={26} />
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

        {/* UPDATE POPUP */}
        {editData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]">

            <div className="relative w-[400px] p-6 rounded-2xl shadow-2xl
              bg-white dark:bg-gray-900 
              text-gray-800 dark:text-white
              border border-gray-300 dark:border-gray-700">

               <button
                     onClick={() => setEditData(null)}
                     className="sticky top-0 float-right m-3 text-red-500 text-xl z-10 bg-red-100 dark:bg-red-900 
               text-red-600 dark:text-red-300
               hover:bg-red-200 dark:hover:bg-red-800
               hover:scale-110 active:scale-95"
                   >
                     <RxCross2 size={26} />
                   </button>

              <h2 className="text-xl font-bold mb-4 text-center">
                Update Deposit
              </h2>

              <form onSubmit={updateEntry} className="space-y-4">

                <input
                  type="date"
                  value={editData.rdDate?.split("T")[0]}
                  onChange={(e) =>
                    setEditData({ ...editData, rdDate: e.target.value })
                  }
                  className="w-full p-3 rounded-lg
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-600
                  text-black dark:text-white"
                />

                <input
                  type="number"
                  value={editData.rdAmount}
                  onChange={(e) =>
                    setEditData({ ...editData, rdAmount: e.target.value })
                  }
                  className="w-full p-3 rounded-lg
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-600
                  text-black dark:text-white"
                />

                <div className="flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={() => setEditData(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Update
                  </button>

                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserPassbook;