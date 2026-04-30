import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [msg, setMsg] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      const res = await axios.post(
        "https://task-flow-ai0s.onrender.com/api/auth/login",
        form
      )

      setMsg(res.data.message)
      setIsSuccess(true)

      setTimeout(() => {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("role", res.data.role)

        if (res.data.role === "admin") {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dashboard"
        }
      }, 1500)

    } catch (error) {
      setMsg(error.response?.data?.message || "Login Failed")
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">

      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Task Flow Login
        </h2>

        {/* Message */}
        {msg && (
          <p className={`text-center mb-4 text-sm ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}>
            {msg}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1 text-sm">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white 
            border border-gray-600 focus:outline-none focus:ring-2 
            focus:ring-cyan-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-1 text-sm">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white 
            border border-gray-600 focus:outline-none focus:ring-2 
            focus:ring-cyan-500"
            placeholder="Enter your password"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white 
          py-2 rounded-lg font-semibold transition duration-200 cursor-pointer 
          disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login