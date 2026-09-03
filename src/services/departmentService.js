import apiClient from "./apiClient";

export const FALLBACK_DEPARTMENTS = [
  { id: "DEP-001", name: "Engineering", code: "ENG", head: "Musa Al-Kindi", employeeCount: 8 },
  { id: "DEP-002", name: "Product & Design", code: "PRD", head: "Mitha Amalia", employeeCount: 5 },
  { id: "DEP-003", name: "Quality Control", code: "QC", head: "Dimas Pratama", employeeCount: 4 },
  { id: "DEP-004", name: "Product Management", code: "PM", head: "Reza Maulana", employeeCount: 3 },
  { id: "DEP-005", name: "Human Resources", code: "HR", head: "Admin HR", employeeCount: 2 },
];

export const departmentService = {
  async getDepartments(params = {}) {
    try {
      const response = await apiClient.get("/departments", params);
      return response.data || response;
    } catch {
      return FALLBACK_DEPARTMENTS;
    }
  },

  async getDepartmentById(id) {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data || response;
    } catch {
      return FALLBACK_DEPARTMENTS.find((d) => d.id === id) || null;
    }
  },

  async createDepartment(departmentData) {
    try {
      const response = await apiClient.post("/departments", departmentData);
      return response.data || response;
    } catch {
      return {
        id: `DEP-${Date.now().toString().slice(-3)}`,
        employeeCount: 0,
        ...departmentData,
      };
    }
  },

  async updateDepartment(id, departmentData) {
    try {
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      return response.data || response;
    } catch {
      return { id, ...departmentData };
    }
  },

  async deleteDepartment(id) {
    try {
      const response = await apiClient.delete(`/departments/${id}`);
      return response.data || response;
    } catch {
      return { success: true, id };
    }
  },
};

export default departmentService;
