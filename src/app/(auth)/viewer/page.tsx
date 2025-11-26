"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SlidebarViewer from "@/component/SidebarViewer";
import { useStoredPDFs } from "@/hook/useMongodbPdf";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { User } = useAuth();
  const { pdfs, isLoading } = useStoredPDFs();
  const { activePDF, setActivePDF } = useUserContext();
  const [pdfSrc, setPdfSrc] = useState("");

  useEffect(() => {
    if (pdfs.length > 0 && !activePDF) {
      setActivePDF(pdfs[0]);
    }
  }, [pdfs, activePDF, setActivePDF]);

  useEffect(() => {
    if (activePDF?.data) {
      const src = activePDF.data.startsWith("data:")
        ? activePDF.data
        : `data:application/pdf;base64,${activePDF.data}`;
      setPdfSrc(src);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Fetching your PDFs...
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-lg text-muted-foreground">No PDFs found in your account.</p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  if (!activePDF||pdfSrc==="") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-lg text-muted-foreground">No PDF selected.</p>
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
          <main className="flex-1 w-full h-full overflow-hidden flex">
            <iframe src={pdfSrc} className="w-full h-full" />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
