import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [gym, setGym] = useState(
    localStorage.getItem("gym") ? JSON.parse(localStorage.getItem("gym")) : null
  );
  const [loading, setLoading] = useState(false);

  const login = (newToken, gymData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("gym", JSON.stringify(gymData));
    setToken(newToken);
    setGym(gymData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("gym");
    setToken(null);
    setGym(null);
  };

  return (
    <AuthContext.Provider value={{ token, gym, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
