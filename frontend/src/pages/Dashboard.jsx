import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Dashboard = () => {
  const [task, setTask] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token")
      if (!token) { window.location.href = "/"; }
      const res = await axios.get(`http://localhost:5000/api/tasks/?page=${page}&search=${search}&status=${filter}`, {
        headers: {
          "token": localStorage.getItem("token")
        }
      });
      // console.log(res.data);
      setTask(res.data.tasks);
      setTotalPages(res.data.totalPages);
    };
    fetchTask();
  }, [page, search, filter]);

  const handleClick = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/tasks/", form, {
        headers: {
          "token": localStorage.getItem("token")
        }
      })
      console.log(res.data)
      setTask([...task, res.data])
      setForm({ title: "", description: "" })
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          "token": localStorage.getItem("token")
        }
      })
      setTask(task.filter(t => t._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }
  const handleUpdate = async (id, currentStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        status: currentStatus === "completed" ? "pending" : "completed"
      }, {
        headers: {
          "token": localStorage.getItem("token")
        }
      })
      setTask(task.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }
  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description
    });
    setEditId(task._id)
  }
  const handleUpdateTask = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${editId}`, form, {
        headers: {
          "token": localStorage.getItem("token")
        }
      });
      setTask(task.map(t => t._id === editId ? res.data : t));
      setEditId(null);
      setForm({ title: "", description: "" });
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-start py-10">
      <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center  text-white">
            📝 Todo Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-1/5 cursor-pointer"
          >
            Logout
          </button>

        </div>
        <div className="flex gap-2 mb-6 flex-col">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <textarea
            type="text"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            value={form.description}
            placeholder="Description"
            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <div className='flex items-center justify-between'>
            <button
              onClick={editId ? handleUpdateTask : handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-1/5 cursor-pointer"
            >
              {editId ? "Update" : "Add"}
            </button>
            <input type="text" onChange={(e) => { setSearch(e.target.value); setPage(1) }} className='flex bg-gray-700 border border-gray-600 text-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400' placeholder='Search Task' />
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button onClick={() => setFilter("all")} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg cursor-pointer">
            All
          </button>
          <button onClick={() => {setFilter("completed");setPage(1)}} className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer">
            Completed
          </button>
          <button onClick={() => setFilter("pending")} className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer">
            Pending
          </button>
        </div>

        <div className="space-y-3">
          {task.map((tsk) => {
            return (
              <div key={tsk._id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div className="text-white flex flex-col">
                  <p className={tsk.status === "completed" ? "line-through text-gray-400" : "text-white"
                  }>{tsk.title} </p>
                  <p className={tsk.status === "completed" ? "line-through text-gray-400" : "text-white"}>{tsk.description}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleUpdate(tsk._id, tsk.status)} className={tsk.status === "completed" ? "text-green-400 hover:text-green-500  cursor-pointer" : "text-white cursor-pointer"}>✔</button>
                  <button onClick={() => handleEdit(tsk)} className="text-gray-400 hover:text-gray-500 cursor-pointer">🖍</button>
                  <button onClick={() => handleDelete(tsk._id)} className="text-red-700 hover:text-red-800 cursor-pointer">✖</button>
                </div>
              </div>
            )
          })}
        </div>
        <nav className="flex justify-center mt-6">
          <ul className="flex items-center space-x-1 text-sm">
            <li>
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 h-9 rounded-l-lg bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white cursor-pointer">
                Previous
              </button>
            </li>
            <li className='text-white'>
              Page {page} of {totalPages}
            </li>
            <li>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 h-9 rounded-r-lg bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white cursor-pointer">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Dashboard
