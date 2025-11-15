"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AboutPDFModal({ open, onClose, pdf }: any) {
  if (!pdf) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>About PDF</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p><strong>Name:</strong> {pdf.name}</p>
          <p><strong>MIME:</strong> {pdf.mimeType}</p>
          <p><strong>Uploaded By:</strong> {pdf.userId}</p>
          <p><strong>Size:</strong> {(pdf.size / 1024).toFixed(2)} KB</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
