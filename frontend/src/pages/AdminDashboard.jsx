import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    total: 0,
    completed: 0,
    pending: 0
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const fetchStats = async () => {
    try {
      const res = await axios.get("https://task-flow-ai0s.onrender.com/api/admin/stats", {
        headers: {
          token: localStorage.getItem("token")
        }
      });
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchAdminData = async () => {
    try {
      const res = await axios.get(`https://task-flow-ai0s.onrender.com/api/admin/tasks?page=${page}&search=${search}&status=${filter}`, {
        headers: {
          "token": localStorage.getItem("token")
        }
      });
      const data = res.data;
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  }
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://task-flow-ai0s.onrender.com/api/admin/tasks/${id}`, {
        headers: {
          "token": localStorage.getItem("token")
        }
      });
      fetchAdminData();
    } catch (error) {
      console.log(error)
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
  useEffect(() => {
    fetchAdminData();
    fetchStats();
  }, [page, search, filter])
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">⚙️ Admin Dashboard</h1>

        <div className='flex gap-2 items-center'>
          <div className='flex gap-2'>
            <button onClick={() => { setFilter("all"); setPage(1) }} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer">All</button>
            <button onClick={() => { setFilter("completed"); setPage(1) }} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer">Completed</button>
            <button onClick={() => { setFilter("pending"); setPage(1) }} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer">Pending</button>
          </div>
          <input type="text" placeholder='Search Task...' className=" p-2 rounded bg-gray-700 text-white" onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }} />
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.users}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Total Tasks</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Completed</p>
          <h2 className="text-2xl font-bold text-green-400">{stats.completed}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-400">{stats.pending}</h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Example Row */}
            {tasks.map((task) => (
              <tr key={task._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-6 py-4 font-medium">{task.userId?.name}</td>
                <td className="px-6 py-4 text-gray-400">{task.userId?.email}</td>
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${task.status === "completed"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                      }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="flex items-center justify-center mt-6 mb-4 gap-3">
              <td>
                {/* Prev Button */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition 
                ${page === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700"}`}
                >
                  ⬅ Prev
                </button>

                {/* Page Info */}
                <span className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm">
                  Page <span className="font-semibold">{page}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </span>

                {/* Next Button */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition 
                ${page === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700"}`}
                >
                  Next ➡
                </button>
              </td>


            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  )
}

export default AdminDashboard