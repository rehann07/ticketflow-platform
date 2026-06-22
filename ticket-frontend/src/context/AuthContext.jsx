import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
     setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
      try {
        // 1. Tell the backend to throw the current token into the Redis Blacklist
        await api.post("/api/auth/logout");
      } catch (error) {
        console.error("Server logout failed, but clearing local session.", error);
      } finally {
        // 2. Always clear the local browser storage, even if the server request fails
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        // Optional: Force a hard reload to clear any lingering React state
        // window.location.href = "/"; 
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
