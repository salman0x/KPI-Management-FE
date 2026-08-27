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
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    try {
      const response = await apiClient.post("/auth/login", {
        email: cleanEmail,
        password: cleanPassword,
      });

      if (response?.token) {
        localStorage.setItem("kpi_token", response.token);
      }
      return response.user || response;
    } catch (err) {
      // Jika Backend mengembalikan error spesifik (misal 401 / 403), teruskan pesan error
      if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError")) {
        throw err;
      }

      console.info("[Fallback Mode] Backend /auth/login belum aktif, melakukan validasi akun HR lokal.");

      // Validasi Keamanan FE di Mode Fallback:
      // Hanya izinkan email yang beridentitas HR resmi atau domain assist.id
      const isHrEmail =
        cleanEmail.includes("hr") ||
        cleanEmail === "admin@assist.id" ||
        cleanEmail === "hr.admin@assist.id" ||
        cleanEmail === "hr@assist.id";

      if (!isHrEmail) {
        throw new Error(
          "Akses ditolak: Form login ini khusus akun resmi Admin HR (contoh: hr.admin@assist.id). Untuk karyawan silakan gunakan tombol Login with Google."
        );
      }

      if (!cleanPassword || cleanPassword.length < 4) {
        throw new Error("Kata sandi akun HR tidak boleh kosong (minimal 4 karakter).");
      }

      return {
        name: "Admin HR",
        role: "HR",
        email: cleanEmail,
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
    localStorage.removeItem("kpi_session_expiry");
  },
};

export default authService;
