import apiClient from "./apiClient";

export const FALLBACK_KPI_ASSESSMENTS = [
  {
    id: "ASM-001",
    employeeId: "EMP-001",
    employeeName: "Sari Wulandari",
    periodMonth: "Agustus",
    periodYear: "2026",
    status: "Submitted",
    score: 87.5,
    level: 4,
    submittedAt: "2026-08-31",
    reviewedAt: null,
  },
  {
    id: "ASM-002",
    employeeId: "EMP-002",
    employeeName: "Musa Al-Kindi",
    periodMonth: "Agustus",
    periodYear: "2026",
    status: "Approved",
    score: 91.0,
    level: 4,
    submittedAt: "2026-08-30",
    reviewedAt: "2026-09-01",
  },
];

/**
 * API SERVICE: 8. KPI ASSESSMENTS (Penilaian KPI)
 */
export const kpiAssessmentService = {
  /**
   * [GET] Ambil Semua Data Penilaian KPI
   * Endpoint: GET /kpi-assessments
   */
  async getKpiAssessments(params = {}) {
    try {
      const response = await apiClient.get("/kpi-assessments", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /kpi-assessments offline, menggunakan data fallback.");
      return FALLBACK_KPI_ASSESSMENTS;
    }
  },

  /**
   * [GET] Lihat Detail 1 Penilaian KPI
   * Endpoint: GET /kpi-assessments/:id
   */
  async getKpiAssessmentById(id) {
    try {
      const response = await apiClient.get(`/kpi-assessments/${id}`);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Ambil detail assessment ${id} lokal.`);
      return FALLBACK_KPI_ASSESSMENTS.find((a) => a.id === id) || null;
    }
  },

  /**
   * [POST] Buat Penilaian KPI Baru
   * Endpoint: POST /kpi-assessments
   */
  async createKpiAssessment(assessmentData) {
    try {
      const response = await apiClient.post("/kpi-assessments", assessmentData);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Simpan penilaian KPI baru lokal.");
      return {
        id: `ASM-${Date.now().toString().slice(-3)}`,
        status: "Draft",
        ...assessmentData,
      };
    }
  },

  /**
   * [PUT] Edit/Simpan Draft Penilaian
   * Endpoint: PUT /kpi-assessments/:id
   */
  async updateKpiAssessment(id, assessmentData) {
    try {
      const response = await apiClient.put(`/kpi-assessments/${id}`, assessmentData);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Update penilaian KPI ${id} lokal.`);
      return { id, ...assessmentData };
    }
  },

  /**
   * [PATCH] Kirim Penilaian (Submit)
   * Endpoint: PATCH /kpi-assessments/:id/submit
   */
  async submitKpiAssessment(id, submitData = {}) {
    try {
      const response = await apiClient.patch(`/kpi-assessments/${id}/submit`, submitData);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Submit penilaian KPI ${id} lokal.`);
      return { id, status: "Submitted", submittedAt: new Date().toISOString(), ...submitData };
    }
  },

  /**
   * [PATCH] Review/Approve Penilaian (Khusus HR)
   * Endpoint: PATCH /kpi-assessments/:id/review
   */
  async reviewKpiAssessment(id, reviewData = {}) {
    try {
      const response = await apiClient.patch(`/kpi-assessments/${id}/review`, reviewData);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Review penilaian KPI ${id} lokal.`);
      return { id, status: reviewData.status || "Approved", reviewedAt: new Date().toISOString(), ...reviewData };
    }
  },
};

export default kpiAssessmentService;
