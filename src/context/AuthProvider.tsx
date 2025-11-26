"use client";

import { CheckUser } from "@/hooks/CheckUser";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

type AuthContextType = {
  User: UserType | null;
  setUser: (u: UserType | null) => void;
};
export type UserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [User, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function validateUser() {
      try {
        const currentuser = await CheckUser();
        if (currentuser) {
          setUser(currentuser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error validating user:", err);
        setUser(null);
      }
    }

    validateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ User, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
