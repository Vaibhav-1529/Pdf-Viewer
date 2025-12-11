import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthProvider";
import { SharedPdfType, useUserContext } from "@/context/UserContext";
import { DELETE_SHARED_PDF, GET_SHARED_PDFS } from "@/services/gql/queries";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import {
  FileText,
  Link2,
  Lock,
  Globe2,
  Eye,
  EyeOff,
  Copy,
  Clock,
  Trash2,
  Check,
  CopyCheck, // <-- added
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function TabSharedPdf() {
  const { User } = useAuth();
  const [showPassword, setShowPassword] = useState<string | null>(null);
  const [isdeleting, setIsDeleting] = useState<string | null>(null);
  const [isCopying,setIsCopying]=useState<string|null>(null)
  const {sharedFiles,setSharedFiles}=useUserContext()
  async function deleteSharedPDF(unique_address: string) {
    try {
      setIsDeleting(unique_address);
      const res = await graphqlClient.request(DELETE_SHARED_PDF, {
        unique_address: unique_address,
      });
      if (!res || res.deleteSharedPDF === undefined) {
        throw new Error("No response from server");
      }
      if (res.deleteSharedPDF === false) {
        console.error("No PDF found with this unique address.");
        return false;
      }
      const temp = sharedFiles?.filter(
        (item: SharedPdfType) => item.unique_address != unique_address
      ) as [SharedPdfType];
      setSharedFiles(temp);
      return true;
    } catch (error) {
      console.error("Error deleting shared PDF:", error);
      return false;
    } finally {
      setIsDeleting(null);
    }
  }
  const copyToClipboard = (text: string) => {
    setIsCopying(text);
    setTimeout(() => {
      setIsCopying(null);
    }, (2000));
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_SHARE_URL+"/"+text);
  };
  function decryptPass(val: string) {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!;
    const bytes = CryptoJS.AES.decrypt(val, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  return (
    <TabsContent value="shared">
              {sharedFiles?.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No PDFs uploaded yet.
          </p>
        ) :
      (<div className="mt-6 flex flex-col gap-4">
        {sharedFiles?.map((item:SharedPdfType) => (
          <Card
            key={item.id}
            className="shadow-sm border border-gray-200 hover:shadow-md transition-all rounded-xl relative"
          >
            <button
              className="absolute top-11 right-5 p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
              title="Delete"
              onClick={() => {
                deleteSharedPDF(item.unique_address);
              }}
            >
              {isdeleting === item.unique_address ? (
                <Spinner />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>

            <CardContent className="p-5">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary" />
                </div>

                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-lg text-gray-900">
                    {item.name}
                  </p>
                  <div>
                    <p className="font-medium text-base flex items-center gap-2 text-gray-900">
                      <Link2 className="w-4 h-4 text-gray-600" />
                      Shared Link
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600 break-all bg-gray-50 p-2 rounded-md border flex-1">
                        {process.env.NEXT_PUBLIC_SHARE_URL+"/"+item.unique_address}
                      </p>

                      <button
                        onClick={() => copyToClipboard(item.unique_address)}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                        title="copy"
                      >
                        {
                          isCopying==item.unique_address?
                          <CopyCheck size={18}/>:
                        <Copy className="w-4 h-4 text-gray-700" />
                        }
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-6 mt-3">
                    <div className="text-sm flex items-center gap-2">
                      {item.is_protected ? (
                        <span className="flex items-center gap-1">
                          <Lock className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium">
                            Protected
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Globe2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            Public
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="text-sm flex items-center gap-2">
                      {item.is_onetime ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-600 font-medium">
                            One-time
                          </span>
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      Shared on:{" "}
                      <span className="font-medium text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  {item.is_protected && item.password && (
                    <div className="flex items-center gap-3 bg-gray-50 p-2 px-3 rounded-md border w-fit mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        Password:
                      </span>

                      <span className="text-sm">
                        {showPassword === item.id
                          ? decryptPass(item.password)
                          : "• • • • •"}
                      </span>

                      <button
                        onClick={() =>
                          setShowPassword(
                            showPassword === item.id ? null : item.id
                          )
                        }
                        className="p-1"
                      >
                        {showPassword === item.id ? (
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>)}
    </TabsContent>
  );
}

export default TabSharedPdf;
