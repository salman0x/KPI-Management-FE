import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

// Durasi Sesi: 24 Jam (dalam milidetik)
export const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  // Fungsi memeriksa apakah sesi masih valid (belum lewat 24 jam)
  const getValidSessionUser = useCallback(() => {
    try {
      const savedUser = localStorage.getItem("kpi_user");
      const expiry = localStorage.getItem("kpi_session_expiry");

      if (!savedUser) return null;

      // Jika ada batas waktu sesi, periksa apakah sudah kedaluwarsa
      if (expiry) {
        const isExpired = Date.now() > Number(expiry);
        if (isExpired) {
          // Sesi sudah lewat 24 jam -> bersihkan sesi
          localStorage.removeItem("kpi_user");
          localStorage.removeItem("kpi_session_expiry");
          localStorage.removeItem("kpi_token");
          return null;
        }
      } else {
        // Jika user ada tapi belum ada timestamp expiry, buatkan 24 jam dari sekarang
        const newExpiry = Date.now() + SESSION_DURATION;
        localStorage.setItem("kpi_session_expiry", newExpiry.toString());
      }

      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(() => getValidSessionUser());

  // Fungsi Login: Simpan user dan set batas waktu kedaluwarsa sesi 24 jam
  const login = (userData) => {
    const expiryTime = Date.now() + SESSION_DURATION;
    setCurrentUser(userData);
    localStorage.setItem("kpi_user", JSON.stringify(userData));
    localStorage.setItem("kpi_session_expiry", expiryTime.toString());
  };

  // Fungsi Logout: Hapus seluruh sesi dan token
  const logout = useCallback(() => {
    localStorage.removeItem("kpi_user");
    localStorage.removeItem("kpi_session_expiry");
    localStorage.removeItem("kpi_token");
    setCurrentUser(null);
  }, []);

  // Periksa status sesi secara berkala (setiap 1 menit) & saat tab kembali aktif (focus)
  useEffect(() => {
    const checkSession = () => {
      const validUser = getValidSessionUser();
      if (!validUser && currentUser) {
        logout();
      }
    };

    // Interval cek sesi setiap 60 detik
    const interval = setInterval(checkSession, 60 * 1000);

    // Event saat user membuka kembali tab browser
    window.addEventListener("focus", checkSession);
    window.addEventListener("visibilitychange", checkSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkSession);
      window.removeEventListener("visibilitychange", checkSession);
    };
  }, [currentUser, getValidSessionUser, logout]);

  // Hitung sisa waktu sesi dalam jam/menit (opsional jika dibutuhkan info waktu)
  const getRemainingSessionTime = () => {
    const expiry = localStorage.getItem("kpi_session_expiry");
    if (!expiry) return 0;
    return Math.max(0, Number(expiry) - Date.now());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
        getRemainingSessionTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
