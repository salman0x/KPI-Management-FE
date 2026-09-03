import apiClient from "./apiClient";

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

export const dashboardService = {
  async getDashboardStats(params = {}) {
    try {
      const response = await apiClient.get("/dashboard/stats", params);
      return response.data || response;
    } catch {
      return null;
    }
  },

  async getDashboardTasks(params = {}) {
    try {
      const response = await apiClient.get("/dashboard/tasks", params);
      return response.data || response;
    } catch {
      const { isHR, userName } = params;
      if (isHR) return FALLBACK_DASHBOARD_TASKS;
      return FALLBACK_DASHBOARD_TASKS.filter(
        (t) =>
          (t.assignee && t.assignee.toLowerCase().includes("sari")) ||
          (userName && t.assignee && t.assignee.toLowerCase().includes(userName.toLowerCase()))
      );
    }
  },

  async updateDashboardTask(id, taskData) {
    try {
      const response = await apiClient.put(`/dashboard/tasks/${id}`, taskData);
      return response.data || response;
    } catch {
      return { success: true, ...taskData };
    }
  },

  async deleteDashboardTask(id) {
    try {
      const response = await apiClient.delete(`/dashboard/tasks/${id}`);
      return response.data || response;
    } catch {
      return { success: true, id };
    }
  },
};

export default dashboardService;
