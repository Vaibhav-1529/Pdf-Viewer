"use client";
import { FileText, Share2, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { SharedPdfType, useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadPdf } from "@/HelperFun/HelperFun";
import TabUploadedPdf from "@/component/TabUploadedPdf";
import TabSharedPdf from "@/component/TabSharedPdf";

export default function LandingPage() {
  const { pdfs, setPdfs, activePDF, setActivePDF } = useUserContext();
  const { User } = useAuth();
  const router = useRouter();
  const [fileuploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const handleFileUpload = async (event: any) => {
    setFileUploading(true);
    try {
      const UploadedPdf = await uploadPdf({ files: event.target.files, User });
      setSelectedFile(UploadedPdf);
      setPdfs((prev) => [...prev, UploadedPdf]);
      setActivePDF(UploadedPdf);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
    } finally {
      setFileUploading(false);
    }
  };
  const handleViewPdf = () => {
    if (selectedFile) {
      router.push(`/viewer?pdf=${encodeURIComponent(selectedFile.id)}`);
    } else if (pdfs&&pdfs.length > 0) {
      setActivePDF(null);
      router.push("/viewer");
    } else {
      alert("No PDFs available to view.");
    }
  };
  return (
    <div className="min-h-screen  from-white to-gray-100">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center pt-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-6"
        >
          Your Smart <span className="text-primary">PDF Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Upload, manage, and share your PDF documents effortlessly from one
          clean dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-12 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="pdf-upload">
              <Button
                asChild
                variant="default"
                size="lg"
                className="cursor-pointer gap-2"
              >
                <div>
                  <Upload className="w-5 h-5 inline mr-2" />
                  {fileuploading ? "Uploading..." : "Upload PDF"}
                </div>
              </Button>
            </label>

            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={handleViewPdf}
            >
              {selectedFile ? "View Selected PDF" : "View Uploaded PDFs"}
            </Button>
          </div>

          {selectedFile && (
            <p className="mt-3 text-sm text-muted-foreground">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </motion.div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 mt-10">
        <Feature
          icon={<FileText className="w-9 h-9 text-primary" />}
          title="Upload Instantly"
          desc="Store PDFs securely with advanced protection features."
        />
        <Feature
          icon={<Share2 className="w-9 h-9 text-primary" />}
          title="Share Securely"
          desc="Share documents with passwords or one-click links."
        />
        <Feature
          icon={<CheckCircle2 className="w-9 h-9 text-primary" />}
          title="Manage Easily"
          desc="Keep track of uploaded and shared files in one place."
        />
      </section>

      {/* TABS SECTION */}
      <section className="max-w-5xl mx-auto mt-20 px-6 pb-20">
        <Tabs defaultValue="uploaded" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="uploaded">Uploaded Files</TabsTrigger>
            <TabsTrigger value="shared">Shared Files</TabsTrigger>
          </TabsList>

          {/* Uploaded PDFs */}
          <TabUploadedPdf/>
          {/* Shared PDFs */}
          <TabSharedPdf/>
        </Tabs>
      </section>
    </div>
  );
}

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300">
    <CardContent className="space-y-3">
      <div className="p-3 bg-muted rounded-lg w-fit">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </CardContent>
  </Card>
);
