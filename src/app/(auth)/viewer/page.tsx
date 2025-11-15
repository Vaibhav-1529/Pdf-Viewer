"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import SlidebarViewer from "@/component/SidebarViewer";
import { useStoredPDFs } from "@/hook/useMongodbPdf";
import { useUserContext } from "@/context/UserContext";
import { useEffect } from "react";

export default function Home() {
  const { pdfs } = useStoredPDFs();
  const { activePDF, setActivePDF } = useUserContext();

  useEffect(() => {
    if (pdfs.length > 0 && !activePDF) {
      setActivePDF(pdfs[0]);
    }
  }, [pdfs, activePDF]);

  if (!activePDF) {
    return <p className="text-muted-foreground p-4">No PDF selected.</p>;
  }

  const pdfSrc = activePDF.data.startsWith("data:")
    ? activePDF.data
    : `data:application/pdf;base64,${activePDF.data}`;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <SlidebarViewer />

        {/* Main PDF Viewer Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 w-full h-full p-0 overflow-hidden">
            <embed
              src={pdfSrc}
              type="application/pdf"
              className="w-[82vw] h-full"
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
