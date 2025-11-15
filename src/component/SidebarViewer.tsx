"use client";

import { PdfType, useUserContext } from "@/context/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { FileText, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { UPLOAD_PDF, DELETE_PDF } from "@/services/gql/queries";
import { useRouter } from "next/navigation";

// Components
import PDFActionsMenu from "./modals/PDFActionsMenu";
import AboutPDFModal from "./modals/AboutPDFModal";
import DeletePDFModal from "./modals/DeletePDFModal";

export default function SidebarViewer() {
  const { pdfs, activePDF, setActivePDF, setPdfs } = useUserContext();
  const { User } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [aboutPDF, setAboutPDF] = useState<PdfType|null>(null);
  const [deletePDF, setDeletePDF] = useState<PdfType|null>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!User?.id) {
      alert("Please log in before uploading.");
      return;
    }

    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        const payload = {
          name: file.name,
          mimeType: file.type,
          data: base64Data,
          size: file.size,
          userId: User.id,
        };

        try {
          const response = await graphqlClient.request(UPLOAD_PDF, payload);
          const uploadedPDF = response.uploadPDF;

          setPdfs((prev) => [...prev, uploadedPDF]);
          setActivePDF(uploadedPDF);
        } catch (error) {
          console.error("Upload error:", error);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const confirmDelete = async (pdf: any) => {
    try {
      await graphqlClient.request(DELETE_PDF, { id: pdf.id });

      setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
      if (activePDF?.id === pdf.id) setActivePDF(null);

      setDeletePDF(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <Sidebar className="pt-5 backdrop-blur-xl bg-white/20 dark:bg-neutral-900/20 border-r border-white/10">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-semibold px-3 py-2">
              📁 Your PDFs
            </SidebarGroupLabel>

            {/* Upload Button */}
            <div className="px-3 pb-3">
              <button
                onClick={handleUploadClick}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-dashed border-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-400/10 transition-all"
              >
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  Upload PDF
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* PDF LIST */}
            <SidebarMenu className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400/30">
              {pdfs.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 italic opacity-80">
                  No PDFs uploaded yet
                </p>
              ) : (
                pdfs.map((pdf) => {
                  const isActive = activePDF?.id === pdf.id;

                  return (
                    <SidebarMenuItem key={pdf.id} className="flex items-center">
                      <SidebarMenuButton
                        onClick={() => {
                          setActivePDF(pdf);
                          router.replace(`/viewer?pdf=${pdf.name}`);
                        }}
                        className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
                          isActive
                            ? "bg-blue-500/20 dark:bg-blue-400/20 border-blue-500"
                            : "hover:bg-blue-500/10 dark:hover:bg-blue-400/10 border-transparent"
                        }`}
                      >
                        <FileText className="w-4 h-4 opacity-80" />
                        <span className="truncate">{pdf.name}</span>
                      </SidebarMenuButton>

                      {/* 3 DOT MENU */}
                      <PDFActionsMenu
                        pdf={pdf}
                        onAbout={() => setAboutPDF(pdf)}
                        onDelete={() => setDeletePDF(pdf)}
                      />
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* MODALS */}
      <AboutPDFModal open={!!aboutPDF} pdf={aboutPDF} onClose={() => setAboutPDF(null)} />

      <DeletePDFModal
        open={!!deletePDF}
        pdf={deletePDF}
        onClose={() => setDeletePDF(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
