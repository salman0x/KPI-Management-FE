import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";
import foto from "../assets/foto.jpg";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { collapsed, setCollapsed } = useSidebar();
  const { currentUser } = useAuth();

  const userName = currentUser?.name || "Sari";
  const userRole = currentUser?.role || "Karyawan";

  return (
    <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-20">
      {/* Sisi Kiri: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-700 hover:text-primary cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
          title="Toggle Sidebar"
        >
          <FaBars size={18} />
        </button>
        <img src={logo} alt="Assist.id" className="h-9 w-auto object-contain" />
      </div>

      {/* Sisi Kanan: Profil Pengguna Saja */}
      <div className="flex items-center gap-3">
        <img
          src={foto}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
        />
        <div className="text-sm text-left">
          <p className="font-semibold text-gray-800 leading-none">{userName}</p>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-1 rounded-full ${
              userRole?.toUpperCase() === "HR"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-primary"
            }`}
          >
            {userRole}
          </span>
        </div>
      </div>
    </div>
  );
}