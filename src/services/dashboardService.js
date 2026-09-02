import apiClient from "./apiClient";

/**
 * Data Cadangan (Mock Fallback) jika server Backend belum online / belum deploy.
 */
export const FALLBACK_DASHBOARD_TASKS = [
  {
    id: "TSK-001",
    title: "Implementasi Integrasi Autentikasi Google OAuth",
    point: 28,
    start: "2026-08-06",
    deadline: "2026-08-10",
    status: "On Progress",
    assignee: "Sari Wulandari",
  },
  {
    id: "TSK-002",
    title: "UI/UX Redesign Form Evaluasi KPI & Modal Penilaian",
    point: 20,
    start: "2026-08-06",
    deadline: "2026-08-10",
    status: "Done",
    assignee: "Mitha Amalia",
  },
  {
    id: "TSK-003",
    title: "Testing Stress Load & Penyesuaian Response Time API",
    point: 16,
    start: "2026-08-06",
    deadline: "2026-08-10",
    status: "Code Review",
    assignee: "Musa Al-Kindi",
  },
  {
    id: "TSK-004",
    title: "QA Ticket Bug Fixes & Retesting Modul Rekam Medis",
    point: 28,
    start: "2026-08-08",
    deadline: "2026-08-12",
    status: "QA",
    assignee: "Dimas Pratama",
  },
];

/**
 * API SERVICE: 2. DASHBOARD
 */
export const dashboardService = {
  /**
   * [GET] Mengambil angka statistik untuk Dashboard
   * Endpoint: GET /dashboard/stats
   */
  async getDashboardStats(params = {}) {
    try {
      const response = await apiClient.get("/dashboard/stats", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /dashboard/stats belum aktif, menggunakan fallback data.");
      return null;
    }
  },

  /**
   * [GET] List tugas untuk Sprint saat ini
   * Endpoint: GET /dashboard/tasks
   */
  async getDashboardTasks(params = {}) {
    try {
      const response = await apiClient.get("/dashboard/tasks", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /dashboard/tasks belum aktif, menggunakan fallback data.");
      const { isHR, userName } = params;
      if (isHR) return FALLBACK_DASHBOARD_TASKS;
      return FALLBACK_DASHBOARD_TASKS.filter(
        (t) =>
          (t.assignee && t.assignee.toLowerCase().includes("sari")) ||
          (userName && t.assignee && t.assignee.toLowerCase().includes(userName.toLowerCase()))
      );
    }
  },

  /**
   * [PUT] Edit tugas sprint (Khusus HR)
   * Endpoint: PUT /dashboard/tasks/:id
   */
  async updateDashboardTask(id, taskData) {
    try {
      const response = await apiClient.put(`/dashboard/tasks/${id}`, taskData);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Simpan edit task ${id} lokal.`);
      return { success: true, ...taskData };
    }
  },

  /**
   * [DELETE] Hapus tugas sprint (Khusus HR)
   * Endpoint: DELETE /dashboard/tasks/:id
   */
  async deleteDashboardTask(id) {
    try {
      const response = await apiClient.delete(`/dashboard/tasks/${id}`);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Hapus task ${id} lokal.`);
      return { success: true, id };
    }
  },
};

export default dashboardService;
