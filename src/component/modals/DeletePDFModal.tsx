"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PdfType } from "@/context/UserContext";

interface DeletePDFModalProps {
  open: boolean;
  pdf: PdfType | null;
  onClose: () => void;
  onConfirm: (pdf: PdfType) => void;
  isDeleting?: boolean;
}

export default function DeletePDFModal({
  open,
  pdf,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeletePDFModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete PDF</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{pdf?.name}</strong>?  
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => pdf && onConfirm(pdf)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
