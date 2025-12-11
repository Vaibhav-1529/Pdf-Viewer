import { Navbar } from "@/component/Navbar";
import { ReactNode } from "react";
import AuthProvider from "@/context/AuthProvider";
import { UserProvider } from "@/context/UserContext";
import { type Metadata } from "next";
import {
  ClerkProvider
} from "@clerk/nextjs";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <AuthProvider>
      <UserProvider>
        <Navbar />
        {children}
      </UserProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
