import { useState } from "react";
import {
  FaDownload,
  FaFileExcel,
  FaFilePdf,
  FaAward,
  FaChartPie,
  FaUserTie,
  FaInfoCircle,
  FaCheckCircle,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import PageHeader from "../layouts/PageHeader";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

// Daftar 10+ Tab Bulan / Periode
const MONTH_TABS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Data Karyawan untuk Switcher HR
const EMPLOYEES = [
  { id: "EMP-001", name: "Sari Wulandari", role: "Frontend Developer" },
  { id: "EMP-002", name: "Musa Al-Kindi", role: "Backend Developer" },
  { id: "EMP-003", name: "Mitha Amalia", role: "UI/UX Designer" },
  { id: "EMP-004", name: "Dimas Pratama", role: "Quality Assurance" },
];

// Data 8 Indikator KPI Sesuai Tabel Excel Mentoring (PT. JAGA - 2026)
const KPI_METRICS = [
  {
    no: 1,
    category: "Financial Perspective",
    categoryBg: "bg-orange-100 text-orange-800 border-orange-200",
    objective: "Akuisisi dan live produk utama & add-ons sesuai target 2026",
    kpiName: "On Time Delivery (Based on Product Timeline)",
    description: "Untuk mengukur persentase seluruh fitur yang naik ke production tepat waktu sesuai timeline. Rumus: (Fitur naik tepat waktu / Total fitur terjadwal) * 100%.",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "< 80%", l2: "80%", l3: "≥ 90%", l4: "≥ 95%" },
    monthlyTarget: "90%",
    actual: "100%",
    atPercent: "111%",
    achievedLevel: 4,
  },
  {
    no: 2,
    category: "Financial Perspective",
    categoryBg: "bg-orange-100 text-orange-800 border-orange-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target 2026",
    kpiName: "SLA Ticket Bug",
    description: "Untuk mengukur persentase ticket bug di production yang diselesaikan sesuai SLA (berdasarkan severity). Rumus: (Ticket bug resolved within SLA / Total ticket bug) * 100%.",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "< 85%", l2: "85%", l3: "90%", l4: "≥ 95%" },
    monthlyTarget: "90%",
    actual: "100%",
    atPercent: "111%",
    achievedLevel: 4,
  },
  {
    no: 3,
    category: "Customer Perspective",
    categoryBg: "bg-rose-100 text-rose-800 border-rose-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target 2026",
    kpiName: "Production Bug Density – (New Product)",
    description: "Mengontrol kualitas produk baru supaya jumlah bug production per output tetap dalam batas sehat. Dihitung setiap bulan.",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "> 10", l2: "10", l3: "5", l4: "0" },
    monthlyTarget: "5 Bug",
    actual: "4 Bug",
    atPercent: "80%",
    achievedLevel: 4,
  },
  {
    no: 4,
    category: "Financial Perspective",
    categoryBg: "bg-orange-100 text-orange-800 border-orange-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target 2026",
    kpiName: "Continuous Improvement",
    description: "Improvement apa saja yang pernah dilakukan dalam 1 bulan untuk efisiensi sistem.",
    frequency: "Yearly",
    weight: 5,
    levels: { l1: "Annual: 0", l2: "Annual: 12", l3: "Annual: 24", l4: "Annual: 36" },
    monthlyTarget: "2 Item",
    actual: "1 Item",
    atPercent: "50%",
    achievedLevel: 3,
  },
  {
    no: 5,
    category: "Internal Business Process",
    categoryBg: "bg-amber-100 text-amber-800 border-amber-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target 2026",
    kpiName: "Tech Debt Completion",
    description: "Persentase penyelesaian prioritas tech debt dibanding rencana periode. Rumus: (Jumlah tech debt selesai / Target tech debt) * 100%. (0/0 dihitung 100%).",
    frequency: "Monthly",
    weight: 5,
    levels: { l1: "< 40%", l2: "40%", l3: "60%", l4: "≥ 80%" },
    monthlyTarget: "60%",
    actual: "70%",
    atPercent: "117%",
    achievedLevel: 4,
  },
  {
    no: 6,
    category: "Customer Perspective",
    categoryBg: "bg-rose-100 text-rose-800 border-rose-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target 2026",
    kpiName: "Task Completion Rate",
    description: "Mengukur rata-rata waktu penyelesaian task per bulan. Cara ukur: jalankan Track Time di ClickUp. Target waktu < 48 Jam.",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "> 64 Jam", l2: "64 Jam", l3: "48 Jam", l4: "< 48 Jam" },
    monthlyTarget: "48 Jam",
    actual: "14 Jam",
    atPercent: "29%",
    achievedLevel: 4,
  },
  {
    no: 7,
    category: "Customer Perspective",
    categoryBg: "bg-rose-100 text-rose-800 border-rose-200",
    objective: "Target Tech 2026 – Modernisasi & Pengurangan Tech Debt",
    kpiName: "Task Backward Rate",
    description: "Mengukur seberapa banyak task yang kembali ke Dev dari QA karena bug. Rumus: (Total task kembali dari QA / Total task) * 100%.",
    frequency: "Yearly",
    weight: 15,
    levels: { l1: "> 50%", l2: "50%", l3: "30%", l4: "< 20%" },
    monthlyTarget: "30%",
    actual: "25%",
    atPercent: "83%",
    achievedLevel: 4,
  },
  {
    no: 8,
    category: "Innovation & Growth",
    categoryBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target 2026",
    kpiName: "Sprint Point (SP)",
    description: "Total Sprint Point yang berhasil diselesaikan oleh individu dalam kapasitas role-nya (tercatat di ClickUp).",
    frequency: "Yearly",
    weight: 15,
    levels: { l1: "< 672 SP", l2: "672 SP", l3: "1056 SP", l4: "> 1440 SP" },
    monthlyTarget: "88 SP",
    actual: "98 SP",
    atPercent: "111.4%",
    achievedLevel: 4,
  },
];

