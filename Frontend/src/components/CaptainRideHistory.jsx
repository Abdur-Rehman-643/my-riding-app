import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CaptainRideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRideHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/ride-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRides(response.data.rides || []);
    } catch (error) {
      console.error("Failed to fetch captain ride history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top bar */}
      <div className="fixed z-20 p-6 top-0 flex items-center justify-between w-full bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-800">My Riding App</div>
        <div className="flex items-center gap-3">
          <Link
            to="/captain-home"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow hover:shadow-md transition"
          >
            <i className="ri-home-4-line text-xl text-gray-700"></i>
          </Link>
        </div>
      </div>

      {/* Spacer for top bar */}
      <div className="h-24" />

      {/* Content */}
      <div className="px-6 pb-12 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 text-lg">
            Loading ride history...
          </p>
        ) : rides.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No rides found.</p>
        ) : (
          <div className="grid gap-5">
            {rides.map((ride, index) => (
              <div
                key={ride._id || index}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-800 font-semibold">
                      {ride.pickup} ➜ {ride.destination}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Fare: Rs. <strong>{ride.fare}</strong>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                      ride.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : ride.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ride.status}
                  </span>
                </div>

                {ride.user && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">User:</span>{" "}
                    {ride.user.fullname?.firstname}{" "}
                    {ride.user.fullname?.lastname}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainRideHistory;
