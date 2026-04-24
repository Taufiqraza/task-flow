import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom"
const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [msg, setMsg] = useState("")
  const [isSucess, setIsSuccess] = useState(false);
  const handleRegister = async () => {
    try {
      const res = await axios.post("https://task-flow-ai0s.onrender.com/api/auth/register", form);
      console.log(res);
      setMsg(res.data.message);
      setIsSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000)
    } catch (error) {
      setMsg(error.response?.data?.message || "Registration Failed")
      setIsSuccess(false)
    }
  }
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            Task Flow
          </a>

          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <h5 className={msg ? isSucess ? "text-green-700 text-center" : "text-red-700 text-center" : ""}>{msg}</h5>
              <form className="space-y-4 md:space-y-6" onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    value={form.name}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        block w-full p-2.5 
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    value={form.email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        block w-full p-2.5 
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    value={form.password}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        block w-full p-2.5 
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                {/* <div className="flex items-start">
                  <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded 
                      bg-gray-50 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"/>

                    <label className="ml-3 text-sm text-gray-500 dark:text-gray-300">
                      I accept the
                      <a href="#" className="font-medium text-blue-600 hover:underline">
                        Terms and Conditions
                      </a>
                    </label>
                </div> */}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 
                    focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create an account
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <Link to="/" className="font-medium text-blue-600 hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register