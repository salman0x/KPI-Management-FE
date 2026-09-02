import apiClient from "./apiClient";

/**
 * DAFTAR 2 AKUN HR RESMI YANG TELAH DITETAPKAN (Fallback Lokal)
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
 * API SERVICE: 1. AUTH (Otentikasi)
 */
export const authService = {
  /**
   * [POST] Login User via Email & Password
   * Endpoint: POST /auth/login
   * @param {string} email
   * @param {string} password
   */
  async loginWithEmail(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    try {
      const response = await apiClient.post("/auth/login", {
        email: cleanEmail,
        password: cleanPassword,
      });

      const token = response?.token || response?.data?.token || response?.accessToken;
      if (token) {
        localStorage.setItem("kpi_token", token);
      }

      return response.user || response.data?.user || response.data || response;
    } catch (err) {
      // Jika Backend mengembalikan error respons khusus (misal 401 Unauthorized / 400 Bad Request), teruskan pesan error
      if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError")) {
        throw err;
      }

      console.info("[Fallback Mode] Backend /auth/login offline, memvalidasi akun HR lokal.");

      // 1. Cari apakah email terdaftar di daftar 2 akun HR
      const hrAccount = OFFICIAL_HR_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === cleanEmail
      );

      if (!hrAccount) {
        throw new Error("Email tidak terdaftar sebagai akun resmi Admin HR.");
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

  // Alias untuk kompatibilitas
  async login(email, password) {
    return this.loginWithEmail(email, password);
  },

  /**
   * [POST] Daftar User Baru
   * Endpoint: POST /auth/register
   * @param {object} userData - { name, email, password, role, department }
   */
  async register(userData) {
    try {
      const response = await apiClient.post("/auth/register", userData);
      const token = response?.token || response?.data?.token || response?.accessToken;
      if (token) {
        localStorage.setItem("kpi_token", token);
      }
      return response.data || response;
    } catch (err) {
      console.warn("[Register Error]:", err.message);
      throw err;
    }
  },

  /**
   * [POST] Login via Google OAuth
   * Endpoint: POST /auth/google
   * @param {object|string} credentialResponse - Response dari Google OAuth
   */
  async loginWithGoogle(credentialResponse) {
    const tokenPayload = typeof credentialResponse === "string" 
      ? credentialResponse 
      : (credentialResponse?.credential || credentialResponse?.token);

    try {
      const response = await apiClient.post("/auth/google", {
        token: tokenPayload,
        credential: tokenPayload,
      });

      const token = response?.token || response?.data?.token || response?.accessToken;
      if (token) {
        localStorage.setItem("kpi_token", token);
      }
      return response.user || response.data?.user || response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Login Google Karyawan offline.");
      return {
        name: "Sari Wulandari",
        role: "Karyawan",
        email: "sari@assist.id",
        loginMethod: "google",
      };
    }
  },

  /**
   * [GET] Ambil Profil User yang sedang login (Butuh Token)
   * Endpoint: GET /auth/me
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");
      return response.user || response.data?.user || response.data || response;
    } catch (err) {
      return null;
    }
  },

  // Alias untuk kompatibilitas
  async getMe() {
    return this.getCurrentUser();
  },

  /**
   * Logout User - Bersihkan token dan data sesi
   */
  logout() {
    localStorage.removeItem("kpi_token");
    localStorage.removeItem("kpi_user");
    localStorage.removeItem("kpi_session_expiry");
  },
};

export default authService;
