import { useState } from "react";
import {
  FaHome,
  FaTasks,
  FaUsers,
  FaRegCalendarAlt,
  FaChartBar,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

const KPI_SUBMENU = [
  { id: "kpi-1", name: "On Time Delivery", no: 1 },
  { id: "kpi-2", name: "SLA Ticket Bug", no: 2 },
  { id: "kpi-3", name: "Production Bug Density", no: 3 },
  { id: "kpi-4", name: "Continuous Improvement", no: 4 },
  { id: "kpi-5", name: "Tech Debt Completion", no: 5 },
  { id: "kpi-6", name: "Task Completion Rate", no: 6 },
  { id: "kpi-7", name: "Task Backward Rate", no: 7 },
  { id: "kpi-8", name: "Sprint Point (SP)", no: 8 },
];

export default function Sidebar() {
  const { collapsed } = useSidebar();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isKpiActive = location.pathname.startsWith("/kpi");
  const [kpiExpanded, setKpiExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToKpi = (kpiId) => {
    if (!isKpiActive) {
      navigate(`/kpi#${kpiId}`);
    } else {
      const element = document.getElementById(kpiId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("bg-blue-100/70");
        setTimeout(() => element.classList.remove("bg-blue-100/70"), 1500);
      }
    }
  };

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-16 transition-all duration-300 z-20 overflow-y-auto`}
    >
      <nav className="mt-4 px-3 flex flex-col gap-1">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
              isActive
                ? "bg-primary-light text-primary font-semibold shadow-xs"
                : "text-gray-700 hover:bg-primary-light/40 hover:text-primary"
            } ${collapsed ? "justify-center px-2" : ""}`
          }
          title={collapsed ? "Dashboard" : ""}
        >
          <span className="text-lg shrink-0"><FaHome /></span>
          {!collapsed && <span className="truncate">Dashboard</span>}
        </NavLink>

        {/* Task Management */}
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
              isActive
                ? "bg-primary-light text-primary font-semibold shadow-xs"
                : "text-gray-700 hover:bg-primary-light/40 hover:text-primary"
            } ${collapsed ? "justify-center px-2" : ""}`
          }
          title={collapsed ? "Task Management" : ""}
        >
          <span className="text-lg shrink-0"><FaTasks /></span>
          {!collapsed && <span className="truncate">Task Management</span>}
        </NavLink>

        {/* Employee Directory */}
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
              isActive
                ? "bg-primary-light text-primary font-semibold shadow-xs"
                : "text-gray-700 hover:bg-primary-light/40 hover:text-primary"
            } ${collapsed ? "justify-center px-2" : ""}`
          }
          title={collapsed ? "Employee Directory" : ""}
        >
          <span className="text-lg shrink-0"><FaUsers /></span>
          {!collapsed && <span className="truncate">Employee Directory</span>}
        </NavLink>

        {/* Calendar */}
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
              isActive
                ? "bg-primary-light text-primary font-semibold shadow-xs"
                : "text-gray-700 hover:bg-primary-light/40 hover:text-primary"
            } ${collapsed ? "justify-center px-2" : ""}`
          }
          title={collapsed ? "Calendar" : ""}
        >
          <span className="text-lg shrink-0"><FaRegCalendarAlt /></span>
          {!collapsed && <span className="truncate">Calendar</span>}
        </NavLink>

        {/* KPI Tracking (dengan Submenu List 8 KPI Name) */}
        <div>
          <div
            onClick={() => {
              if (!isKpiActive) navigate("/kpi");
              setKpiExpanded(!kpiExpanded);
            }}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isKpiActive
                ? "bg-primary-light text-primary font-semibold shadow-xs"
                : "text-gray-700 hover:bg-primary-light/40 hover:text-primary"
            } ${collapsed ? "justify-center px-2" : ""}`}
            title={collapsed ? "KPI Tracking" : ""}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg shrink-0"><FaChartBar /></span>
              {!collapsed && <span className="truncate">KPI Tracking</span>}
            </div>
            {!collapsed && (
              <span className="text-xs text-gray-400">
                {kpiExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
              </span>
            )}
          </div>

          {/* Submenu List 8 KPI Names */}
          {!collapsed && kpiExpanded && (
            <div className="ml-4 pl-3.5 my-1.5 border-l-2 border-primary/20 flex flex-col gap-1">
              {KPI_SUBMENU.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => scrollToKpi(sub.id)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 hover:bg-primary-light/60 hover:text-primary transition-all text-left group cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0 transition-colors">
                    {sub.no}
                  </span>
                  <span className="truncate">{sub.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="px-3 pb-6 pt-4 flex flex-col gap-3 border-t border-gray-100 bg-white">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100 active:scale-[0.98] whitespace-nowrap transition-all duration-200 cursor-pointer ${
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