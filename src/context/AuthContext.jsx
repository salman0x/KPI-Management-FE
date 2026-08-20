import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("kpi_user");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Sari Wulandari",
          role: "Karyawan",
          email: "sari@assist.id",
          avatar: null,
        };
  });

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("kpi_user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("kpi_user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
