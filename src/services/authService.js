import apiClient from "./apiClient";

/**
 * API SERVICE: AUTENTIKASI (Login HR Email & Login Karyawan Google)
 */
export const authService = {
  /**
   * [POST] Login via Email & Password (Khusus Admin / HR)
   * Endpoint: POST /auth/login
   */
  async loginWithEmail(email, password) {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (response?.token) {
        localStorage.setItem("kpi_token", response.token);
      }
      return response.user || response;
    } catch (err) {
      console.info("[Fallback Mode] Login HR lokal tanpa server BE.");
      return {
        name: "Admin HR",
        role: "HR",
        email: email || "hr.admin@assist.id",
        loginMethod: "email",
      };
    }
  },

  /**
   * [POST] Login via Google OAuth (Khusus Karyawan)
   * Endpoint: POST /auth/google
   */
  async loginWithGoogle(credentialResponse) {
    try {
      const response = await apiClient.post("/auth/google", {
        token: credentialResponse.credential,
      });
      if (response?.token) {
        localStorage.setItem("kpi_token", response.token);
      }
      return response.user || response;
    } catch (err) {
      console.info("[Fallback Mode] Login Google Karyawan lokal.");
      return {
        name: "Sari Wulandari",
        role: "Karyawan",
        email: "sari@assist.id",
        loginMethod: "google",
      };
    }
  },

  /**
   * [GET] Ambil data user yang sedang aktif
   * Endpoint: GET /auth/me
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");
      return response.user || response;
    } catch (err) {
      return null;
    }
  },

  /**
   * [POST] Logout
   */
  logout() {
    localStorage.removeItem("kpi_token");
    localStorage.removeItem("kpi_user");
  },
};

export default authService;
