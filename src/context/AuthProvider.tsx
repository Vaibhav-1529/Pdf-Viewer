"use client";
import { useUser } from "@clerk/nextjs";
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
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    async function fetchUser() {
      if (isSignedIn) {
        const currentUser: UserType = {
          id: user.id,
          name: user.fullName || "Unnamed User",
          email: user.primaryEmailAddress?.emailAddress || "No Email",
          avatar: user.imageUrl || "",
        };
        setUser(currentUser);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, [isLoaded, isSignedIn, user]);
  return (
    <AuthContext.Provider value={{ User, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
