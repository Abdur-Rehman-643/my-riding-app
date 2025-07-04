import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        "Login failed. Please check your credentials or network connection."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <header className="text-center mt-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
              My Riding App
            </h1>
            <p className="text-gray-500 mt-2">Your journey starts here</p>
          </header>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="form-input w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-black hover:bg-gray-900 text-white rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-5 text-center text-sm text-gray-600">
          New here?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Create new Account
          </Link>
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Captain Login */}
        <Link
          to="/captain-login"
          className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
