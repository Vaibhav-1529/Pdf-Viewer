import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { PdfType, SharedPdfType, useUserContext } from "@/context/UserContext";
import SharedPdfModal from "./modals/SharedPdfModal";
import PDFActionsMenu from "./modals/PDFActionsMenu";
import { useState } from "react";
import { DeletePDF } from "@/HelperFun/HelperFun";
import AboutPDFModal from "./modals/AboutPDFModal";
import DeletePDFModal from "./modals/DeletePDFModal";
import { useRouter } from "next/navigation";

export default function TabUploadedPdf() {
  const { pdfs, activePDF, setActivePDF, setPdfs,sharedFiles,setSharedFiles } = useUserContext();
  const [aboutPDF, setAboutPDF] = useState<PdfType | null>(null);
  const [deletePDF, setDeletePDF] = useState<PdfType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router=useRouter();
  const confirmDelete = async (pdf: any) => {
    try {
      setIsDeleting(true);
      const res = await DeletePDF(pdf);
      if (res) console.log("Delete", pdf.key);
      setPdfs((prev) => {
        const updated = prev.filter((p) => p.id !== pdf.id);
        if (activePDF?.id === pdf.id) {
          setActivePDF(updated[0] || null);
        }
        return updated;
      });
      setSharedFiles((prev)=>{
        const updated = prev.filter((p:SharedPdfType) => p.pdf_id !== pdf.id);
        return updated;
      });
      setDeletePDF(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };
function openPdf(pdf: PdfType) {
  localStorage.setItem("activePDFId", pdf.id);
  setActivePDF(pdf);
  router.push("/viewer");
}

  return (
    <TabsContent value="uploaded">
      <div className="mt-6 space-y-4">
        {pdfs?.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No PDFs uploaded yet.
          </p>
        ) : (
          pdfs?.map((pdf: PdfType) => (
            <Card key={pdf.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p onClick={()=>{openPdf(pdf)}} className="font-semibold cursor-pointer hover:underline">{pdf?.name}</p>
                  <p className="text-sm text-gray-500">
                    {(pdf.size / 1024).toFixed(1)} KB • {pdf.mime_type}
                  </p> 
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-400">
                    {new Date(pdf.created_at).toLocaleDateString()}
                  </p>
                  <PDFActionsMenu
                    pdf={pdf}
                    onAbout={() => setAboutPDF(pdf)}
                    onDelete={() => setDeletePDF(pdf)}
                  />{" "}
                </div>
              </CardContent>
            </Card>
          ))
        )}
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
      </div>
    </TabsContent>
  );
}
