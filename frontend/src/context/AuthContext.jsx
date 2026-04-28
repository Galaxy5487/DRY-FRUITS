import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nr-auth");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("nr-auth", JSON.stringify(user));
    } else {
      localStorage.removeItem("nr-auth");
    }
  }, [user]);

  const login = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", values);
      setUser(data);
      toast.success("Welcome back");
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", values);
      setUser(data);
      toast.success("Account created");
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user?.token),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      setUser
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
