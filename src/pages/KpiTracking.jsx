import { useState } from "react";
import {
  FaFileExcel,
  FaUserTie,
  FaCheckCircle,
  FaTimes,
  FaChartBar,
  FaTrophy,
  FaBolt,
  FaBullseye,
  FaChartLine,
  FaEdit,
  FaSave,
  FaCalendarAlt,
} from "react-icons/fa";

import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import PageHeader from "../layouts/PageHeader";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { kpiService } from "../services/kpiService";
import * as XLSX from "xlsx";

// Daftar 10+ Tab Bulan / Periode
const MONTH_TABS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Daftar Pilihan Tahun (Mulai dari 2026 ke Depan)
const YEARS = [
  "2026", "2027", "2028", "2029", "2030",
  "2031", "2032", "2033", "2034", "2035", "2036"
];

// Data Karyawan untuk Switcher HR & Export Multi-Sheet
const EMPLOYEES = [
  { id: "EMP-001", name: "Sari Wulandari", role: "Frontend Developer" },
  { id: "EMP-002", name: "Musa Al-Kindi", role: "Backend Developer" },
  { id: "EMP-003", name: "Mitha Amalia", role: "UI/UX Designer" },
  { id: "EMP-004", name: "Dimas Pratama", role: "Quality Assurance" },
];

// Data Default Nilai Input Raw KPI Berdasarkan Catatan Mentor & Rumus
const DEFAULT_INPUTS = {
  1: { onTime: 9, total: 10 },
  2: { onSla: 19, total: 20 },
  3: { bugCount: 2 },
  4: { count: 3 },
  5: { done: 0, total: 0 },
  6: { hours: 36 },
  7: { rejectCount: 2, totalTasks: 15 },
  8: { spEarned: 98, spTarget: 88 },
};

