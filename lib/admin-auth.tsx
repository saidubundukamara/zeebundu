"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated (from localStorage/sessionStorage)
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const adminData = localStorage.getItem("admin");
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // For demo purposes, we'll use simple hardcoded credentials
    // In production, this would make an API call to verify credentials
    const validCredentials = [
      { email: "admin@zeebundu.com", password: "admin123", name: "Admin User" },
      { email: "super@zeebundu.com", password: "super123", name: "Super Admin" }
    ];

    const validAdmin = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (!validAdmin) {
      throw new Error("Invalid credentials");
    }

    const adminData: Admin = {
      id: "admin-1",
      email: validAdmin.email,
      name: validAdmin.name,
    };

    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}