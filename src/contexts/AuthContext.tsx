import React, { createContext, useContext, useState } from 'react';
import { User, AuthContextType } from '../types';
import { users } from '../data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const permissions: { [role: string]: string[] } = {
    admin: ['view', 'create', 'edit', 'delete', 'manage_users', 'view_reports', 'view_prices'],
    manager: ['view', 'create', 'edit', 'view_reports', 'view_prices'],
    staff: ['view', 'create'],
  };

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find((u) => u.email === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return false;
    return permissions[user.role]?.includes(action) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
