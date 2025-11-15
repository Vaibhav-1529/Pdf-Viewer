// app/(auth)/layout.tsx
"use client";

import { Navbar } from "@/component/Navbar";
import { ReactNode } from "react";
import AuthProvider from "@/context/AuthProvider";
import { UserProvider } from "@/context/UserContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <Navbar />
        {children}
      </UserProvider>
    </AuthProvider>
  );
}