export default function KpiTracking() {
  const { collapsed } = useSidebar();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Januari");
  const [selectedEmp, setSelectedEmp] = useState("EMP-001");
  const [exportNotification, setExportNotification] = useState(false);

  const isHR = currentUser?.role === "HR";
  const currentEmployee = isHR
    ? EMPLOYEES.find((e) => e.id === selectedEmp) || EMPLOYEES[0]
    : { id: "EMP-001", name: currentUser?.name || "Sari Wulandari", role: "Frontend Developer" };

  // Hitung Skor Rata-rata & Level Dominan
  const totalWeight = KPI_METRICS.reduce((acc, curr) => acc + curr.weight, 0);
  const avgLevel = (
    KPI_METRICS.reduce((acc, curr) => acc + curr.achievedLevel, 0) / KPI_METRICS.length
  ).toFixed(1);

  // Simulasi Export Laporan KPI (Khusus HR)
  const handleExport = (format) => {
    setExportNotification(`Laporan KPI (${format}) untuk ${currentEmployee.name} periode ${activeTab} 2026 berhasil di-export!`);
    setTimeout(() => setExportNotification(false), 4000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Sidebar />

      <main className={`${collapsed ? "ml-20" : "ml-64"} pt-16 p-8 transition-all duration-300`}>
        {/* Page Header */}
        <PageHeader
          title="KPI Tracking & Performance Evaluation"
          subtitle="Tabel evaluasi capaian Key Performance Indicator tahun 2026 • PT. JAGA"
        >
          {/* Tombol Export Laporan (Khusus HR) */}
          {isHR && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport("Excel (.xlsx)")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <FaFileExcel /> Export Excel
              </button>
              <button
                onClick={() => handleExport("PDF (.pdf)")}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <FaFilePdf /> Export PDF
              </button>
            </div>
          )}
        </PageHeader>

        {/* Notifikasi Pop-up Berhasil Export */}
        {exportNotification && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <FaCheckCircle className="text-emerald-500 text-base shrink-0" />
              <span>{exportNotification}</span>
            </div>
            <button onClick={() => setExportNotification(false)} className="text-emerald-600 hover:text-emerald-900">
              Tutup
            </button>
          </div>
        )}

        {/* Info Top Banner & Karyawan Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base">Evaluasi Kinerja: {currentEmployee.name}</h3>
                <span className="text-xs bg-primary-light text-primary px-2.5 py-0.5 rounded-full font-semibold">
                  {currentEmployee.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Tahun: <b>2026</b> • PT: <b>PT. JAGA</b> • Periode: <b>{activeTab}</b></p>
            </div>
          </div>

          {/* Switcher Karyawan (Khusus HR bisa pilih semua karyawan) */}
          {isHR ? (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
              <FaUserTie className="text-gray-400 text-sm ml-1" />
              <span className="text-xs font-semibold text-gray-600">Pilih Karyawan (Mode HR):</span>
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer shadow-2xs"
              >
                {EMPLOYEES.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs bg-blue-50 text-primary border border-blue-100 px-3.5 py-2 rounded-xl font-medium">
              Mode Karyawan: Menampilkan Data KPI Pribadi Anda
            </div>
          )}
        </div>

        {/* Quick KPI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg font-bold">
              🏆
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Rata-rata Capaian</p>
              <p className="text-lg font-extrabold text-gray-800">Level {avgLevel}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-lg font-bold">
              ⚡
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Total Bobot Metrik</p>
              <p className="text-lg font-extrabold text-gray-800">{totalWeight}% (Lengkap)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
              🎯
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Target Level 4 Tercapai</p>
              <p className="text-lg font-extrabold text-green-600">7 dari 8 Metrik</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
              📈
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Sprint Point Terkumpul</p>
              <p className="text-lg font-extrabold text-accent">98 SP / 88 SP</p>
            </div>
          </div>
        </div>

        {/* 10+ TAB BULAN EVALUASI */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {MONTH_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TABEL UTAMA EVALUASI KPI (SESUAI GAMBAR EXCEL MENTOR) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {/* Baris 1 Header Excel */}
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold">
                  <th rowSpan="2" className="p-3 border-r border-gray-200 text-center w-10">No</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 w-36">Category</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 w-44">Strategy Objective</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 w-44">KPI Name</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 min-w-[220px]">KPI Description & Rumus</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 text-center w-24">Target Annual</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 text-center bg-blue-100 text-blue-900 w-16">Bobot</th>
                  {/* Header Level Description Ungu Gelap seperti di Excel */}
                  <th colSpan="4" className="p-2.5 text-center bg-[#581845] text-white font-bold border-r border-gray-200">
                    Level Description
                  </th>
                  {/* Header Nilai Aktual Hijau seperti di Excel */}
                  <th colSpan="4" className="p-2.5 text-center bg-[#4E9F3D] text-white font-bold">
                    Pencapaian Bulan {activeTab}
                  </th>
                </tr>

                {/* Baris 2 Header Sub-Kolom Level & Nilai */}
                <tr className="border-b border-gray-200 text-[11px]">
                  {/* Sub-Header Level 1 - 4 */}
                  <th className="p-2 text-center bg-[#7B241C]/90 text-white border-r border-white/20 w-24">Level 1</th>
                  <th className="p-2 text-center bg-[#7B241C]/80 text-white border-r border-white/20 w-24">Level 2</th>
                  <th className="p-2 text-center bg-[#7B241C]/70 text-white border-r border-white/20 w-24">Level 3</th>
                  <th className="p-2 text-center bg-[#7B241C]/60 text-white border-r border-gray-300 w-24">Level 4</th>

                  {/* Sub-Header Target, Actual, A/T, Level Capaian */}
                  <th className="p-2 text-center bg-[#D8E9A8] text-gray-800 border-r border-gray-200 w-24">Monthly Target</th>
                  <th className="p-2 text-center bg-[#D8E9A8] text-gray-800 border-r border-gray-200 w-20">Actual</th>
                  <th className="p-2 text-center bg-[#D8E9A8] text-gray-800 border-r border-gray-200 w-20">A/T (%)</th>
                  <th className="p-2 text-center bg-[#D8E9A8] text-gray-800 font-bold w-20">Achieved Level</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-800 text-[11px]">
                {KPI_METRICS.map((kpi) => (
                  <tr key={kpi.no} className="hover:bg-blue-50/30 transition-colors">
                    {/* No */}
                    <td className="p-3 border-r border-gray-200 text-center font-bold text-gray-500">
                      {kpi.no}
                    </td>

                    {/* Category Badge */}
                    <td className="p-3 border-r border-gray-200">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${kpi.categoryBg}`}>
                        {kpi.category}
                      </span>
                    </td>

                    {/* Strategy Objective */}
                    <td className="p-3 border-r border-gray-200 font-medium text-gray-700">
                      {kpi.objective}
                    </td>

                    {/* KPI Name */}
                    <td className="p-3 border-r border-gray-200 font-bold text-gray-900">
                      {kpi.kpiName}
                    </td>

                    {/* Description */}
                    <td className="p-3 border-r border-gray-200 text-gray-600 leading-relaxed text-[10px]">
                      {kpi.description}
                    </td>

                    {/* Frequency */}
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600 font-medium">
                      {kpi.frequency}
                    </td>

                    {/* Bobot */}
                    <td className="p-3 border-r border-gray-200 text-center font-bold text-blue-800 bg-blue-50/50">
                      {kpi.weight}.0%
                    </td>

                    {/* Level Description 1 - 4 */}
                    <td className="p-2 border-r border-gray-200 text-center text-gray-500 bg-gray-50/40">
                      {kpi.levels.l1}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center text-gray-600 bg-gray-50/40">
                      {kpi.levels.l2}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center text-gray-700 bg-gray-50/40 font-medium">
                      {kpi.levels.l3}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center text-emerald-700 bg-emerald-50/30 font-bold">
                      {kpi.levels.l4}
                    </td>

                    {/* Target & Actual */}
                    <td className="p-2.5 border-r border-gray-200 text-center font-semibold text-gray-700">
                      {kpi.monthlyTarget}
                    </td>
                    <td className="p-2.5 border-r border-gray-200 text-center font-bold text-gray-900">
                      {kpi.actual}
                    </td>
                    <td className="p-2.5 border-r border-gray-200 text-center font-semibold text-primary">
                      {kpi.atPercent}
                    </td>

                    {/* Capaian Level Badge */}
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold text-xs shadow-2xs ${
                          kpi.achievedLevel === 4
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : kpi.achievedLevel === 3
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-amber-100 text-amber-700 border border-amber-300"
                        }`}
                      >
                        Level {kpi.achievedLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Total Summary Footer */}
              <tfoot>
                <tr className="bg-gray-100/90 font-bold text-gray-900 border-t-2 border-gray-300 text-xs">
                  <td colSpan="6" className="p-3 text-right uppercase tracking-wider">
                    TOTAL BOBOT KPI:
                  </td>
                  <td className="p-3 text-center text-blue-900 bg-blue-100">
                    {totalWeight}%
                  </td>
                  <td colSpan="4" className="p-3 text-center text-gray-500 text-[11px]">
                    Kriteria Level 1 - 4 Terstandarisasi
                  </td>
                  <td colSpan="3" className="p-3 text-right">
                    Rata-rata Capaian Tim:
                  </td>
                  <td className="p-3 text-center bg-green-100 text-green-800 text-sm">
                    Level 4
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
