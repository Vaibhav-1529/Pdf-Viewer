"use client";

import PasswordModal from "@/component/modals/PasswordModal";
import { DELETE_SHARED_PDF, GET_ONE_SHARED_PDFS, GET_SHARED_PDF_URL } from "@/services/gql/queries";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { SharedPdfType } from "@/context/UserContext";
import { Loader } from "lucide-react";

export default function Page() {
  const { id } = useParams(); 
  const [pdfData, setPdfData] = useState<SharedPdfType | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchSharedPdf() {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await graphqlClient.request(GET_ONE_SHARED_PDFS, { unique_address: id });
      const data = res?.getOneSharedPdf;

      if (!data) {
        setNotFound(true);
        return;
      }

      setPdfData(data);
      setIsProtected(data.is_protected || false);
      if (!data.is_protected && data.pdf_id) {
        fetchPdfUrl(data.pdf_id);
      }
    } catch (error) {
      console.error("Error fetching shared pdf:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPdfUrl(pdf_id: string) {
    setLoading(true);
    try {
      const res = await graphqlClient.request(GET_SHARED_PDF_URL, { pdf_id });
      const url = res?.getSharedPdfUrl?.url;
      if (!url) {
        console.error("Signed URL not found");
        return;
      }
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching PDF URL:", error);
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordSubmit = (pwd: string) => {
    if (!pdfData?.password) {
      setErrorMsg("Password not found.");
      return;
    }

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!;
    const decryptedBytes = CryptoJS.AES.decrypt(pdfData.password, secretKey);
    const decryptedPass = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (pwd === decryptedPass) {
      setPasswordVerified(true);
      if (pdfData.pdf_id) fetchPdfUrl(pdfData.pdf_id);
    } else {
      setErrorMsg("Incorrect password. Please try again.");
    }
  };
async function deleteSharedPDF() {
  try {
    const res = await graphqlClient.request(DELETE_SHARED_PDF, {
      unique_address: pdfData?.unique_address,
    });
    if (!res || res.deleteSharedPDF === undefined) {
      throw new Error("No response from server");
    }
    if (res.deleteSharedPDF === false) {
      console.error("No PDF found with this unique address.");
      return false;
    }
    return true;

  } catch (error) {
    console.error("Error deleting shared PDF:", error);
    return false;
  }
}

  useEffect(()=>{
    if(pdfUrl && pdfData?.is_onetime){
        deleteSharedPDF();
        setPdfData(null);
    }
  },[pdfUrl])
  useEffect(() => {
    if (id) fetchSharedPdf();
  }, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={40} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-lg">Shared PDF not found or the link is invalid.</p>
      </div>
    );
  }
  if (isProtected && !passwordVerified) {
    return <PasswordModal onSubmit={handlePasswordSubmit} error={errorMsg} />;
  }

  return (
    <div className="">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          name={pdfData?.name}
          className="w-screen h-screen"
          title="Shared PDF"
        />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Loader size={40} />
          <p className="ml-2">Loading PDF...</p>
        </div>
      )}
    </div>
  );
}
