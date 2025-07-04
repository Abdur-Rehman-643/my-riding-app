import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }

      // Clear input fields after successful registration
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
    } catch (error) {
      console.error("Captain registration failed:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Registration Error: ${error.response.data.message}`);
      } else {
        alert(
          "Registration failed. Please check your connection or try again later."
        );
      }
    }
  };

  return (
    <div className="py-4 px-5 h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-200">
      <div>
        {/* Replaced logo with clean header */}
        <header className="text-center mb-3">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
            My Riding App
          </h1>
          <p className="text-gray-500 mt-1">Create Your Captain Account</p>
        </header>

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">Captain Name</h3>
          <div className="flex gap-4 mb-1">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />
          </div>

          <h3 className="text-lg font-medium mb-1">Email Address</h3>
          <input
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
          />

          <h3 className="text-lg font-medium mb-2">Password</h3>
          <input
            required
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
          />

          <h3 className="text-lg font-medium mt-2">Vehicle Information</h3>

          <div className="mb-1">
            <label className="block mb-1 text-gray-700 font-medium">
              Vehicle Color
            </label>
            <input
              required
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />
          </div>

          <div className="mb-1">
            <label className="block mb-1 text-gray-700 font-medium">
              Vehicle Plate
            </label>
            <input
              required
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />
          </div>

          <div className="mb-1">
            <label className="block mb-1 text-gray-700 font-medium">
              Vehicle Capacity
            </label>
            <input
              required
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-gray-700 font-medium">
              Vehicle Type
            </label>
            <select
              required
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg"
          >
            Create Captain Account
          </button>
        </form>

        <p className="text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      {/* Legal Notice */}
      {/* <div>
        <p className="text-[10px] mt-6 leading-tight text-gray-500">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div> */}
    </div>
  );
};

export default CaptainSignup;
