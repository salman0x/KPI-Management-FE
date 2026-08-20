import { FaBell, FaBars, FaSearch } from "react-icons/fa";
import logo from "../assets/logo.png";
import foto from "../assets/foto.jpg";
import { useSidebar } from "../context/SidebarContext";

export default function Header() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-20">
      {/* Sisi Kiri: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-700 hover:text-primary cursor-pointer">
          <FaBars size={18} />
        </button>
        <img src={logo} alt="Assist.id" className="h-9 w-auto" />
      </div>

      {/* Sisi Kanan: Pencarian, Notifikasi, & Profil */}
      <div className="flex items-center gap-4">
        <div className="relative w-72 hidden md:block">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light transition-all"
          />
        </div>

        <button className="relative text-gray-600 hover:text-primary cursor-pointer p-2 rounded-full hover:bg-gray-50 transition-colors">
          <FaBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <img src={foto} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10" />
          <div className="text-sm text-left">
            <p className="font-semibold text-gray-800 leading-none">Sari</p>
            <p className="text-gray-400 text-xs mt-1">Karyawan</p>
          </div>
        </div>
      </div>
    </div>
  );
}