import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const captain = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captain
      );

      if (response.status === 200) {
        const data = response.data;

        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Captain login failed:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Login Error: ${error.response.data.message}`);
      } else {
        alert("Login failed. Please check your connection or try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <header className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
              My Riding App
            </h1>
            <p className="text-gray-500 mt-2">Your journey starts here</p>
          </header>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-all"
          >
            Login as Captain
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Join a fleet?{" "}
          <Link to="/captain-signup" className="text-blue-600 hover:underline">
            Register as a Captain
          </Link>
        </p>

        <hr className="my-6" />

        <Link
          to="/login"
          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;
