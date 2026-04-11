import { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import UserPassbook from "./UserPassbook";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import UserFilter from "./UserFilter";
import { toast } from "react-toastify";

const UserTable = () => {

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPassbook, setShowPassbook] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  // ✅ FETCH USERS
  const fetchUsers = () => {

    if (!token) {
      toast.error("Session expired ❌");
      return;
    }

    let url = "";
    const keyword = search.trim().toLowerCase();

    if (filters?.startDate || filters?.endDate || filters?.minAmount || filters?.maxAmount) {
      url = `http://localhost:8080/rdusers/filter?page=${page}&size=10`;

      if (filters.startDate) url += `&startDate=${filters.startDate}`;
      if (filters.endDate) url += `&endDate=${filters.endDate}`;
      if (filters.minAmount) url += `&minAmount=${filters.minAmount}`;
      if (filters.maxAmount) url += `&maxAmount=${filters.maxAmount}`;

    } else if (keyword !== "") {
      url = `http://localhost:8080/rdusers/search?keyword=${keyword}&page=${page}&size=10`;
    } else {
      url = `http://localhost:8080/rdusers/allUser?page=${page}&size=10`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => toast.error("Failed to load users ❌"));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, filters]);

  // ✅ DELETE USER WITH TOAST CONFIRM
  const deleteUser = (id) => {

    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold">Are you sure to delete?</p>

          <div className="flex gap-2 mt-3">

            <button
              onClick={() => {
                closeToast();

                fetch(`http://localhost:8080/rdusers/delete/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                })
                  .then(res => {
                    if (!res.ok) throw new Error();

                    toast.success("User Deleted Successfully ✅");
                    fetchUsers();
                  })
                  .catch(() => toast.error("Delete Failed ❌"));
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-400 px-3 py-1 rounded"
            >
              No
            </button>

          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Users</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="border p-2 rounded w-72"
        />

        <UserFilter onApply={(f) => {
          setFilters(f);
          setPage(0);
        }} />
      </div>

      {/* ADD USER MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[650px] relative">

            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2">
              ✖
            </button>

            <AddUserForm onSuccess={() => {
              setShowForm(false);
              fetchUsers();
            }} />

          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[650px] relative">

            <button onClick={() => setShowEditForm(false)} className="absolute top-2 right-2">
              ✖
            </button>

            <UpdateUserForm
              userData={selectedUser}
              onSuccess={() => {
                setShowEditForm(false);
                fetchUsers();
              }}
            />

          </div>
        </div>
      )}

      {/* PASSBOOK */}
      {showPassbook && (
        <UserPassbook
          rid={selectedUser?.rid}
          onClose={() => setShowPassbook(false)}
        />
      )}

      {/* TABLE */}
      <table className="w-full border shadow">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="p-3">RID</th>
            <th>Name</th>
            <th>Account</th>
            <th>Aadhar</th>
            <th>PAN</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.rid} className="text-center border-b">

              <td>{u.rid}</td>
              <td>{u.name}</td>
              <td>{u.accountNumber}</td>
              <td>{u.aadharNo}</td>
              <td>{u.panNo}</td>
              <td>₹ {u.rdAmount}</td>
              <td>{u.rdDate}</td>

              <td className="flex justify-center gap-2 p-2">

                <button onClick={() => deleteUser(u.rid)} className="bg-red-500 text-white px-2 py-1 rounded">
                  <MdDelete />
                </button>

                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setShowEditForm(true);
                  }}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  <FaRegEdit />
                </button>

                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setShowPassbook(true);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  <BsBank />
                </button>

              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default UserTable;