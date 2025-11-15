"use client";

import { useUserContext } from "@/context/UserContext";
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
import { UPLOAD_PDF } from "@/services/gql/queries";
import { useRouter } from "next/navigation";

export default function SidebarViewer() {
  const { pdfs, activePDF, setActivePDF, setPdfs } = useUserContext();
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const { User } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router=useRouter();
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!User?.id) {
      console.log(User);
      alert("Please log in before uploading a PDF.");
      return;
    }

    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Data = reader.result as string;

        const pdfPayload = {
          name: file.name,
          mimeType: file.type,
          data: base64Data,
          userId: User.id,
        };

        try {
          const response = await graphqlClient.request(UPLOAD_PDF, pdfPayload);

          const uploadedPDF = response.uploadPDF;

          setSelectedFile(uploadedPDF);
          setPdfs((prev) => [...prev, uploadedPDF]);
          setActivePDF(uploadedPDF);
          console.log("PDF successfully uploaded:", uploadedPDF);
        } catch (error) {
          console.error("Error uploading PDF:", error);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Sidebar className="pt-5 backdrop-blur-xl bg-white/20 dark:bg-neutral-900/20 border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold px-3 py-2">
            📁 Your PDFs
          </SidebarGroupLabel>

          {/* ===== Upload Card ===== */}
          <div className="px-3 pb-3">
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-dashed border-blue-400 
                hover:bg-blue-500/10 dark:hover:bg-blue-400/10 transition-all duration-200
                hover:border-blue-600"
            >
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Upload PDF
              </span>
            </button>

            {/* hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* ===== PDF List ===== */}
          <SidebarMenu className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400/30">
            {pdfs.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 italic opacity-80">
                No PDFs uploaded yet
              </p>
            ) : (
              pdfs.map((pdf) => {
                const isActive = activePDF?.name === pdf.name;

                return (
                  <SidebarMenuItem key={pdf.name}>
                    <SidebarMenuButton
                      onClick={() => {setActivePDF(pdf); router.replace(`/viewer?pdf=${pdf.name}`);}}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 border ${
                        isActive
                          ? "bg-blue-500/20 dark:bg-blue-400/20 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm"
                          : "hover:bg-blue-500/10 dark:hover:bg-blue-400/10 border-transparent"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-300"
                            : "opacity-80"
                        }`}
                      />
                      <span className="truncate">{pdf.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
