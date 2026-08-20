import { useState } from "react";
import {
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaThLarge,
  FaListUl,
  FaExclamationTriangle,
  FaBug,
  FaCode,
  FaTools,
  FaRedoAlt,
  FaUserCircle,
} from "react-icons/fa";

import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import PageHeader from "../layouts/PageHeader";
import { useSidebar } from "../context/SidebarContext";

// Status alur kerja ala ClickUp
const STATUSES = [
  { id: "Backlog", label: "Backlog", color: "bg-gray-100 text-gray-700 border-gray-300", dot: "bg-gray-400" },
  { id: "Ready", label: "Ready", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500" },
  { id: "On Progress", label: "On Progress", color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  { id: "Code Review", label: "Code Review", color: "bg-purple-50 text-purple-600 border-purple-200", dot: "bg-purple-500" },
  { id: "QA", label: "QA (Quality Assurance)", color: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-500" },
  { id: "Done", label: "Done", color: "bg-green-50 text-green-600 border-green-200", dot: "bg-green-500" },
];

const INITIAL_TASKS = [
  {
    id: "TSK-101",
    title: "Implementasi Integrasi Autentikasi Google OAuth",
    description: "Membuat alur login Google menggunakan client id dan handle redirect token ke dashboard.",
    category: "Feature",
    assignee: "Sari",
    start: "18 Agu 2026",
    deadline: "22 Agu 2026",
    sla: "48 Jam",
    status: "On Progress",
    point: 85, // Diisi oleh PO
    backwardCount: 0,
  },
  {
    id: "TSK-102",
    title: "Perbaikan Bug Notifikasi Pembayaran dari CH",
    description: "Tiket kendala CH: Notifikasi invoice gagal terkirim ke WhatsApp user.",
    category: "Bug Ticket",
    assignee: "Musa",
    start: "19 Agu 2026",
    deadline: "20 Agu 2026",
    sla: "24 Jam",
    status: "QA",
    point: 12,
    backwardCount: 1,
  },
  {
    id: "TSK-103",
    title: "Refactor Database Query & Clean Legacy Code",
    description: "Pembersihan hutang teknis modul rekam medis lama sesuai backlog tech debt.",
    category: "Tech Debt",
    assignee: "Sari",
    start: "15 Agu 2026",
    deadline: "25 Agu 2026",
    sla: "72 Jam",
    status: "Code Review",
    point: null, // Belum dinilai PO
    backwardCount: 0,
  },
  {
    id: "TSK-104",
    title: "Desain dan Implementasi Tab Evaluasi KPI Bulanan",
    description: "Membuat tabel matriks KPI level 1-4 untuk tim development.",
    category: "Feature",
    assignee: "Sari",
    start: "20 Agu 2026",
    deadline: "24 Agu 2026",
    sla: "48 Jam",
    status: "Ready",
    point: null,
    backwardCount: 0,
  },
  {
    id: "TSK-105",
    title: "Testing Stress Load & Penyesuaian Response Time API",
    description: "Optimalisasi performa endpoint API saat jam sibuk klinik.",
    category: "Improvement",
    assignee: "Musa",
    start: "10 Agu 2026",
    deadline: "14 Agu 2026",
    sla: "48 Jam",
    status: "Done",
    point: 90,
    backwardCount: 0,
  },
];

const CATEGORY_BADGES = {
  Feature: { label: "Feature", bg: "bg-blue-50 text-blue-600 border-blue-200", icon: <FaCode size={11} /> },
  "Bug Ticket": { label: "Ticket Bug (CH)", bg: "bg-red-50 text-red-600 border-red-200", icon: <FaBug size={11} /> },
  "Tech Debt": { label: "Tech Debt", bg: "bg-orange-50 text-orange-600 border-orange-200", icon: <FaTools size={11} /> },
  Improvement: { label: "Improvement", bg: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: <FaTools size={11} /> },
};

export default function Tasks() {
  const { collapsed } = useSidebar();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "list"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form Tambah Task (Sebagai Karyawan - TIDAK ADA input Point)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "Feature",
    assignee: "Sari",
    start: "",
    deadline: "",
    sla: "48 Jam",
    status: "Backlog",
  });

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    return selectedCategory === "All" || task.category === selectedCategory;
  });

  // Handle Tambah Task Baru oleh Karyawan
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const created = {
      ...newTask,
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      start: newTask.start || new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      deadline: newTask.deadline || "TBD",
      point: null, // Poin belum diisi karena diisi oleh PO / HR
      backwardCount: 0,
    };

    setTasks([created, ...tasks]);
    setIsModalOpen(false);
    setNewTask({
      title: "",
      description: "",
      category: "Feature",
      assignee: "Sari",
      start: "",
      deadline: "",
      sla: "48 Jam",
      status: "Backlog",
    });
  };

  // Ubah Status Task
  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Aksi Khusus QA: Kembalikan ke Dev karena Bug (Task Backward)
  const handleRejectQA = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "On Progress",
              backwardCount: (t.backwardCount || 0) + 1,
            }
          : t
      )
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Sidebar />

      <main className={`${collapsed ? "ml-20" : "ml-64"} pt-16 p-8 transition-all duration-300`}>
        {/* Page Header */}
        <PageHeader title="Task Management" subtitle="Kelola dan pantau alur tugas sprint harian tim pengembang">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <FaPlus size={12} /> Tambah Task Baru
          </button>
        </PageHeader>

        {/* Toolbar & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Filter Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Filter Kategori:</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 transition-colors">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                <option value="All">Semua Kategori</option>
                <option value="Feature">Feature (Fitur)</option>
                <option value="Bug Ticket">Ticket Bug (CH)</option>
                <option value="Tech Debt">Tech Debt</option>
                <option value="Improvement">Continuous Improvement</option>
              </select>
            </div>
          </div>

          {/* Switch View Mode: Kanban vs List */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "kanban" ? "bg-white text-primary shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaThLarge size={12} /> Board Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list" ? "bg-white text-primary shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaListUl size={12} /> List View
            </button>
          </div>
        </div>

        {/* View Mode: KANBAN BOARD */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
            {STATUSES.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="bg-gray-100/70 rounded-2xl p-3.5 border border-gray-200/70 flex flex-col min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                      <h3 className="text-xs font-bold text-gray-800">{col.label}</h3>
                    </div>
                    <span className="text-[11px] font-semibold bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task Cards in Column */}
                  <div className="flex flex-col gap-3 flex-1">
                    {colTasks.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400 my-auto">
                        Tidak ada task
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-2.5"
                        >
                          {/* Top: Category & Point */}
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                CATEGORY_BADGES[task.category]?.bg || "bg-gray-50 text-gray-600"
                              }`}
                            >
                              {CATEGORY_BADGES[task.category]?.icon}
                              {task.category}
                            </span>

                            {/* Point Indicator (Diisi oleh PO) */}
                            {task.point !== null ? (
                              <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded-full border border-accent/20">
                                {task.point} SP
                              </span>
                            ) : (
                              <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200" title="Poin akan dinilai oleh Product Owner">
                                Menunggu PO
                              </span>
                            )}
                          </div>

                          {/* Title & Description */}
                          <div>
                            <span className="text-[10px] text-gray-400 font-mono block">{task.id}</span>
                            <h4 className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 mt-0.5">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{task.description}</p>
                            )}
                          </div>

                          {/* Backward Warning (Jika pernah di-reject QA) */}
                          {task.backwardCount > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                              <FaRedoAlt size={9} />
                              <span>Di-reject QA: <b>{task.backwardCount}x</b></span>
                            </div>
                          )}

                          {/* Meta: Assignee, Deadline & SLA */}
                          <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500">
                            <div className="flex items-center gap-1 font-medium text-gray-700">
                              <FaUserCircle className="text-primary" />
                              <span>{task.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <FaCalendarAlt size={9} />
                              <span>{task.deadline}</span>
                            </div>
                          </div>

                          {/* Status Actions */}
                          <div className="pt-1 flex flex-col gap-1.5">
                            {/* Pilihan Pindah Status */}
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="w-full text-[11px] bg-gray-50 border border-gray-200 rounded-lg p-1 text-gray-600 focus:outline-none cursor-pointer"
                            >
                              {STATUSES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  ➔ Pindah ke {s.label}
                                </option>
                              ))}
                            </select>

                            {/* Tombol Aksi Khusus jika berada di QA */}
                            {task.status === "QA" && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleRejectQA(task.id)}
                                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 p-1 rounded-lg border border-red-200 cursor-pointer"
                                  title="Kembalikan task ke Developer karena ada temuan bug"
                                >
                                  <FaExclamationTriangle size={9} /> Reject Bug
                                </button>
                                <button
                                  onClick={() => handleStatusChange(task.id, "Done")}
                                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold bg-green-50 text-green-600 hover:bg-green-100 p-1 rounded-lg border border-green-200 cursor-pointer"
                                >
                                  <FaCheckCircle size={9} /> Lolos Done
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode: LIST VIEW */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                <tr>
                  <th className="p-4">ID & Judul Task</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">SLA / Deadline</th>
                  <th className="p-4">Point (PO)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <span className="text-[10px] text-gray-400 font-mono block">{task.id}</span>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{task.title}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">{task.description}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                          CATEGORY_BADGES[task.category]?.bg || "bg-gray-50"
                        }`}
                      >
                        {CATEGORY_BADGES[task.category]?.icon}
                        {task.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800 flex items-center gap-1.5 mt-2">
                      <FaUserCircle className="text-primary text-base" /> {task.assignee}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-700">{task.deadline}</p>
                      <span className="text-[10px] text-gray-400">Target SLA: {task.sla}</span>
                    </td>
                    <td className="p-4">
                      {task.point !== null ? (
                        <span className="font-bold text-accent bg-accent-light px-2.5 py-1 rounded-full text-xs border border-accent/20">
                          {task.point} SP
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Pending PO</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                          STATUSES.find((s) => s.id === task.status)?.color
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-700 cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL: Tambah Task Baru (Karyawan - Tanpa Input Point) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Tambah Task Baru</h3>
                  <p className="text-xs text-gray-400">Buat tugas baru untuk tim pengembang</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="mt-4 flex flex-col gap-4">
                {/* Judul Task */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Judul Task <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Integrasi API Payment Gateway"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi & Catatan</label>
                  <textarea
                    rows="3"
                    placeholder="Tuliskan rincian pengerjaan atau kendala tiket..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                  ></textarea>
                </div>

                {/* Kategori & Assignee */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori Task</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer"
                    >
                      <option value="Feature">Feature (Fitur Utama)</option>
                      <option value="Bug Ticket">Ticket Bug (Dari CH)</option>
                      <option value="Tech Debt">Tech Debt (Hutang Teknis)</option>
                      <option value="Improvement">Continuous Improvement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Assignee</label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer"
                    >
                      <option value="Sari">Sari (Frontend)</option>
                      <option value="Musa">Musa (Backend)</option>
                      <option value="Mitha">Mitha (UI/UX)</option>
                    </select>
                  </div>
                </div>

                {/* Tanggal & SLA */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Deadline</label>
                    <input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target SLA</label>
                    <select
                      value={newTask.sla}
                      onChange={(e) => setNewTask({ ...newTask, sla: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer"
                    >
                      <option value="24 Jam">24 Jam (Bug Urgent)</option>
                      <option value="48 Jam">48 Jam (Normal SLA)</option>
                      <option value="72 Jam">72 Jam</option>
                      <option value="1 Minggu">1 Minggu (Feature)</option>
                    </select>
                  </div>
                </div>

                {/* Info Catatan tentang Poin */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-700 flex items-start gap-2">
                  <span className="text-base leading-none">💡</span>
                  <span>
                    <b>Pemberian Poin (Story Points):</b> Poin untuk task ini akan dinilai dan ditentukan langsung oleh <b>Product Owner (PO) / HR</b> setelah task dibuat.
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-white shadow-sm cursor-pointer"
                  >
                    Simpan Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
