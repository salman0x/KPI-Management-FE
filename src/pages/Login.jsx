import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // 1. Login via Google OAuth (Khusus Semua Karyawan)
  const handleGoogleLogin = (credentialResponse) => {
    console.log("Login Google Karyawan berhasil:", credentialResponse);
    login({
      name: "Sari Wulandari",
      role: "Karyawan",
      email: "sari.dev@gmail.com",
      loginMethod: "google",
    });
    navigate("/");
  };

  // 2. Login via Form Email & Password (Khusus Akun Database / HR)
  const handleFormLogin = (e) => {
    e.preventDefault();
    login({
      name: "Admin HR",
      role: "HR",
      email: email || "hr.admin@assist.id",
      loginMethod: "email",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Assist.id" className="h-10 w-auto object-contain" />
        </div>

        {/* Form Login (Khusus Akun Email & Password / HR) */}
        <form onSubmit={handleFormLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-800 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-800">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full mt-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer text-sm"
          >
            Login
          </button>
        </form>

        {/* Divider OR */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-semibold text-gray-400 tracking-wider">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login (Untuk Karyawan) */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Google gagal")}
            theme="outline"
            size="large"
            width="320"
            text="continue_with"
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  );
}