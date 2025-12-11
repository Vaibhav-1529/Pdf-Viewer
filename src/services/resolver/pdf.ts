import { supabaseAdmin } from "../SupaBase/supabaseClient";

export async function getPdfById(_: any, args: { id: string }) {
  try {
    console.log("Fetching PDFs for user_id:", args.id);
    const pdf = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("id", args.id)
      .single();
    return pdf.data;
  }
  catch (error) {
    console.error("Error fetching PDFs:", error);
    throw new Error("Error fetching PDFs");
  }
}
export async function getPDFs(_: any, args: { user_id: string }) {
  try {
    console.log("Fetching PDFs for user_id:", args.user_id);
    const pdfs = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("user_id", args.user_id)
      .order("created_at",{ascending:false } );
    return pdfs.data;
  }
  catch (error) {
    console.error("Error fetching PDFs:", error);
    throw new Error("Error fetching PDFs");
  }
}

export async function uploadPDF(
  _: any,
  args: {
    name: string;
    mime_type: string;
    key: string;
    user_id: string;
    size: number;
  }
) {
  try {
    const id = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from("files")
      .insert({
        name: args.name,
        mime_type: args.mime_type,
        key: args.key,
        user_id: args.user_id,
        size: args.size,
      })
      .select()
      .single();

    if (error) throw error;
    console.log("Uploaded PDF record:", data);
    return data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error("Error uploading PDF");
  }
}

export async function deletePDF(_: any, args: { id: string }) {
  try {
    const { data, error } = await supabaseAdmin
      .from("files")
      .delete()
      .eq("id", args.id);
    if (error) throw error;
    console.log("Deleted PDF record:", data);
    return true;
  } catch (error) {
    console.error("Error deleting PDF:", error);
    throw new Error("Error deleting PDF");
  }
}
