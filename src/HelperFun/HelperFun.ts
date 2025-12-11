import { useAuth } from "@/context/AuthProvider";
import { PdfType } from "@/context/UserContext";
import { DELETE_PDF, DELETE_PDF_FROM_S3, DELETE_SHARED_PDF, GET_PDF_BY_ID, GET_PRESIGNED_URL, UPLOAD_PDF } from "@/services/gql/queries";
import graphqlClient from "@/services/GraphQlClient/gqlclient";

export async function uploadPdf({files,User}: {files: FileList | null,User:any}) {
  const file = files?.[0];
  if (!file) return;
  try {
    const { getPresignedURL } = await graphqlClient.request(
      GET_PRESIGNED_URL,
      { mime_type: file.type }
    );
    const key = getPresignedURL.key;
    const url = getPresignedURL.url;
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const uploadedPDF = await graphqlClient.request(UPLOAD_PDF, {
      name: file?.name,
      mime_type: file?.type,
      key: key,
      user_id: User?.id,
      size: file.size,
    });
    return uploadedPDF.uploadPDF;
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
  }
};

export async function DeletePDF (pdf: PdfType){
    try {
      const res1 = await graphqlClient.request(DELETE_PDF, { id: pdf.id });
      const res2 = await graphqlClient.request(DELETE_PDF_FROM_S3, {
        key: pdf.key,
      });
      const res3=await graphqlClient.request(DELETE_SHARED_PDF,{
        pdf_id:pdf.id
      })
      if (!res1.deletePDF && !res2.deletePDFFromS3&&res3.deleteSharedPDF) {
        throw new Error("Failed to delete PDF");
      }
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    } 
  };  
  
export async function getOnePDF(id:String) {
  try {
    const res:{getPdfById:PdfType}=await graphqlClient.request(GET_PDF_BY_ID,{
      id:id
    })
    if(!res.getPdfById)
      throw new Error("The pdf is not Fetched");
    return res?.getPdfById;
  } catch (error) {
    console.log("Error",error);
  }
}