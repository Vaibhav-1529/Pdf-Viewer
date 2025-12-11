"use client";

import { useAuth } from "@/context/AuthProvider";
import { PdfType, SharedPdfType } from "@/context/UserContext";
import { GET_PDFS, GET_SHARED_PDFS } from "@/services/gql/queries";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { use, useEffect, useState } from "react";
export function useStoredPDFs() {
  const [pdfs, setPdfs] = useState<PdfType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { User } = useAuth();

  useEffect(() => {
    if (!User?.id) return;
    async function getStoredPDFs() {
      try {
        setIsLoading(true);

        const stored: { getPDFs: PdfType[] } = await graphqlClient.request(
          GET_PDFS,
          { user_id: User?.id }
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
export function useSharedPDFs() {
  const [sharedFiles, setSharedFiles] = useState<SharedPdfType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { User } = useAuth();
  useEffect(() => {
    if (!User?.id) return;
    async function getSharedPDFs() {
      try {
        setIsLoading(true);
        const stored: { getSharedPDFs: SharedPdfType[] } = await graphqlClient.request(
          GET_SHARED_PDFS,
          { owner_id: User?.id }
        );
        setSharedFiles(stored?.getSharedPDFs || []);
      } catch (err) {
        console.error("Error fetching PDFs:", err);
        setSharedFiles([]);
      } finally {
        setIsLoading(false);
      }
    }
    getSharedPDFs();
  }, [User]);

  return { sharedFiles, setSharedFiles, isLoading };
}

export function useActivePDF() {
  const { pdfs } = useStoredPDFs();
  const [activePDF, setActivePDFState] = useState<PdfType | null>(null);
  useEffect(() => {
    if (pdfs.length === 0) return;

    const storedId = localStorage.getItem("activePDFId");
    if (!storedId) return;
    const found = pdfs.find((p) => p.id === storedId);
    if (found) setActivePDFState(found);
  }, [pdfs]);
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
