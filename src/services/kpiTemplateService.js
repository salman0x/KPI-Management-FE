import apiClient from "./apiClient";

export const FALLBACK_KPI_TEMPLATES = [
  {
    id: "TPL-001",
    name: "Standard Software Engineering KPI Template",
    role: "Developer",
    department: "Engineering",
    indicatorsCount: 8,
    indicators: [
      { no: 1, name: "Ketepatan Waktu Pengerjaan Task", weight: 15, target: "90%" },
      { no: 2, name: "Penyelesaian Sesuai SLA Tiket Bug", weight: 15, target: "95%" },
      { no: 3, name: "Jumlah Bug Lolos ke Production", weight: 15, target: "< 3 Bug" },
      { no: 4, name: "Partisipasi Code Review Backlog", weight: 10, target: "Min 5x" },
      { no: 5, name: "Dokumentasi Teknis & Panduan Modul", weight: 10, target: "100%" },
      { no: 6, name: "Kehadiran & Jam Kerja Efektif", weight: 10, target: ">= 35 Jam/Minggu" },
      { no: 7, name: "Tingkat Retest QA (Mental Backlog)", weight: 10, target: "< 15%" },
      { no: 8, name: "Pencapaian Story Points Sprint", weight: 15, target: ">= 88 SP" },
    ],
  },
];

/**
 * API SERVICE: 7. KPI TEMPLATES (Template Penilaian)
 */
export const kpiTemplateService = {
  /**
   * [GET] Ambil Semua Template KPI
   * Endpoint: GET /kpi-templates
   */
  async getKpiTemplates(params = {}) {
    try {
      const response = await apiClient.get("/kpi-templates", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /kpi-templates offline, menggunakan data fallback.");
      return FALLBACK_KPI_TEMPLATES;
    }
  },

  /**
   * [GET] Lihat Detail 1 Template KPI
   * Endpoint: GET /kpi-templates/:id
   */
  async getKpiTemplateById(id) {
    try {
      const response = await apiClient.get(`/kpi-templates/${id}`);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Ambil detail template KPI ${id} lokal.`);
      return FALLBACK_KPI_TEMPLATES.find((t) => t.id === id) || null;
    }
  },

  /**
   * [POST] Buat Template Baru (Khusus HR)
   * Endpoint: POST /kpi-templates
   */
  async createKpiTemplate(templateData) {
    try {
      const response = await apiClient.post("/kpi-templates", templateData);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Simpan template KPI baru lokal.");
      return {
        id: `TPL-${Date.now().toString().slice(-3)}`,
        ...templateData,
      };
    }
  },

  /**
   * [PUT] Edit Template (Khusus HR)
   * Endpoint: PUT /kpi-templates/:id
   */
  async updateKpiTemplate(id, templateData) {
    try {
      const response = await apiClient.put(`/kpi-templates/${id}`, templateData);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Update template KPI ${id} lokal.`);
      return { id, ...templateData };
    }
  },

  /**
   * [DELETE] Hapus Template (Khusus HR)
   * Endpoint: DELETE /kpi-templates/:id
   */
  async deleteKpiTemplate(id) {
    try {
      const response = await apiClient.delete(`/kpi-templates/${id}`);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Hapus template KPI ${id} lokal.`);
      return { success: true, id };
    }
  },
};

export default kpiTemplateService;
