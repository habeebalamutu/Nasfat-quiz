import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  };

  const login = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const storedUser = users.find(
      (u) =>
        u.username === userData.username &&
        u.phoneNumber === userData.phoneNumber &&
        u.password === userData.password
    );
    if (storedUser) {
      localStorage.setItem("currentUser", JSON.stringify(storedUser));
      setUser(storedUser);
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
