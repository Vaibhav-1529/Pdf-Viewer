"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Trash2 } from "lucide-react";
import { PdfType } from "@/context/UserContext";

interface PDFActionsProps {
  pdf: PdfType;
  onAbout: (pdf: PdfType) => void;
  onDelete: (pdf: PdfType) => void;
}

export default function PDFActionsMenu({ pdf, onAbout, onDelete }: PDFActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none p-1">
        <MoreVertical className="w-5 h-5 opacity-70 hover:opacity-100 transition" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {/* ABOUT */}
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onAbout(pdf)}
        >
          <FileText className="w-4 h-4" />
          About PDF
        </DropdownMenuItem>

        {/* DELETE */}
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-600 cursor-pointer"
          onClick={() => onDelete(pdf)}
        >
          <Trash2 className="w-4 h-4" />
          Delete PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
