import { FaHome, FaTasks, FaUsers, FaRegCalendarAlt, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/" },
  { name: "Task Management", icon: <FaTasks />, path: "/tasks" },
  { name: "Employee Directory", icon: <FaUsers />, path: "/employees" },
  { name: "Calendar", icon: <FaRegCalendarAlt />, path: "/calendar" },
  { name: "KPI Tracking", icon: <FaChartBar />, path: "/kpi" },
];

export default function Sidebar() {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={`${collapsed ? "w-20" : "w-64"} h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-16 transition-all duration-300 z-20`}>
      <nav className="mt-4 px-3 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "bg-primary-light text-primary font-semibold shadow-xs"
                  : "text-gray-700 hover:bg-primary-light/40 hover:text-primary"
              } ${collapsed ? "justify-center px-2" : ""}`
            }
            title={collapsed ? item.name : ""}
          >
            <span className="text-lg shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6 flex flex-col gap-3">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100 active:scale-[0.98] whitespace-nowrap transition-all duration-200 cursor-pointer ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Logout" : ""}
        >
          <FaSignOutAlt className="text-base text-red-500 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}