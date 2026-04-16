// Source: uploaded file
// :contentReference[oaicite:0]{index=0}

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FETCH ADMINS
  const fetchAdmins = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/admin/all", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setAdmins(data);
    } catch {
      toast.error("Failed to load admins ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ❌ DELETE ADMIN
  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gray-800">
            Delete this admin?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              No
            </button>

            <button
              onClick={async () => {
                closeToast();

                try {
                  setDeleteLoading(true);

                  const res = await fetch(
                    `http://localhost:8080/admin/delete/${id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: "Bearer " + token,
                      },
                    }
                  );

                  const msg = await res.text();

                  if (!res.ok) throw new Error(msg);

                  toast.success("Admin deleted successfully 🗑️");

                  fetchAdmins();
                } catch (err) {
                  toast.error(err.message || "Delete failed ❌");
                } finally {
                  setDeleteLoading(false);
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
      
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Admin List 👑
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    Loading admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No Admin Found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b dark:border-gray-700 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3 font-semibold text-gray-700 dark:text-gray-200">
                      #{admin.id}
                    </td>

                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {admin.email}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          admin.role === "ROLE_SUPER_ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {admin.role !== "ROLE_SUPER_ADMIN" && (
                        <button
                          onClick={() => handleDelete(admin.id)}
                          disabled={deleteLoading}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminList;