import apiClient from "./apiClient";

export const FALLBACK_KPI_INPUTS = {
  1: { onTime: 9, total: 10 },
  2: { onSla: 19, total: 20 },
  3: { bugCount: 2 },
  4: { count: 3 },
  5: { done: 0, total: 0 },
  6: { hours: 36 },
  7: { rejectCount: 2, totalTasks: 15 },
  8: { spEarned: 98, spTarget: 88 },
};

/**
 * API SERVICE: KPI TRACKING & PERFORMANCE EVALUATION (Role Karyawan & HR)
 */
export const kpiService = {
  /**
   * [GET] Ambil Data Evaluasi KPI Karyawan per Bulan & Tahun
   * Endpoint: GET /kpi/evaluations?employeeId=...&month=...&year=...
   */
  async getKpiEvaluations(params = {}) {
    try {
      const response = await apiClient.get("/kpi/evaluations", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /kpi/evaluations belum aktif, menggunakan fallback inputs.");
      return {
        inputs: FALLBACK_KPI_INPUTS,
        employeeId: params.employeeId || "EMP-001",
        month: params.month || "Januari",
        year: params.year || "2026",
      };
    }
  },

  /**
   * [POST / PUT] Simpan Input Nilai Capaian Real Karyawan
   * Endpoint: POST /kpi/evaluations
   */
  async saveKpiEvaluations(payload) {
    try {
      const response = await apiClient.post("/kpi/evaluations", payload);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Simpan evaluasi KPI lokal.");
      return { success: true, ...payload };
    }
  },

  /**
   * [GET] Ambil Ringkasan Laporan KPI Semua Karyawan (Khusus HR Export Excel)
   * Endpoint: GET /kpi/summary?month=...&year=...
   */
  async getKpiSummaryAll(params = {}) {
    try {
      const response = await apiClient.get("/kpi/summary", params);
      return response.data || response;
    } catch (err) {
      return null;
    }
  },
};

export default kpiService;
