import apiClient from "./apiClient";

/**
 * DAFTAR 2 AKUN HR RESMI YANG TELAH DITETAPKAN
 * (Daftar ini juga digunakan sebagai acuan spesifikasi untuk teman Backend)
 */
export const OFFICIAL_HR_ACCOUNTS = [
  {
    email: "hr.admin@assist.id",
    password: "adminhr123",
    name: "Admin HR",
    role: "HR",
  },
  {
    email: "hr.people@assist.id",
    password: "hrpeople123",
    name: "People Operations HR",
    role: "HR",
  },
];

/**
 * API SERVICE: AUTENTIKASI (Login HR Email & Login Karyawan Google)
 */
export const authService = {
  /**
   * [POST] Login via Email & Password (Khusus 2 Akun HR Resmi)
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
      // Jika Backend mengembalikan error respons khusus (misal 401 Unauthorized), teruskan pesan error
      if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError")) {
        throw err;
      }

      console.info("[Fallback Mode] Backend /auth/login belum aktif, memvalidasi 2 akun HR resmi lokal.");

      // 1. Cari apakah email terdaftar di daftar 2 akun HR
      const hrAccount = OFFICIAL_HR_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === cleanEmail
      );

      if (!hrAccount) {
        throw new Error(
          "Email tidak terdaftar sebagai akun resmi Admin HR."
        );
      }

      // 2. Periksa apakah password cocok
      if (hrAccount.password !== cleanPassword) {
        throw new Error("Kata sandi yang Anda masukkan salah. Silakan coba lagi.");
      }

      // 3. Kredensial valid -> kembalikan profil user HR
      return {
        name: hrAccount.name,
        role: "HR",
        email: hrAccount.email,
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
