"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { PdfType, SharedPdfType, useUserContext } from "@/context/UserContext";
import { Copy, CopyCheck, Share2 } from "lucide-react";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { SHARE_PDF } from "@/services/gql/queries";
import { motion, AnimatePresence } from "framer-motion";
import CryptoJS from "crypto-js";
import { env } from "process";
interface SharePdfModalProps {
  pdf: PdfType | null;
  islogo?: boolean;
}

export default function SharedPdfModal({ pdf, islogo, open, setOpen }: any) {
  // const [open, setOpen] = useState(false);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [sharedFile, setSharedFile] = useState<SharedPdfType | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isOnetime, setIsOnetime] = useState(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const { setSharedFiles, sharedFiles } = useUserContext();
  
  const handleShare = async () => {
    if (!pdf) return;
    if (enablePassword && password.trim() === "") {
      alert("Please enter a password.");
      return;
    }
    setIsSharing(true);
    try {
      if(enablePassword&&password.length<4){
        alert("Password atleast contain 4 character")
        return;
      }
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!;
      const hashval = CryptoJS.AES.encrypt(password, secretKey).toString();
      const res: { SharePDF: SharedPdfType } = await graphqlClient.request(
        SHARE_PDF,
        {
          pdf_id: pdf.id,
          name: pdf.name,
          unique_address: crypto.randomUUID().slice(0, 10),
          owner_id: pdf.user_id,
          is_protected: enablePassword,
          password: enablePassword ? hashval : null,
          is_onetime: isOnetime,
        }
      );

      console.log("Shared PDF:", res);
      setSharedFiles([res.SharePDF, ...(sharedFiles || [])]);
      setSharedFile(res.SharePDF);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSharing(false);
    }
  };
  const copyToClipboard = () => {
    setIsCopying(true);
    setTimeout(() => {
      setIsCopying(false);
    }, 2000);
    navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_SHARE_URL + "/" + sharedFile?.unique_address
    );
  };
  useEffect(() => {
    if (!open) {
      setEnablePassword(false);
      setPassword("");
      setIsOnetime(false);
      setSharedFile(null);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={(val) => !isSharing && setOpen(val)}>


      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="p-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />Share PDF
            </DialogTitle>

            <DialogDescription>
              You are about to share <strong>{pdf?.name}</strong>. You can
              optionally protect it with a password.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-2 mt-4"
          >
            <Checkbox
              id="enable-password"
              checked={enablePassword}
              onClick={(e)=>e.stopPropagation()}
              onCheckedChange={(val) => setEnablePassword(val === true)}
            />
            <label htmlFor="enable-password" className="cursor-pointer">
              Protect this PDF with a password
            </label>
          </motion.div>

          {/* Password Input Animation */}
          <AnimatePresence>
            {enablePassword && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-3 overflow-hidden"
              >
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  onClick={(e)=>e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* One Time Link */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-2 mt-4"
          >
            <Checkbox
              id="is-Onetime"
              checked={isOnetime}
              onClick={(e)=>e.stopPropagation()}
              onCheckedChange={(val) => setIsOnetime(val === true)}
            />
            <label htmlFor="is-Onetime" className="cursor-pointer">
              One-time access link (expires after first use)
            </label>
          </motion.div>
          {sharedFile && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-2 mt-4 w-full"
            >
              <div className="flex items-center gap-2 mt-1 w-full ">
                <p className="text-sm text-gray-600 break-all w-full bg-gray-50 p-2 rounded-md border ">
                  {process.env.NEXT_PUBLIC_SHARE_URL +
                    "/" +
                    sharedFile.unique_address}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard()}}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                  title="copy"
                >
                  {isCopying ? (
                    <CopyCheck size={18} />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </div>
            </motion.div>
          )}

          <DialogFooter className="mt-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSharing}
              >
                Cancel
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleShare} disabled={isSharing||sharedFile!=null}>
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
