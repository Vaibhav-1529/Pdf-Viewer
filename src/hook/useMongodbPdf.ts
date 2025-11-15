// src/hooks/useLocalPDFs.ts
"use client"
import { useAuth } from "@/context/AuthProvider" 
import { GET_PDFS } from "@/services/gql/queries"
import graphqlClient from "@/services/GraphQlClient/gqlclient"
import { useEffect, useState } from "react"
import { PDF } from "@prisma/client"



export  function useStoredPDFs() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const {User}=useAuth();
  useEffect(() => {
    if(!User) return;
    async function getStoredPDFs() {

        const stored:{getPDFs:PDF[]} =await graphqlClient.request(GET_PDFS,{ userId: User?.id });  
        if (stored) 
            setPdfs(stored?.getPDFs) 
        else {
            setPdfs([])
        }
    }
    getStoredPDFs();
  }, [User])
  return { pdfs, setPdfs }
}



export function useActivePDF() {
  const { pdfs } = useStoredPDFs() 
  const [activePDF, setActivePDFState] = useState<PDF | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("activePDFId")
    if (storedId) {
      const found = pdfs.find((p) => p.id === storedId)
      if (found) setActivePDFState(found)
    }
  }, [pdfs]) 
  const setActivePDF = (pdf: PDF | null) => {
    setActivePDFState(pdf)
    if (pdf) {
      localStorage.setItem("activePDFId", pdf.id)
    } else {
      localStorage.removeItem("activePDFId")
    }
  }
    return { activePDF, setActivePDF }
}