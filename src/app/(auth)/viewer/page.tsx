"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SlidebarViewer from "@/component/SidebarViewer";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { GET_PDF_URL } from "@/services/gql/queries";

export default function Home() {
  const { User } = useAuth();

  const { pdfs, activePDF, setActivePDF } = useUserContext();

  const [pdfSrc, setPdfSrc] = useState("");

  useEffect(() => {
    if (pdfs&&pdfs.length > 0 && !activePDF) {
      // load saved selected PDF from localStorage
      const storedId = localStorage.getItem("activePDFId");
      if (storedId) {
        const found = pdfs?.find((p) => p.id === storedId);
        if (found) {
          setActivePDF(found);
          return;
        }
      }

      // fallback to first PDF only if no stored selection
      setActivePDF(pdfs[0]);
    }

    if (pdfs?.length === 0) {
      setActivePDF(null);
    }
  }, [pdfs]);

  async function getActiveUrl(key:string) {
    try {
      const response = await graphqlClient.request(GET_PDF_URL, { key });
      return response?.getPdfUrl?.url || "";
    } catch (err) {
      console.error("PDF URL error:", err);
      return "";
    }
  }

  useEffect(() => {
    if (!activePDF?.key) {
      setPdfSrc("");
      return;
    }
    (async () => {
      const url = await getActiveUrl(activePDF.key);
      setPdfSrc(url);
    })();
  }, [activePDF]);

  if (!User) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <h2 className="text-xl font-semibold">You are not logged in</h2>
        <p className="text-muted-foreground">Please login or return home.</p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  if (!pdfs || pdfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-lg text-muted-foreground">No PDFs found in your account.</p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-background overflow-hidden">

        <div className="absolute top-3 left-3 z-50 md:hidden">
          <SidebarTrigger />
        </div>

        <SlidebarViewer />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 w-full h-full flex overflow-hidden">
            {pdfSrc ? (
              <iframe src={pdfSrc} className="w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full gap-3">
                <p className="text-lg text-muted-foreground">No PDF selected.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
