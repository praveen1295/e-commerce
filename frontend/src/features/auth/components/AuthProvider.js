import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const user = useSelector(selectLoggedInUser);

  const [auth, setAuth] = useState({ isAuthenticated: false, role: null });

  useEffect(() => {
    if (user?.role) {
      setAuth({ isAuthenticated: true, role: user.role });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
