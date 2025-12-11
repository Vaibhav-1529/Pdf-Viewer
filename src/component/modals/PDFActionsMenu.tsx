"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Trash2, Share2 } from "lucide-react";
import { PdfType } from "@/context/UserContext";
import SharedPdfModal from "./SharedPdfModal";
import { useState } from "react";

interface PDFActionsProps {
  pdf: PdfType;
  onAbout: (pdf: PdfType) => void;
  onDelete: (pdf: PdfType) => void;
}

export default function PDFActionsMenu({ pdf, onAbout, onDelete }: PDFActionsProps) {
  const [openShare, setOpenShare] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none p-1">
          <MoreVertical className="w-5 h-5 opacity-70 hover:opacity-100 transition" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onAbout(pdf)}
          >
            <FileText className="w-4 h-4" />
            About PDF
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 cursor-pointer"
            onClick={() => onDelete(pdf)}
          >
            <Trash2 className="w-4 h-4" />
            Delete PDF
          </DropdownMenuItem>

          {/* SHARE BUTTON */}
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpenShare(true)}   // <-- OPEN MODAL FROM HERE
          >
            <Share2 className="w-4 h-4" />
            Share PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MOVE MODAL OUTSIDE DROPDOWN */}
      <SharedPdfModal pdf={pdf} islogo={false} open={openShare} setOpen={setOpenShare} />
    </>
  );
}

