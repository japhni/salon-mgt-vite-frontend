import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", decodedToken.userId);
    localStorage.setItem("username", decodedToken.sub);
    localStorage.setItem("userRole", decodedToken.roles);
    localStorage.setItem("expSession", decodedToken.exp);
    

    setUser(decodedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("expSession");
    localStorage.removeItem("curentDate");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
	return useContext(AuthContext)
}