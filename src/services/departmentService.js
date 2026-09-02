import apiClient from "./apiClient";

export const FALLBACK_DEPARTMENTS = [
  { id: "DEP-001", name: "Engineering", code: "ENG", head: "Musa Al-Kindi", employeeCount: 8 },
  { id: "DEP-002", name: "Product & Design", code: "PRD", head: "Mitha Amalia", employeeCount: 5 },
  { id: "DEP-003", name: "Quality Control", code: "QC", head: "Dimas Pratama", employeeCount: 4 },
  { id: "DEP-004", name: "Product Management", code: "PM", head: "Reza Maulana", employeeCount: 3 },
  { id: "DEP-005", name: "Human Resources", code: "HR", head: "Admin HR", employeeCount: 2 },
];

/**
 * API SERVICE: 6. DEPARTMENTS (Departemen)
 */
export const departmentService = {
  /**
   * [GET] Ambil Semua Data Departemen
   * Endpoint: GET /departments
   */
  async getDepartments(params = {}) {
    try {
      const response = await apiClient.get("/departments", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /departments offline, menggunakan data fallback.");
      return FALLBACK_DEPARTMENTS;
    }
  },

  /**
   * [GET] Lihat Detail 1 Departemen
   * Endpoint: GET /departments/:id
   */
  async getDepartmentById(id) {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Ambil detail departemen ${id} lokal.`);
      return FALLBACK_DEPARTMENTS.find((d) => d.id === id) || null;
    }
  },

  /**
   * [POST] Buat Departemen Baru (Khusus HR)
   * Endpoint: POST /departments
   */
  async createDepartment(departmentData) {
    try {
      const response = await apiClient.post("/departments", departmentData);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Simpan departemen baru lokal.");
      return {
        id: `DEP-${Date.now().toString().slice(-3)}`,
        employeeCount: 0,
        ...departmentData,
      };
    }
  },

  /**
   * [PUT] Edit Departemen (Khusus HR)
   * Endpoint: PUT /departments/:id
   */
  async updateDepartment(id, departmentData) {
    try {
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Update departemen ${id} lokal.`);
      return { id, ...departmentData };
    }
  },

  /**
   * [DELETE] Hapus Departemen (Khusus HR)
   * Endpoint: DELETE /departments/:id
   */
  async deleteDepartment(id) {
    try {
      const response = await apiClient.delete(`/departments/${id}`);
      return response.data || response;
    } catch (err) {
      console.info(`[Fallback Mode] Hapus departemen ${id} lokal.`);
      return { success: true, id };
    }
  },
};

export default departmentService;
