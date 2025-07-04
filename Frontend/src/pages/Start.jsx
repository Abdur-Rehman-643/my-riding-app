import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-gray-100 to-white p-6">
      {/* Top Heading */}
      <header className="text-center mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
          My Riding App
        </h1>
        <p className="text-gray-500 mt-2">Your journey starts here</p>
      </header>

      {/* Central Image */}
      <div className="w-full max-w-3xl px-4 mt-3">
        <img
          src="https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Ride Preview"
          className="w-full h-auto rounded-2xl shadow-xl object-cover"
        />
      </div>

      {/* Bottom Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mt-8 mb-5 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Get Started</h2>
        <p className="text-gray-500 mt-1">
          Continue to explore and book your ride
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block w-full bg-black hover:bg-gray-900 text-white text-lg py-3 rounded-lg font-medium transition duration-300"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