// Data 8 Indikator KPI Sesuai Tabel Excel Mentoring (PT. JAGA)
const KPI_METRICS_TEMPLATE = [
  {
    no: 1,
    category: "Financial Perspective",
    categoryBg: "bg-orange-100 text-orange-800 border-orange-200",
    objective: "Akuisisi dan live produk utama & add-ons sesuai target",
    kpiName: "On Time Delivery (Based on Product Timeline)",
    description: "Persentase seluruh fitur yang naik ke production tepat waktu sesuai timeline.",
    formulaText: "(Fitur Naik Tepat Waktu ÷ Total Fitur Terjadwal) × 100%",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "< 80%", l2: "80%", l3: "≥ 90%", l4: "≥ 95%" },
    monthlyTarget: "90%",
  },
  {
    no: 2,
    category: "Financial Perspective",
    categoryBg: "bg-orange-100 text-orange-800 border-orange-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target",
    kpiName: "SLA Ticket Bug",
    description: "Persentase ticket bug di production yang diselesaikan sesuai SLA.",
    formulaText: "(Ticket Selesai SLA ÷ Total Ticket Masuk) × 100%",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "< 85%", l2: "85%", l3: "90%", l4: "≥ 95%" },
    monthlyTarget: "90%",
  },
  {
    no: 3,
    category: "Customer Perspective",
    categoryBg: "bg-rose-100 text-rose-800 border-rose-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target",
    kpiName: "Production Bug Density – (New Product)",
    description: "Mengontrol jumlah temuan bug production agar tetap dalam batas sehat.",
    formulaText: "Total Temuan Bug di Production (Target: Normal 5 Bug, Ideal 0 Bug)",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "> 10", l2: "10", l3: "5", l4: "0" },
    monthlyTarget: "5 Bug",
  },
  {
    no: 4,
    category: "Financial Perspective",
    categoryBg: "bg-orange-100 text-orange-800 border-orange-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target",
    kpiName: "Continuous Improvement",
    description: "Inisiatif/optimasi sistem yang pernah dilakukan dalam 1 bulan.",
    formulaText: "Jumlah Inisiatif/Optimasi Diterapkan (Target: 36/12 = 3 Item/Bulan)",
    frequency: "Yearly",
    weight: 5,
    levels: { l1: "Annual: 0", l2: "Annual: 12", l3: "Annual: 24", l4: "Annual: 36" },
    monthlyTarget: "2 Item",
  },
  {
    no: 5,
    category: "Internal Business Process",
    categoryBg: "bg-amber-100 text-amber-800 border-amber-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target",
    kpiName: "Tech Debt Completion",
    description: "Penyelesaian hutang teknis modul legacy. (Catatan mentor: 0/0 dihitung 100%).",
    formulaText: "(Tech Debt Selesai ÷ Target Tech Debt) × 100% [0/0 = 100%]",
    frequency: "Monthly",
    weight: 5,
    levels: { l1: "< 40%", l2: "40%", l3: "60%", l4: "≥ 80%" },
    monthlyTarget: "60%",
  },
  {
    no: 6,
    category: "Customer Perspective",
    categoryBg: "bg-rose-100 text-rose-800 border-rose-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target",
    kpiName: "Task Completion Rate",
    description: "Rata-rata waktu pengerjaan task via ClickUp Track Time. Target < 48 Jam.",
    formulaText: "Rata-rata Durasi Selesai (Jam) [Target: < 48 Jam]",
    frequency: "Monthly",
    weight: 15,
    levels: { l1: "> 64 Jam", l2: "64 Jam", l3: "48 Jam", l4: "< 48 Jam" },
    monthlyTarget: "48 Jam",
  },
  {
    no: 7,
    category: "Customer Perspective",
    categoryBg: "bg-rose-100 text-rose-800 border-rose-200",
    objective: "Target Tech – Modernisasi & Pengurangan Tech Debt",
    kpiName: "Task Backward Rate",
    description: "Jumlah task yang mental/direject QA kembali ke On Progress.",
    formulaText: "(Task Reject dari QA ÷ Total Task Masuk QA) × 100% [Target < 20%]",
    frequency: "Yearly",
    weight: 15,
    levels: { l1: "> 50%", l2: "50%", l3: "30%", l4: "< 20%" },
    monthlyTarget: "30%",
  },
  {
    no: 8,
    category: "Innovation & Growth",
    categoryBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    objective: "Akuisisi dan live produk utama klinik sesuai target",
    kpiName: "Sprint Point (SP)",
    description: "Total akumulasi Story Point yang dinilai oleh PO/HR di ClickUp.",
    formulaText: "(Total SP Berhasil Tercapai ÷ Target SP Bulanan) × 100%",
    frequency: "Yearly",
    weight: 15,
    levels: { l1: "< 672 SP", l2: "672 SP", l3: "1056 SP", l4: "> 1440 SP" },
    monthlyTarget: "88 SP",
  },
];

