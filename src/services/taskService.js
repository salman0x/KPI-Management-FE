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

/**
 * API SERVICE: TASK MANAGEMENT (Kanban, List, Point PO/HR, & QA)
 */
export const taskService = {
  /**
   * [GET] Ambil Semua Data Task
   * Endpoint: GET /tasks?category=...&status=...&assignee=...
   */
  async getTasks(params = {}) {
    try {
      const response = await apiClient.get("/tasks", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /tasks belum aktif, menggunakan fallback data.");
      return FALLBACK_TASKS;
    }
  },

  /**
   * [POST] Buat Task Baru (Karyawan / HR)
   * Endpoint: POST /tasks
   */
  async createTask(taskData) {
    try {
      const response = await apiClient.post("/tasks", taskData);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Simpan task baru lokal.");
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

  /**
   * [PATCH] Ubah Status Task (Kanban Drag & Drop / Select Status)
   * Endpoint: PATCH /tasks/:id/status
   */
  async updateTaskStatus(id, status) {
    try {
      const response = await apiClient.patch(`/tasks/${id}/status`, { status });
      return response.data || response;
    } catch (err) {
      return { id, status };
    }
  },

  /**
   * [PATCH] Atur Poin Story Points (Khusus HR / PO)
   * Endpoint: PATCH /tasks/:id/point
   */
  async updateTaskPoint(id, point) {
    try {
      const response = await apiClient.patch(`/tasks/${id}/point`, { point: Number(point) });
      return response.data || response;
    } catch (err) {
      return { id, point: Number(point) };
    }
  },

  /**
   * [POST] Reject QA (Task Mental Kembali ke On Progress)
   * Endpoint: POST /tasks/:id/reject
   */
  async rejectTaskQA(id) {
    try {
      const response = await apiClient.post(`/tasks/${id}/reject`);
      return response.data || response;
    } catch (err) {
      return { id, status: "On Progress", backwardIncrement: 1 };
    }
  },

  /**
   * [DELETE] Hapus Task (Khusus HR)
   * Endpoint: DELETE /tasks/:id
   */
  async deleteTask(id) {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data || response;
    } catch (err) {
      return { success: true, id };
    }
  },
};

export default taskService;
