"use client"

import { useStoredPDFs, useActivePDF,  } from "@/hook/useMongodbPdf";
import React, { createContext, useContext } from "react"
  type PDF= {
    id: string,
    name: string,
    mimeType: string,
    data: string,
    createdAt: string,
    userId: string,
  }
  export interface UserContextType {
  pdfs: PDF[]
  setPdfs: React.Dispatch<React.SetStateAction<PDF[]>>
  activePDF: PDF | null
  setActivePDF: (pdf: PDF | null) => void  
}
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within a UserProvider");
  return context;
}

export const UserContext = createContext<(null | UserContextType)>(null)
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
 const { pdfs, setPdfs } = useStoredPDFs();
  const { activePDF, setActivePDF } = useActivePDF();

  return (
    <UserContext.Provider value={{ pdfs, setPdfs, activePDF, setActivePDF }}>
      {children}
    </UserContext.Provider>
  )
}
