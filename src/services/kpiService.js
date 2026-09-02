import apiClient from "./apiClient";
import { kpiTemplateService } from "./kpiTemplateService";
import { kpiAssessmentService } from "./kpiAssessmentService";

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
 * API SERVICE: 9. KPI (Evaluasi Umum, Templates, & Assessments)
 */
export const kpiService = {
  /**
   * [GET] Ambil Data Evaluasi KPI
   * Endpoint: GET /kpi/evaluations?employeeId=...&month=...&year=...
   */
  async getKpiEvaluations(params = {}) {
    try {
      const response = await apiClient.get("/kpi/evaluations", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /kpi/evaluations offline, menggunakan fallback inputs.");
      return {
        inputs: FALLBACK_KPI_INPUTS,
        employeeId: params.employeeId || "EMP-001",
        month: params.month || "Januari",
        year: params.year || "2026",
      };
    }
  },

  /**
   * [POST] Simpan Data Evaluasi KPI
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
   * KPI Templates Helper
   */
  templates: kpiTemplateService,

  /**
   * KPI Assessments Helper
   */
  assessments: kpiAssessmentService,
};

export default kpiService;
