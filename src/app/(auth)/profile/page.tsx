"use client";
import { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import Image from "next/image";
import { Loader2, Trash, Download } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { PdfType, useUserContext } from "@/context/UserContext";
import { DeletePDF } from "@/HelperFun/HelperFun";

export default function ProfilePage() {
  const { pdfs, setPdfs,activePDF,setActivePDF } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<PdfType|null>(null);
  const[isDeleting,setIsDeleting]=useState<boolean>(false)
const {User}=useAuth()
useEffect(() => {
  if (User) {
    setLoading(false);
  }
}, [User]);
  function downloadPdf(key: string){
    
  }
  async function deletePdf(){
    try {
      setIsDeleting(true);
      if(!deleting) return;
      const res= await DeletePDF(deleting);
      if (res)
      console.log("Delete", deleting?.key);
      setPdfs((prev) => {
        const updated = prev.filter((p) => p.id !== deleting?.id);
        if (activePDF?.id === deleting?.id) {
          setActivePDF(updated[0] || null);
        }
        return updated;
      });
    } catch (error) {
      console.error("Delete error:", error);
      setDeleting(null);
    } finally {
      setIsDeleting(false);
      setDeleting(null);
    }
  };
  useEffect(() => {
    deletePdf();
    }, [deleting]);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
        <Image
          src={User?.avatar||"https://images.icon-icons.com/2483/PNG/512/user_icon_149851.png"}
          alt="Avatar"
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="flex flex-col gap-0.5 ">
          
        <div>
          <h1 className="text-2xl font-semibold">{User?.name}</h1>
        </div>
        <div>
          <h1 className="text-xl font-normal">{User?.email}</h1>
        </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-4">Your Shared PDFs</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : pdfs?.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          You haven’t uploaded any PDFs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {pdfs?.map((pdf:PdfType) => (
            <div
              key={pdf.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{pdf.name}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(pdf.size / 1024)} KB • {pdf.mime_type}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleting(pdf)}
                  className="p-2 rounded-lg hover:bg-red-100"
                >
                  {deleting?.id == pdf.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                  ) : (
                    <Trash className="w-5 h-5 text-red-600" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
