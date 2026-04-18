import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [deleteRange, setDeleteRange] = useState("today");

  const token = localStorage.getItem("token");

  // FETCH LOGS
  const fetchLogs = async () => {
    try {
      let url = "http://localhost:8080/audit/all";

      if (searchUser && actionFilter) {
        url = `http://localhost:8080/audit/search?username=${searchUser}&action=${actionFilter}`;
      } else if (searchUser) {
        url = `http://localhost:8080/audit/user?username=${searchUser}`;
      } else if (actionFilter) {
        url = `http://localhost:8080/audit/action?action=${actionFilter}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // DELETE BY RANGE
  const handleDeleteByRange = () => {
    toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="mb-2 font-semibold">
            Delete {deleteRange} logs?
          </p>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await axios.delete(
                    `http://localhost:8080/audit/delete-range/${deleteRange}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    }
                  );

                  toast.success("Logs deleted successfully ✅");
                  fetchLogs();
                } catch (err) {
                  toast.error("Delete failed ❌");
                }
                closeToast();
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-400 hover:bg-gray-500 px-3 py-1 rounded text-white"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
      }
    );
  };

  // BADGE COLOR
  const getBadgeColor = (action) => {
    if (action.includes("FAILED")) return "bg-red-700";
    if (action.includes("LOGIN")) return "bg-green-500";
    if (action.includes("DELETE")) return "bg-red-500";
    if (action.includes("UPDATE")) return "bg-yellow-500";
    if (action.includes("DEPOSIT")) return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow">
        <h1 className="text-2xl font-bold">📊 Audit Logs</h1>

        <div className="flex items-center gap-3">
          {/* SELECT RANGE */}
          <select
            value={deleteRange}
            onChange={(e) => setDeleteRange(e.target.value)}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="15">Last 15 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Data</option>
          </select>

          {/* DELETE BUTTON */}
          <button
            onClick={handleDeleteByRange}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
          >
            Delete Logs
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by username"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-800"
        />

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-800"
        >
          <option value="">All Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="FAILED_LOGIN">FAILED_LOGIN</option>
          <option value="ADD_DEPOSIT">ADD_DEPOSIT</option>
          <option value="UPDATE_DEPOSIT">UPDATE_DEPOSIT</option>
          <option value="DELETE_DEPOSIT">DELETE_DEPOSIT</option>
        </select>

        <button
          onClick={fetchLogs}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2">Action</th>
              <th className="p-2">User</th>
              <th className="p-2">Role</th>
              <th className="p-2">IP</th>
              <th className="p-2">Time</th>
              <th className="p-2">Details</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="text-center border-t hover:bg-gray-100 dark:hover:bg-gray-800">

                  <td className="p-2">
                    <span className={`px-2 py-1 text-white rounded ${getBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="p-2">{log.username}</td>

                  <td className="p-2">
                    <span className="px-2 py-1 bg-purple-500 text-white rounded">
                      {log.role}
                    </span>
                  </td>

                  <td className="p-2">{log.ipAddress}</td>

                  <td className="p-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="p-2 text-sm">{log.details}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No audit logs found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}