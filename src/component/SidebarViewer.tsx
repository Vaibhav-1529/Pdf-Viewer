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
import {
  UPLOAD_PDF,
  DELETE_PDF,
  DELETE_PDF_FROM_S3,
  GET_PRESIGNED_URL,
} from "@/services/gql/queries";
import { useRouter } from "next/navigation";
import PDFActionsMenu from "./modals/PDFActionsMenu";
import AboutPDFModal from "./modals/AboutPDFModal";
import DeletePDFModal from "./modals/DeletePDFModal";
import { DeletePDF, uploadPdf } from "@/HelperFun/HelperFun";

export default function SidebarViewer() {
  const { pdfs, activePDF, setActivePDF, setPdfs } = useUserContext();
  const { User } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [aboutPDF, setAboutPDF] = useState<PdfType | null>(null);
  const [deletePDF, setDeletePDF] = useState<PdfType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUploadClick =async () => fileInputRef.current?.click();
  const handleFileUpload = async (event: any) => {
    setIsUploading(true);
    try {
      const UploadedPdf=await uploadPdf({files:event.target.files,User})
      setPdfs((prev) => [...prev, UploadedPdf]);
      setActivePDF(UploadedPdf);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = async (pdf: any) => {
    try {
      setIsDeleting(true);
      const res= await DeletePDF(pdf);
      if (res)
      console.log("Delete", pdf.key);
      setPdfs((prev) => {
        const updated = prev.filter((p) => p.id !== pdf.id);
        if (activePDF?.id === pdf.id) {
          setActivePDF(updated[0] || null);
        }
        return updated;
      });
      setDeletePDF(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
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
            <div className="px-3 pb-3">
              <button
                disabled={isUploading}
                onClick={handleUploadClick}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-dashed 
                  transition-all
                  ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "border-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
                  }
                `}
              >
                {isUploading ? (
                  <span className="animate-pulse text-blue-600">
                    Uploading...
                  </span>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      Upload PDF
                    </span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <SidebarMenu className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400/30">
              {pdfs?.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 italic opacity-80">
                  No PDFs uploaded yet
                </p>
              ) : (
                pdfs?.map((pdf) => {
                  const isActive = activePDF?.id === pdf.id;

                  return (
                    <SidebarMenuItem key={pdf.id} className="flex items-center">
                      <SidebarMenuButton
                        onClick={() => {
                          setActivePDF(pdf);
                          router.replace(`/viewer?pdf=${pdf.name}`);
                        }}
                        className={`
                          flex items-center gap-3 flex-1 px-3 py-2 rounded-lg border transition-all 
                          ${
                            isActive
                              ? "bg-blue-500/20 dark:bg-blue-400/20 border-blue-500"
                              : "hover:bg-blue-500/10 dark:hover:bg-blue-400/10 border-transparent"
                          }
                        `}
                      >
                        <FileText className="w-4 h-4 opacity-80" />
                        <span className="truncate">{pdf.name}</span>
                      </SidebarMenuButton>
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
      <AboutPDFModal
        open={!!aboutPDF}
        pdf={aboutPDF}
        onClose={() => setAboutPDF(null)}
      />

      <DeletePDFModal
        open={!!deletePDF}
        pdf={deletePDF}
        onClose={() => setDeletePDF(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
