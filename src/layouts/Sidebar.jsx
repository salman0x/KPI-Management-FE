import { FaHome, FaTasks, FaUsers, FaRegCalendarAlt, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/" },
  { name: "Tasks", icon: <FaTasks />, path: "/tasks" },
  { name: "Employees", icon: <FaUsers />, path: "/employees" },
  { name: "Calendar", icon: <FaRegCalendarAlt />, path: "/calendar" },
  { name: "Reports", icon: <FaChartBar />, path: "/reports" },
  { name: "Settings", icon: <FaCog />, path: "/settings" },
];

export default function Sidebar() {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={`${collapsed ? "w-20" : "w-45"} h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-16 transition-all duration-300`}>
      <nav className="mt-4 px-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-primary-light text-primary" : "text-gray-700 hover:bg-gray-50"
              } ${collapsed ? "justify-center px-2" : ""}`
            }
            title={collapsed ? item.name : ""}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 flex flex-col gap-3">
        <a href="#" className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl ${collapsed ? "justify-center px-2" : ""}`}>
          <FaQuestionCircle className="text-xl" />
          {!collapsed && "Help Center"}
        </a>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer ${collapsed ? "justify-center px-2" : ""
            }`}
          title={collapsed ? "Logout" : ""}
        >
          <FaSignOutAlt className="text-sm" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}