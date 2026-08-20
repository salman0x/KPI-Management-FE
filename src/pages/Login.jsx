import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Login() {
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 md:p-10">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Assist.id" className="h-10 w-auto object-contain" />
        </div>
        <p className="text-gray-500 text-sm text-center mb-6">Welcome back. Please log in to your account.</p>

        {/* Role toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setRole("employee")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              role === "employee" ? "bg-primary text-white" : "text-gray-500"
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setRole("hr")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              role === "hr" ? "bg-primary text-white" : "text-gray-500"
            }`}
          >
            HR Admin
          </button>
        </div>

        {/* Email */}
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>

        {/* Password */}
        <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
        <div className="relative mb-3">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" />
            Remember me
          </label>
          <a href="#" className="text-primary font-medium hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit button */}
        <button className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity">
          Login to Assist.id
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Need help?{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            Contact IT Support
          </a>
        </p>
      </div>
    </div>
  );
}