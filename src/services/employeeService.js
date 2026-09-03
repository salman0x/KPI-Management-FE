import apiClient from "./apiClient";

export const FALLBACK_EMPLOYEES = [
  {
    id: "EMP-001",
    name: "Sari Wulandari",
    role: "Frontend Developer",
    department: "Engineering",
    email: "sari@assist.id",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    joinDate: "01 Jan 2026",
    status: "Active",
    stats: {
      totalTasks: 18,
      sprintPoints: 210,
      kpiLevel: 4,
      onTimeRate: "96%",
      slaBugRate: "98%",
    },
  },
  {
    id: "EMP-002",
    name: "Musa Al-Kindi",
    role: "Backend Developer",
    department: "Engineering",
    email: "musa@assist.id",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    joinDate: "15 Jan 2026",
    status: "Active",
    stats: {
      totalTasks: 22,
      sprintPoints: 245,
      kpiLevel: 4,
      onTimeRate: "94%",
      slaBugRate: "95%",
    },
  },
  {
    id: "EMP-003",
    name: "Mitha Amalia",
    role: "UI/UX Designer",
    department: "Product & Design",
    email: "mitha@assist.id",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    joinDate: "01 Feb 2026",
    status: "Active",
    stats: {
      totalTasks: 14,
      sprintPoints: 160,
      kpiLevel: 3,
      onTimeRate: "92%",
      slaBugRate: "100%",
    },
  },
  {
    id: "EMP-004",
    name: "Dimas Pratama",
    role: "Quality Assurance (QA)",
    department: "Quality Control",
    email: "dimas@assist.id",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    joinDate: "10 Feb 2026",
    status: "Active",
    stats: {
      totalTasks: 25,
      sprintPoints: 190,
      kpiLevel: 4,
      onTimeRate: "98%",
      slaBugRate: "96%",
    },
  },
  {
    id: "EMP-005",
    name: "Reza Maulana",
    role: "Product Owner (PO)",
    department: "Product Management",
    email: "reza.po@assist.id",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    joinDate: "01 Des 2025",
    status: "Active",
    stats: {
      totalTasks: 30,
      sprintPoints: 320,
      kpiLevel: 4,
      onTimeRate: "99%",
      slaBugRate: "100%",
    },
  },
];

export const employeeService = {
  async getEmployees(params = {}) {
    try {
      const response = await apiClient.get("/employees", params);
      return response.data || response;
    } catch {
      return FALLBACK_EMPLOYEES;
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await apiClient.post("/employees", employeeData);
      return response.data || response;
    } catch {
      return {
        id: `EMP-${Date.now().toString().slice(-3)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employeeData.name || "User")}`,
        joinDate: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Active",
        stats: {
          totalTasks: 0,
          sprintPoints: 0,
          kpiLevel: 1,
          onTimeRate: "0%",
          slaBugRate: "0%",
        },
        ...employeeData,
      };
    }
  },

  async getEmployeeById(id) {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data || response;
    } catch {
      return FALLBACK_EMPLOYEES.find((e) => e.id === id) || null;
    }
  },

  async updateEmployee(id, employeeData) {
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData);
      return response.data || response;
    } catch {
      return { id, ...employeeData };
    }
  },

  async deleteEmployee(id) {
    try {
      const response = await apiClient.delete(`/employees/${id}`);
      return response.data || response;
    } catch {
      return { success: true, id };
    }
  },
};

export default employeeService;
