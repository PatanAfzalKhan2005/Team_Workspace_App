import { createContext, useEffect, useState } from "react";
import { clearSessionStorage, readStoredUser, writeStoredUser } from "../utils/session";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser());

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [token]);

  const login = (nextToken, nextUser = null) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);

    if (nextUser) {
      const storedUser = writeStoredUser(nextUser);
      setUser(storedUser);
    }
  };

  const updateUser = (nextUser) => {
    const storedUser = writeStoredUser(nextUser);
    setUser(storedUser);
  };

  const logout = () => {
    clearSessionStorage();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
