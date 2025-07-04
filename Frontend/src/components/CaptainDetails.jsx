import { useContext } from "react";
import { CaptainDataContext } from "../context/CapatainContext";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-4 bg-white shadow-lg rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Captain Info */}
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover ring-1 ring-blue-400"
            src="https://img.pikbest.com/origin/09/23/49/644pIkbEsTpXF.png!sw800"
            alt="Captain"
          />
          <div>
            <h4 className="text-base font-semibold text-gray-800">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className="text-xs text-gray-500">Captain</p>
          </div>
        </div>

        {/* Earnings */}
        <div className="text-right">
          <h4 className="text-lg font-bold text-green-600">Rs. 295.20</h4>
          <p className="text-xs text-gray-500">Earnings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center bg-blue-50 p-3 rounded-lg shadow-sm">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <i className="ri-timer-2-line text-lg text-blue-500 mb-1"></i>
          <h5 className="text-sm font-medium text-gray-800">10.2</h5>
          <p className="text-xs text-gray-500">Hours</p>
        </div>

        {/* Speed */}
        <div className="flex flex-col items-center">
          <i className="ri-speed-up-line text-lg text-yellow-500 mb-1"></i>
          <h5 className="text-sm font-medium text-gray-800">18.5</h5>
          <p className="text-xs text-gray-500">km/h</p>
        </div>

        {/* Rides */}
        <div className="flex flex-col items-center">
          <i className="ri-booklet-line text-lg text-green-600 mb-1"></i>
          <h5 className="text-sm font-medium text-gray-800">24</h5>
          <p className="text-xs text-gray-500">Rides</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
