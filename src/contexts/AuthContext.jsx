import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedPosition = localStorage.getItem("position");
    if (storedUser) {
      setUser(storedUser);
      setPosition(storedPosition ? parseInt(storedPosition, 10) : Math.floor(Math.random() * 5) + 1);
    }
  }, []);

  const register = (userData) => {
    // Save user data to local storage or server
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    const userPosition = Math.floor(Math.random() * 5) + 1;
    setPosition(userPosition);
    localStorage.setItem("position", userPosition);
  };

  const login = (userData) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.username === userData.username && storedUser.phoneNumber === userData.phoneNumber && storedUser.password === userData.password) {
      setUser(storedUser);
      const userPosition = Math.floor(Math.random() * 5) + 1;
      setPosition(userPosition);
      localStorage.setItem("position", userPosition);
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    setPosition(null);
    localStorage.removeItem("user");
    localStorage.removeItem("position");
  };

  return (
    <AuthContext.Provider value={{ user, position, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
