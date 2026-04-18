import { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import UserPassbook from "./UserPassbook";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import UserFilter from "./UserFilter";
import { toast } from "react-toastify";
import { FaUsersLine } from "react-icons/fa6";
import { IoIosPersonAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

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

  //FETCH USERS 
  const fetchUsers = () => {

    if (!token) {
      toast.error("Session expired ");
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
      .catch(() => toast.error("Failed to load users "));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, filters]);

  // DELETE 
const deleteUser = (id) => {

  toast(
    ({ closeToast }) => (
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded">

        <p className="font-semibold mb-3">
          Delete this user?
        </p>

        <div className="flex justify-center gap-3">

          {/* YES */}
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
                  toast.success("User Deleted ✅");
                  fetchUsers();
                })
                .catch(() => toast.error("Delete Failed ❌"));
            }}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>

          {/* NO */}
          <button
            onClick={closeToast}
            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-1 rounded"
          >
            No
          </button>

        </div>

      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      style: {
        background: "transparent",
        boxShadow: "none"
      }
    }
  );
};
  return (
    <div className="p-6 relative">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
       <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
  Users 
  <span>
   <FaUsersLine className="text-blue-500" size={28} />
  </span>
</h1>

       <button
  onClick={() => setShowForm(true)}
  className="flex items-center gap-2 
  bg-gradient-to-r from-green-500 to-emerald-600 
  hover:from-green-600 hover:to-emerald-700
  text-white px-5 py-2 rounded-xl shadow-md 
  hover:shadow-lg hover:scale-105 active:scale-95
  transition-all duration-300"
>
 <IoIosPersonAdd className="group-hover:rotate-12 transition" />
  <span className="font-medium">Add User</span>
</button>
      </div>
<div className="flex justify-between items-center mb-6">

  {/* SEARCH INPUT */}
  <div className="relative w-80">
    
    {/* Icon */}
    <FiSearch 
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" 
      size={18} 
    />

    {/* Input */}
    <input
      type="text"
      placeholder="Search user..."
      value={search}
      onChange={(e) => {
        setPage(0);
        setSearch(e.target.value);
      }}
      className="w-full pl-10 pr-4 py-2 rounded-xl shadow
      bg-white dark:bg-gray-800 
      text-gray-800 dark:text-white 
      border border-gray-300 dark:border-gray-700
      focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* FILTER */}
  <UserFilter onApply={(f) => {
    setFilters(f);
    setPage(0);
  }} />

</div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-900 dark:bg-gray-700 text-white">
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
              <tr
                key={u.rid}
                className="text-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="p-3 text-gray-800 dark:text-white">{u.rid}</td>
                <td className="text-gray-800 dark:text-white">{u.name}</td>
                <td className="text-gray-800 dark:text-white">{u.accountNumber}</td>
                <td className="text-gray-800 dark:text-white">{u.aadharNo}</td>
                <td className="text-gray-800 dark:text-white">{u.panNo}</td>

                <td className="font-bold text-green-600 dark:text-green-400">
                  ₹ {u.rdAmount}
                </td>

                <td className="text-gray-800 dark:text-white">{u.rdDate}</td>

                <td className="flex justify-center gap-2 p-2">

                  {/* DELETE */}
                  <button
                    onClick={() => deleteUser(u.rid)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow hover:scale-110 transition"
                  >
                    <MdDelete />
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setShowEditForm(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-lg shadow hover:scale-110 transition"
                  >
                    <FaRegEdit />
                  </button>

                  {/* PASSBOOK */}
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setShowPassbook(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow hover:scale-110 transition"
                  >
                    <BsBank />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-800 dark:text-white">
          {page + 1} / {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page + 1 === totalPages}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/*ADD USER MODAL*/}
  

{showForm && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-2">

    {/* MODAL BOX */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowForm(false)}
        className="sticky top-0 float-right m-3 text-red-500 text-xl z-10 bg-red-100 dark:bg-red-900 
  text-red-600 dark:text-red-300
  hover:bg-red-200 dark:hover:bg-red-800
  hover:scale-110 active:scale-95"
      >
        <RxCross2 size={26} />
      </button>

      {/* FORM CONTENT */}
      <div className="p-4 sm:p-6">
        <AddUserForm
          onSuccess={() => {
            setShowForm(false);
            fetchUsers();
          }}
        />
      </div>

    </div>
  </div>
)}
      {/*EDIT USER MODAL */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[600px] shadow-2xl relative">

            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-3 right-3 text-red-500 text-xl"
            >
             <RxCross2  size={26}/>
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

      {/* PASSBOOK  */}
      {showPassbook && (
        <UserPassbook
          rid={selectedUser?.rid}
          onClose={() => setShowPassbook(false)}
        />
      )}

    </div>
  );
};

export default UserTable;