import { FaBell, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";
import foto from "../assets/foto.jpg";
import { useSidebar } from "../context/SidebarContext";

export default function Header() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-700 hover:text-primary">
          <FaBars size={18} />
        </button>
        <img src={logo} alt="Assist.id" className="h-9 w-auto" />
      </div>

      <div className="flex items-center gap-2">
        <button className="relative text-gray-700">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <img src={foto} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="text-sm text-left">
            <p className="font-semibold text-gray-800 leading-none">Sari</p>
            <p className="text-gray-400 text-xs mt-1">HR</p>
          </div>
        </div>
      </div>
    </div>
  );
}