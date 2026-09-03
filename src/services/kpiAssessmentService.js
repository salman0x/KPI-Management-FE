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

export const kpiAssessmentService = {
  async getKpiAssessments(params = {}) {
    try {
      const response = await apiClient.get("/kpi-assessments", params);
      return response.data || response;
    } catch {
      return FALLBACK_KPI_ASSESSMENTS;
    }
  },

  async getKpiAssessmentById(id) {
    try {
      const response = await apiClient.get(`/kpi-assessments/${id}`);
      return response.data || response;
    } catch {
      return FALLBACK_KPI_ASSESSMENTS.find((a) => a.id === id) || null;
    }
  },

  async createKpiAssessment(assessmentData) {
    try {
      const response = await apiClient.post("/kpi-assessments", assessmentData);
      return response.data || response;
    } catch {
      return {
        id: `ASM-${Date.now().toString().slice(-3)}`,
        status: "Draft",
        ...assessmentData,
      };
    }
  },

  async updateKpiAssessment(id, assessmentData) {
    try {
      const response = await apiClient.put(`/kpi-assessments/${id}`, assessmentData);
      return response.data || response;
    } catch {
      return { id, ...assessmentData };
    }
  },

  async submitKpiAssessment(id, submitData = {}) {
    try {
      const response = await apiClient.patch(`/kpi-assessments/${id}/submit`, submitData);
      return response.data || response;
    } catch {
      return { id, status: "Submitted", submittedAt: new Date().toISOString(), ...submitData };
    }
  },

  async reviewKpiAssessment(id, reviewData = {}) {
    try {
      const response = await apiClient.patch(`/kpi-assessments/${id}/review`, reviewData);
      return response.data || response;
    } catch {
      return { id, status: reviewData.status || "Approved", reviewedAt: new Date().toISOString(), ...reviewData };
    }
  },
};

export default kpiAssessmentService;
