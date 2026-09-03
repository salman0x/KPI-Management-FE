import apiClient from "./apiClient";

export const FALLBACK_TASKS = [
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
    point: 28,
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
    point: null,
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
    point: 20,
    backwardCount: 0,
  },
];

export const taskService = {
  async getTasks(params = {}) {
    try {
      const response = await apiClient.get("/tasks", params);
      return response.data || response;
    } catch {
      return FALLBACK_TASKS;
    }
  },

  async getTaskById(id) {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data || response;
    } catch {
      return FALLBACK_TASKS.find((t) => t.id === id) || null;
    }
  },

  async getTaskHistory(id) {
    try {
      const response = await apiClient.get(`/tasks/${id}/history`);
      return response.data || response;
    } catch {
      return [];
    }
  },

  async createTask(taskData) {
    try {
      const response = await apiClient.post("/tasks", taskData);
      return response.data || response;
    } catch {
      return {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        start: taskData.start || new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        deadline: taskData.deadline || "TBD",
        point: null,
        backwardCount: 0,
        ...taskData,
      };
    }
  },

  async updateTask(id, taskData) {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return response.data || response;
    } catch {
      return { id, ...taskData };
    }
  },

  async deleteTask(id) {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data || response;
    } catch {
      return { success: true, id };
    }
  },

  async updateTaskStatus(id, status) {
    try {
      const response = await apiClient.patch(`/tasks/${id}/status`, { status });
      return response.data || response;
    } catch {
      return { id, status };
    }
  },

  async updateTaskPoint(id, point) {
    try {
      const response = await apiClient.patch(`/tasks/${id}/point`, { point: Number(point) });
      return response.data || response;
    } catch {
      return { id, point: Number(point) };
    }
  },

  async rejectTaskQA(id) {
    try {
      const response = await apiClient.post(`/tasks/${id}/reject`);
      return response.data || response;
    } catch {
      return { id, status: "On Progress", backwardIncrement: 1 };
    }
  },
};

export default taskService;
