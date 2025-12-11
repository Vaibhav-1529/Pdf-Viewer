"use client";

import { Upload, FileText, ZoomIn, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthProvider";
import { uploadPdf } from "@/HelperFun/HelperFun";

export default function HomePage() {
  const { pdfs, setPdfs, activePDF, setActivePDF } = useUserContext();
  const { User } = useAuth();
  const router = useRouter();
  const [fileuploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

const handleFileUpload = async (event: any) => {
  alert("Please log in first to upload your PDF.")
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient from-background to-muted px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          📘 PDF<span className="text-primary">View</span> — Your Smart PDF Companion
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Upload, read, annotate, and share your PDF documents effortlessly — all in one elegant interface.
        </p>
      </motion.div>

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
            <Button asChild variant="default" size="lg" className="cursor-pointer gap-2">
              <div>
                <Upload className="w-5 h-5 inline mr-2" />
                {fileuploading ? "Uploading..." : "Upload PDF"}
              </div>
            </Button>
          </label>

          <Button variant="outline" size="lg" className="gap-2" onClick={handleViewPdf}>
            {selectedFile ? "View Selected PDF" : "View Uploaded PDFs"}
          </Button>
        </div>

        {selectedFile && (
          <p className="mt-3 text-sm text-muted-foreground">
            Selected: <span className="font-medium">{selectedFile.name}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl"
      >
        <FeatureCard
          icon={<FileText className="text-primary" />}
          title="View Instantly"
          description="Open PDFs directly in your browser without any extensions or downloads."
        />
        <FeatureCard
          icon={<ZoomIn className="text-primary" />}
          title="Smart Zoom"
          description="Smooth zoom and navigation with advanced rendering for crisp pages."
        />
        <FeatureCard
          icon={<Share2 className="text-primary" />}
          title="Share & Collaborate"
          description="Generate secure links to share your documents with teammates in seconds."
        />
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-sm text-muted-foreground"
      >
        Made by <span className="text-primary font-medium">Vaibhav Saini</span> — 2025
      </motion.footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 rounded-md bg-muted">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