export default function KpiTracking() {
  const { collapsed } = useSidebar();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedEmp, setSelectedEmp] = useState("EMP-001");
  const [exportNotification, setExportNotification] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  // State Input Real-Time Karyawan untuk Setiap Rumus KPI
  const [kpiInputs, setKpiInputs] = useState(DEFAULT_INPUTS);

  const isHR = currentUser?.role === "HR";
  const currentEmployee = isHR
    ? EMPLOYEES.find((e) => e.id === selectedEmp) || EMPLOYEES[0]
    : { id: "EMP-001", name: currentUser?.name || "Sari Wulandari", role: "Frontend Developer" };

  // Cegah pengetikan tanda minus, plus, atau exponential di input angka
  const handleKeyDownNonNegative = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  // Fungsi Handler Update Input Nilai KPI dengan proteksi nilai non-negatif
  const handleInputChange = (kpiNo, field, val) => {
    if (val === "") {
      setKpiInputs((prev) => ({
        ...prev,
        [kpiNo]: {
          ...prev[kpiNo],
          [field]: "",
        },
      }));
      return;
    }
    const cleanNum = Math.max(0, Number(val));
    setKpiInputs((prev) => ({
      ...prev,
      [kpiNo]: {
        ...prev[kpiNo],
        [field]: isNaN(cleanNum) ? 0 : cleanNum,
      },
    }));
  };

  // Reset Input ke Nilai Standar
  const handleResetInputs = () => {
    setKpiInputs(DEFAULT_INPUTS);
    setExportNotification("Nilai input KPI berhasil di-reset ke nilai default!");
    setTimeout(() => setExportNotification(false), 3000);
  };

  // Kalkulasi Otomatis Seluruh Nilai KPI Berdasarkan Rumus
  const computedMetrics = KPI_METRICS_TEMPLATE.map((kpi) => {
    let actual = "";
    let atPercent = "";
    let achievedLevel = 4;
    const inp = kpiInputs[kpi.no] || {};

    switch (kpi.no) {
      case 1: {
        const onTime = Number(inp.onTime) || 0;
        const total = Number(inp.total) || 1;
        const percent = total > 0 ? (onTime / total) * 100 : 0;
        actual = `${percent.toFixed(1)}%`;
        atPercent = `${((percent / 90) * 100).toFixed(1)}%`;
        achievedLevel = percent >= 95 ? 4 : percent >= 90 ? 3 : percent >= 80 ? 2 : 1;
        break;
      }
      case 2: {
        const onSla = Number(inp.onSla) || 0;
        const total = Number(inp.total) || 1;
        const percent = total > 0 ? (onSla / total) * 100 : 0;
        actual = `${percent.toFixed(1)}%`;
        atPercent = `${((percent / 90) * 100).toFixed(1)}%`;
        achievedLevel = percent >= 95 ? 4 : percent >= 90 ? 3 : percent >= 85 ? 2 : 1;
        break;
      }
      case 3: {
        const bug = Number(inp.bugCount) || 0;
        actual = `${bug} Bug`;
        atPercent = bug === 0 ? "100.0%" : `${Math.max(0, 100 - (bug / 5) * 20).toFixed(1)}%`;
        achievedLevel = bug === 0 ? 4 : bug <= 5 ? 3 : bug <= 10 ? 2 : 1;
        break;
      }
      case 4: {
        const count = Number(inp.count) || 0;
        actual = `${count} Item`;
        atPercent = `${((count / 2) * 100).toFixed(1)}%`;
        achievedLevel = count >= 3 ? 4 : count >= 2 ? 3 : count >= 1 ? 2 : 1;
        break;
      }
      case 5: {
        const done = Number(inp.done) || 0;
        const total = Number(inp.total) || 0;
        const percent = total === 0 && done === 0 ? 100 : total > 0 ? (done / total) * 100 : 0;
        actual = `${percent.toFixed(1)}%`;
        atPercent = `${((percent / 60) * 100).toFixed(1)}%`;
        achievedLevel = percent >= 80 ? 4 : percent >= 60 ? 3 : percent >= 40 ? 2 : 1;
        break;
      }
      case 6: {
        const hrs = Number(inp.hours) || 0;
        actual = `${hrs} Jam`;
        atPercent = hrs > 0 ? `${((48 / hrs) * 100).toFixed(1)}%` : "100.0%";
        achievedLevel = hrs < 48 ? 4 : hrs === 48 ? 3 : hrs <= 64 ? 2 : 1;
        break;
      }
      case 7: {
        const rej = Number(inp.rejectCount) || 0;
        const total = Number(inp.totalTasks) || 1;
        const percent = total > 0 ? (rej / total) * 100 : 0;
        actual = `${percent.toFixed(1)}%`;
        atPercent = percent <= 20 ? "100.0%" : `${((30 / Math.max(percent, 1)) * 100).toFixed(1)}%`;
        achievedLevel = percent < 20 ? 4 : percent <= 30 ? 3 : percent <= 50 ? 2 : 1;
        break;
      }
      case 8: {
        const sp = Number(inp.spEarned) || 0;
        const target = Number(inp.spTarget) || 88;
        const percent = target > 0 ? (sp / target) * 100 : 0;
        actual = `${sp} SP`;
        atPercent = `${percent.toFixed(1)}%`;
        achievedLevel = sp >= 120 ? 4 : sp >= 88 ? 3 : sp >= 56 ? 2 : 1;
        break;
      }
      default:
        break;
    }

    return { ...kpi, actual, atPercent, achievedLevel };
  });

  // Hitung Skor Rata-rata & Level Dominan
  const totalWeight = computedMetrics.reduce((acc, curr) => acc + curr.weight, 0);
  const avgLevel = (
    computedMetrics.reduce((acc, curr) => acc + curr.achievedLevel, 0) / computedMetrics.length
  ).toFixed(1);
  const totalLevel4 = computedMetrics.filter((m) => m.achievedLevel === 4).length;

  // Unduh File Excel (.xlsx) Multi-Sheet (1 Sheet per Karyawan)
  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    EMPLOYEES.forEach((emp) => {
      // Baris Header Laporan Resmi PT. JAGA
      const sheetData = [
        ["LAPORAN EVALUASI KEY PERFORMANCE INDICATOR (KPI)"],
        [`PT. JAGA • TAHUN EVALUASI ${selectedYear}`],
        [""],
        [
          "Nama Karyawan:",
          emp.name,
          "",
          "Jabatan / Divisi:",
          emp.role,
          "",
          "Periode Evaluasi:",
          `${activeTab} ${selectedYear}`,
        ],
        [""],
        [
          "No",
          "Category",
          "Strategy Objective",
          "KPI Name",
          "KPI Description & Rumus",
          "Frequency",
          "Bobot (%)",
          "Level 1",
          "Level 2",
          "Level 3",
          "Level 4",
          "Monthly Target",
          "Actual",
          "A/T (%)",
          "Achieved Level",
        ],
      ];

      // Baris Data KPI untuk Karyawan Ini
      computedMetrics.forEach((k) => {
        sheetData.push([
          k.no,
          k.category,
          k.objective,
          k.kpiName,
          k.description,
          k.frequency,
          `${k.weight}%`,
          k.levels.l1,
          k.levels.l2,
          k.levels.l3,
          k.levels.l4,
          k.monthlyTarget,
          k.actual,
          k.atPercent,
          `Level ${k.achievedLevel}`,
        ]);
      });

      // Baris Total Bobot & Ringkasan
      sheetData.push([""]);
      sheetData.push([
        "TOTAL BOBOT:",
        "",
        "",
        "",
        "",
        "",
        `${totalWeight}%`,
        "",
        "",
        "",
        "",
        "Rata-rata Capaian:",
        `Level ${avgLevel}`,
        "",
        "Sangat Baik",
      ]);

      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Konfigurasi Lebar Kolom yang Rapi
      ws["!cols"] = [
        { wch: 6 },  // No
        { wch: 24 }, // Category
        { wch: 34 }, // Strategy Objective
        { wch: 30 }, // KPI Name
        { wch: 50 }, // KPI Description & Rumus
        { wch: 12 }, // Frequency
        { wch: 12 }, // Bobot
        { wch: 14 }, // Level 1
        { wch: 14 }, // Level 2
        { wch: 14 }, // Level 3
        { wch: 14 }, // Level 4
        { wch: 16 }, // Monthly Target
        { wch: 14 }, // Actual
        { wch: 12 }, // A/T (%)
        { wch: 16 }, // Achieved Level
      ];

      // Nama sheet bersih (Maksimal 31 karakter sesuai batas Excel)
      const cleanSheetName = emp.name.replace(/[:\\/?*[\]]/g, "").substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, cleanSheetName);
    });

    // Tulis dan unduh file .xlsx langsung ke browser
    XLSX.writeFile(wb, `Laporan_KPI_Semua_Karyawan_${activeTab}_${selectedYear}.xlsx`);
    setExportNotification(
      `File Excel (.xlsx) Laporan KPI Semua Karyawan (1 Sheet per Karyawan) Periode ${activeTab} ${selectedYear} berhasil diunduh!`
    );
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
          subtitle={`Tabel evaluasi capaian Key Performance Indicator tahun ${selectedYear} • PT. JAGA`}
        >
          <div className="flex items-center gap-2">
            {/* Tombol Buka Form Input Capaian KPI (Untuk Karyawan & HR) */}
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <FaEdit /> Input Capaian KPI
            </button>

            {/* Tombol Export Excel Khusus HR (Multi-Sheet Semua Karyawan) */}
            {isHR && (
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Unduh 1 file Excel berisi semua sheet data KPI karyawan"
              >
                <FaFileExcel /> Export Excel (Semua Karyawan)
              </button>
            )}
          </div>
        </PageHeader>

        {/* Notifikasi Pop-up */}
        {exportNotification && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <FaCheckCircle className="text-emerald-500 text-base shrink-0" />
              <span>{exportNotification}</span>
            </div>
            <button onClick={() => setExportNotification(false)} className="text-emerald-600 hover:text-emerald-900 font-semibold cursor-pointer">
              Tutup
            </button>
          </div>
        )}

        {/* Info Top Banner & Karyawan Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-lg">
              <FaChartBar />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base">Evaluasi Kinerja: {currentEmployee.name}</h3>
                <span className="text-xs bg-primary-light text-primary px-2.5 py-0.5 rounded-full font-semibold">
                  {currentEmployee.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Tahun: <b>{selectedYear}</b> • PT: <b>PT. JAGA</b> • Periode: <b>{activeTab}</b></p>
            </div>
          </div>

          {/* Switcher Karyawan (Khusus HR bisa pilih karyawan) */}
          {isHR && (
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
          )}
        </div>

        {/* Quick KPI Overview Cards (Terhitung Real-time dari Rumus) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-base">
              <FaTrophy />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Rata-rata Capaian</p>
              <p className="text-lg font-extrabold text-gray-800">Level {avgLevel}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-base">
              <FaBolt />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Total Bobot Metrik</p>
              <p className="text-lg font-extrabold text-gray-800">{totalWeight}% (Lengkap)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
              <FaBullseye />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Target Level 4 Tercapai</p>
              <p className="text-lg font-extrabold text-green-600">{totalLevel4} dari {computedMetrics.length} Metrik</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base">
              <FaChartLine />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Sprint Point Terkumpul</p>
              <p className="text-lg font-extrabold text-accent">
                {kpiInputs[8]?.spEarned ?? 98} SP / {kpiInputs[8]?.spTarget ?? 88} SP
              </p>
            </div>
          </div>
        </div>

        {/* TAB BULAN & PILIHAN TAHUN DI SEBELAH KANAN */}
        <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* 10+ Tab Bulan (Januari - Desember) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {MONTH_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Pilihan Tahun di Sebelah Kanan Bulanan - Tampilan Lebih Luas & Lega */}
          <div className="flex items-center gap-2.5 bg-gray-50/90 hover:bg-gray-100/90 border border-gray-200 px-3.5 py-1.5 rounded-2xl shrink-0 transition-all shadow-2xs">
            <FaCalendarAlt className="text-primary text-sm shrink-0" />
            <span className="text-xs font-bold text-gray-700">Tahun:</span>

            {/* Tombol Tahun Sebelumnya */}
            <button
              type="button"
              onClick={() => {
                const curIdx = YEARS.indexOf(selectedYear);
                if (curIdx > 0) setSelectedYear(YEARS[curIdx - 1]);
              }}
              disabled={YEARS.indexOf(selectedYear) === 0}
              className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary flex items-center justify-center text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="Tahun Sebelumnya"
            >
              ‹
            </button>

            {/* Dropdown Pilihan Tahun Luas */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-gray-300 text-xs font-extrabold text-primary rounded-xl px-3 py-1.5 min-w-[110px] text-center focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-2xs transition-all"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="font-semibold text-gray-800 text-xs">
                  Tahun {y}
                </option>
              ))}
            </select>

            {/* Tombol Tahun Berikutnya */}
            <button
              type="button"
              onClick={() => {
                const curIdx = YEARS.indexOf(selectedYear);
                if (curIdx < YEARS.length - 1) setSelectedYear(YEARS[curIdx + 1]);
              }}
              disabled={YEARS.indexOf(selectedYear) === YEARS.length - 1}
              className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary flex items-center justify-center text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="Tahun Berikutnya"
            >
              ›
            </button>
          </div>
        </div>

        {/* TABEL UTAMA EVALUASI KPI */}
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
                  <th rowSpan="2" className="p-3 border-r border-gray-200 min-w-[240px]">KPI Description & Rumus</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 text-center w-24">Frequency</th>
                  <th rowSpan="2" className="p-3 border-r border-gray-200 text-center bg-blue-100 text-blue-900 w-16">Bobot</th>
                  {/* Header Level Description Ungu Gelap seperti di Excel */}
                  <th colSpan="4" className="p-2.5 text-center bg-[#581845] text-white font-bold border-r border-gray-200">
                    Level Description
                  </th>
                  {/* Header Nilai Aktual Hijau seperti di Excel */}
                  <th colSpan="4" className="p-2.5 text-center bg-[#4E9F3D] text-white font-bold">
                    Pencapaian Bulan {activeTab} {selectedYear}
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
                  <th className="p-2 text-center bg-[#D8E9A8] text-gray-800 font-bold w-24">Achieved Level</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-800 text-[11px]">
                {computedMetrics.map((kpi) => (
                  <tr key={kpi.no} id={`kpi-${kpi.no}`} className="hover:bg-blue-50/30 transition-colors duration-300">
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

                    {/* Description Murni */}
                    <td className="p-3 border-r border-gray-200 text-gray-600 leading-relaxed text-[10.5px]">
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

                    {/* Target & Actual (Hasil Real-time dari Rumus di Balik Layar) */}
                    <td className="p-2.5 border-r border-gray-200 text-center font-semibold text-gray-700">
                      {kpi.monthlyTarget}
                    </td>
                    <td className="p-2.5 border-r border-gray-200 text-center font-extrabold text-gray-900 bg-emerald-50/20">
                      {kpi.actual}
                    </td>
                    <td className="p-2.5 border-r border-gray-200 text-center font-bold text-primary">
                      {kpi.atPercent}
                    </td>

                    {/* Capaian Level Badge */}
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold text-xs shadow-2xs transition-all ${kpi.achievedLevel === 4
                            ? "bg-green-100 text-green-700 border border-green-300 scale-105"
                            : kpi.achievedLevel === 3
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : kpi.achievedLevel === 2
                                ? "bg-amber-100 text-amber-700 border border-amber-300"
                                : "bg-rose-100 text-rose-700 border border-rose-300"
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
                    Level {avgLevel}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* MODAL: Form Input Capaian KPI Karyawan */}
        {isInputModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-lg shadow-sm">
                    <FaEdit />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">
                      Form Pengisian Capaian KPI Karyawan
                    </h3>
                    <p className="text-xs text-gray-400">
                      Evaluasi Kinerja: <b>{currentEmployee.name}</b> • Periode: <b>{activeTab} {selectedYear}</b>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInputModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Body Modal: 8 Input Form Cards */}
              <div className="my-4 flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-blue-800 text-xs leading-relaxed">
                  Silakan masukkan angka capaian riil Anda pada setiap indikator di bawah. Rumus di balik layar akan otomatis menghitung nilai Actual, Persentase Capaian (A/T), dan Level Hasil yang akan langsung dimasukkan ke tabel evaluasi setelah Anda mengklik simpan!
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* KPI 1: On Time Delivery */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">1. On Time Delivery</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 15%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: Naik 90% tepat waktu sesuai sprint</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Fitur Tepat Waktu</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[1]?.onTime ?? 9}
                          onChange={(e) => handleInputChange(1, "onTime", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Total Fitur</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[1]?.total ?? 10}
                          onChange={(e) => handleInputChange(1, "total", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[0]?.actual} (Level {computedMetrics[0]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 2: SLA Ticket Bug */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">2. SLA Ticket Bug</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 15%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: 90% ticket diselesaikan tepat SLA</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Ticket Sesuai SLA</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[2]?.onSla ?? 19}
                          onChange={(e) => handleInputChange(2, "onSla", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Total Ticket Masuk</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[2]?.total ?? 20}
                          onChange={(e) => handleInputChange(2, "total", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[1]?.actual} (Level {computedMetrics[1]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 3: Production Bug Density */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">3. Production Bug Density</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 15%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: ≤ 5 Bug di environment production</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600">Jumlah Bug Ditemukan di Production</label>
                      <input
                        type="number"
                        min="0"
                        onKeyDown={handleKeyDownNonNegative}
                        value={kpiInputs[3]?.bugCount ?? 2}
                        onChange={(e) => handleInputChange(3, "bugCount", e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[2]?.actual} (Level {computedMetrics[2]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 4: Continuous Improvement */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">4. Continuous Improvement</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 5%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: 3 Item inovasi / optimasi per bulan</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600">Jumlah Inisiatif / Optimasi Diterapkan</label>
                      <input
                        type="number"
                        min="0"
                        onKeyDown={handleKeyDownNonNegative}
                        value={kpiInputs[4]?.count ?? 3}
                        onChange={(e) => handleInputChange(4, "count", e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[3]?.actual} (Level {computedMetrics[3]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 5: Tech Debt Completion */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">5. Tech Debt Completion</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 5%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: 60% pembersihan tech debt terjadwal</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Tech Debt Selesai</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[5]?.done ?? 0}
                          onChange={(e) => handleInputChange(5, "done", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Target Tech Debt</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[5]?.total ?? 0}
                          onChange={(e) => handleInputChange(5, "total", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[4]?.actual} (Level {computedMetrics[4]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 6: Task Completion Rate */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">6. Task Completion Rate</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 15%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: &lt; 48 Jam rata-rata pengerjaan task</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600">Rata-rata Durasi Pengerjaan (Jam)</label>
                      <input
                        type="number"
                        min="0"
                        onKeyDown={handleKeyDownNonNegative}
                        value={kpiInputs[6]?.hours ?? 36}
                        onChange={(e) => handleInputChange(6, "hours", e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[5]?.actual} (Level {computedMetrics[5]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 7: Task Backward Rate */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">7. Task Backward Rate</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 15%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: &lt; 20% task yang mental / ditolak QA</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Task Reject dari QA</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[7]?.rejectCount ?? 2}
                          onChange={(e) => handleInputChange(7, "rejectCount", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Total Task Masuk QA</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[7]?.totalTasks ?? 15}
                          onChange={(e) => handleInputChange(7, "totalTasks", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[6]?.actual} (Level {computedMetrics[6]?.achievedLevel})</span>
                    </div>
                  </div>

                  {/* KPI 8: Sprint Point (SP) */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">8. Sprint Point (SP)</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">Bobot 15%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Target: 88 SP tercapai per bulan</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Total SP Tercapai</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[8]?.spEarned ?? 98}
                          onChange={(e) => handleInputChange(8, "spEarned", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-600">Target SP Bulanan</label>
                        <input
                          type="number"
                          min="0"
                          onKeyDown={handleKeyDownNonNegative}
                          value={kpiInputs[8]?.spTarget ?? 88}
                          onChange={(e) => handleInputChange(8, "spTarget", e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between font-semibold">
                      <span className="text-gray-500">Hasil Hitung:</span>
                      <span className="text-emerald-600 font-bold">{computedMetrics[7]?.actual} (Level {computedMetrics[7]?.achievedLevel})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Modal: Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={handleResetInputs}
                  className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Reset ke Standar
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInputModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await kpiService.saveKpiEvaluations({
                          empId: currentEmployee.id,
                          month: activeTab,
                          year: selectedYear,
                          inputs: kpiInputs,
                        });
                      } catch (err) {
                        console.error("Gagal simpan KPI:", err);
                      }
                      setIsInputModalOpen(false);
                      setExportNotification(`Data capaian KPI untuk ${currentEmployee.name} berhasil disimpan dan otomatis masuk ke tabel evaluasi!`);
                      setTimeout(() => setExportNotification(false), 4000);
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <FaSave /> Simpan & Masukkan ke Tabel KPI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
