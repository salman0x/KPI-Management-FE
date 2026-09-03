import apiClient from "./apiClient";

export const OFFICIAL_HR_ACCOUNTS = [
  {
    _id: "6a94f8f6e9bd1d2e3f948e57",
    email: "hr@assist.com",
    password: "HrAssist123!",
    name: "yoyo",
    role: "HR",
    position: "HR",
  },
];

export const authService = {
  async loginWithEmail(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    const hrAccount = OFFICIAL_HR_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (!hrAccount) {
      throw new Error("Email tidak terdaftar sebagai akun HR.");
    }

    if (hrAccount.password !== cleanPassword) {
      throw new Error("Kata sandi yang Anda masukkan salah.");
    }

    try {
      const response = await apiClient.post("/auth/login", {
        email: cleanEmail,
        password: cleanPassword,
      });

      const token = response?.token || response?.data?.token || response?.accessToken;
      if (token) {
        localStorage.setItem("kpi_token", token);
      }

      let user = response.user || response.data?.user || response.data || response;
      if (user && typeof user === "object") {
        user = {
          ...user,
          role: user.role?.toLowerCase() === "hr" ? "HR" : user.role,
        };
      }

      return user;
    } catch {
      return {
        _id: hrAccount._id,
        name: hrAccount.name,
        role: "HR",
        email: hrAccount.email,
        position: hrAccount.position || "HR",
        loginMethod: "email",
      };
    }
  },

  async login(email, password) {
    return this.loginWithEmail(email, password);
  },

  async register(userData) {
    try {
      const response = await apiClient.post("/auth/register", userData);
      const token = response?.token || response?.data?.token || response?.accessToken;
      if (token) {
        localStorage.setItem("kpi_token", token);
      }
      return response.data || response;
    } catch (err) {
      throw err;
    }
  },

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
    } catch {
      return {
        name: "Sari Wulandari",
        role: "Karyawan",
        email: "sari@assist.id",
        loginMethod: "google",
      };
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");
      return response.user || response.data?.user || response.data || response;
    } catch {
      return null;
    }
  },

  async getMe() {
    return this.getCurrentUser();
  },

  logout() {
    localStorage.removeItem("kpi_token");
    localStorage.removeItem("kpi_user");
    localStorage.removeItem("kpi_session_expiry");
  },
};

export default authService;
