import {
  FaClipboardList,
  FaFolderOpen,
  FaCheckCircle,
  FaRegClock,
  FaShieldAlt,
  FaCheck,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import PageHeader from "../layouts/PageHeader";
import { useSidebar } from "../context/SidebarContext";

const statCards = [
  { title: "Total Task", value: 12, sub: "All Task", icon: <FaClipboardList />, bg: "bg-accent-light", color: "text-accent" },
  { title: "Backlog", value: 2, sub: "Tasks", icon: <FaFolderOpen />, bg: "bg-orange-50", color: "text-orange-500" },
  { title: "Ready", value: 1, sub: "Tasks", icon: <FaCheckCircle />, bg: "bg-green-50", color: "text-green-500" },
  { title: "On Progress", value: 4, sub: "Tasks", icon: <FaRegClock />, bg: "bg-accent-light", color: "text-accent" },
  { title: "QA", value: 2, sub: "Tasks", icon: <FaShieldAlt />, bg: "bg-purple-50", color: "text-purple-500" },
  { title: "Done", value: 3, sub: "Tasks", icon: <FaCheck />, bg: "bg-green-50", color: "text-green-500" },
];

const tasks = [
  { title: "Development", point: 85, start: "06 Agustus 2026", deadline: "10 Agustus 2026", status: "On Progress", statusColor: "bg-primary-light text-primary" },
  { title: "UI UX Design", point: 90, start: "06 Agustus 2026", deadline: "10 Agustus 2026", status: "Done", statusColor: "bg-green-100 text-green-600" },
  { title: "Development", point: 85, start: "06 Agustus 2026", deadline: "10 Agustus 2026", status: "Code Review", statusColor: "bg-white border border-warning text-warning" },
];

export default function Dashboard() {
  const { collapsed } = useSidebar();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Sidebar />

      <div className={`${collapsed ? "ml-20" : "ml-64"} pt-16 p-8 transition-all duration-300`}>
        <PageHeader title="Dashboard" subtitle="Welcome back, Sari!" />

        <div className="grid grid-cols-4 gap-4">
          {/* Stat cards */}
          <div className="col-span-3 grid grid-cols-3 gap-4">
            {statCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-xs text-gray-400">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Point card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Total Point</h3>
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs text-gray-400">Start Date</label>
                <div className="border rounded-lg px-3 py-2 text-sm text-gray-600 mt-1">09 March 2026</div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400">End Date</label>
                <div className="border rounded-lg px-3 py-2 text-sm text-gray-600 mt-1">29 March 2026</div>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Total Point</p>
            <span className="inline-block bg-accent-light text-accent text-sm font-semibold px-3 py-1 rounded-full">
              75 Point
            </span>
          </div>
        </div>

        {/* Task list */}
        <div className="mt-6 flex flex-col gap-4">
          {tasks.map((task, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-accent-light flex items-center justify-center text-accent">
                  💻
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <span className="text-xs border border-accent text-accent px-2 py-0.5 rounded-full">{task.point} Point</span>
                  </div>
                  <p className="text-xs text-gray-400">Assign Karyawan</p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-gray-400 text-xs">Start Date</p>
                <p className="text-gray-700">{task.start}</p>
              </div>

              <div className="text-sm">
                <p className="text-gray-400 text-xs">Deadline</p>
                <p className="text-gray-700">{task.deadline}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Status Tugas</p>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${task.statusColor}`}>{task.status}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-sm border rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">
                  <FaEdit size={12} /> Edit
                </button>
                <button className="flex items-center gap-1 text-sm border border-red-200 rounded-lg px-3 py-1.5 text-red-500 hover:bg-red-50">
                  <FaTrashAlt size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}