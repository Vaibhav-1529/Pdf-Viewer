"use client"

import { useStoredPDFs, useActivePDF, useSharedPDFs,  } from "@/hook/useSupabaseFiles";
import React, { createContext, useContext, useState } from "react"
export type PdfType = {
    user_id: string;
    id: string;
    name: string;
    key: string;
    mime_type: string;
    created_at: Date;
    size: number;
}
export type SharedPdfType = {
    owner_id: string;
    id: string;
    password: string;
    unique_address: string;
    created_at: Date;
    is_protected: boolean;
    pdf_id: string;
    name:string;
    is_onetime:string;
}
  export interface UserContextType {
  pdfs: PdfType[]|null
  setPdfs: React.Dispatch<React.SetStateAction<PdfType[]>>
  activePDF: PdfType | null
  setActivePDF: (pdf: PdfType | null) => void  
  sharedFiles:SharedPdfType[]|null
  setSharedFiles:React.Dispatch<React.SetStateAction<SharedPdfType[]>>
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
  const {sharedFiles,setSharedFiles}= useSharedPDFs();
  return (
    <UserContext.Provider value={{ pdfs, setPdfs, activePDF, setActivePDF,sharedFiles,setSharedFiles }}>
      {children}
    </UserContext.Provider>
  )
}
