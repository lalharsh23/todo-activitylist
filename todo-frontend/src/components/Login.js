import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Example() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://todo-activitylist.onrender.com/api/users/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/todos");
    } catch (err) {
      // console.error(err);
      alert("Enter Valid User");
    }
  };
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-600">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h1 className="text-4xl font-bold text-white">Todo-App</h1>
          <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-white">
            Login
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
              <div className="mt-4 text-center">
                <Link
                  to="/signup"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  New User? Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
