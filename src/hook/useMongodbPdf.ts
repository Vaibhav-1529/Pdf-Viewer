// src/hooks/useLocalPDFs.ts
"use client";

import { useAuth } from "@/context/AuthProvider";
import { PdfType } from "@/context/UserContext";
import { GET_PDFS } from "@/services/gql/queries";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { useEffect, useState } from "react";

/* --------------------------------------------------
    HOOK 1: Fetch Stored PDFs with Loading State
-------------------------------------------------- */
export function useStoredPDFs() {
  const [pdfs, setPdfs] = useState<PdfType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { User } = useAuth();

  useEffect(() => {
    if (!User?.id) return; // No fetch until user exists

    async function getStoredPDFs() {
      try {
        setIsLoading(true);

        const stored: { getPDFs: PdfType[] } = await graphqlClient.request(
          GET_PDFS,
          { userId: User?.id }
        );

        setPdfs(stored?.getPDFs || []);
      } catch (err) {
        console.error("Error fetching PDFs:", err);
        setPdfs([]);
      } finally {
        setIsLoading(false);
      }
    }

    getStoredPDFs();
  }, [User]);

  return { pdfs, setPdfs, isLoading };
}

/* --------------------------------------------------
    HOOK 2: Manage Active PDF
-------------------------------------------------- */
export function useActivePDF() {
  const { pdfs } = useStoredPDFs();
  const [activePDF, setActivePDFState] = useState<PdfType | null>(null);

  // Load active PDF from localStorage whenever PDFs change
  useEffect(() => {
    if (pdfs.length === 0) return;

    const storedId = localStorage.getItem("activePDFId");
    if (!storedId) return;

    const found = pdfs.find((p) => p.id === storedId);
    if (found) setActivePDFState(found);
  }, [pdfs]);

  // Setter syncs with localStorage
  const setActivePDF = (pdf: PdfType | null) => {
    setActivePDFState(pdf);

    if (pdf) {
      localStorage.setItem("activePDFId", pdf.id);
    } else {
      localStorage.removeItem("activePDFId");
    }
  };

  return { activePDF, setActivePDF };
}
