import { supabaseAdmin } from "../SupaBase/supabaseClient";

//Helper Function
async function checkPublicProtected({
  pdf_id,
  is_protected,
  is_onetime,
}: {
  pdf_id: string;
  is_protected: boolean;
  is_onetime: boolean;
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from("shared_files")
      .select("*")
      .eq("pdf_id", pdf_id)
      .eq("is_onetime", false);

    if (error) throw error;

    const publicLink = data.find(
      (item) => item.is_protected === false && item.is_onetime === false
    );

    const protectedLink = data.find(
      (item) => item.is_protected === true && item.is_onetime === false
    );
    if (!is_protected && !is_onetime) {
      console.log("public link",publicLink);
      if (publicLink) {
        return {
          allowed: false,
          pdf:publicLink,
          reason: "A public link already exists.",
        };
      }
    }
    if (is_protected && !is_onetime) {
      if (protectedLink) {
        return {
          allowed: false,
          pdf:protectedLink,
          reason: "A protected link already exists.",
        };
      }
    }
    return { allowed: true };
  } catch (error) {
    console.error("Error checking share:", error);
    throw new Error("Share validation failed.");
  }
}

export async function getSharedPDFs(_: any, args: { owner_id: string }) {
  try {
    console.log("Fetching PDFs for user_id:", args.owner_id);
    const res = await supabaseAdmin
      .from("shared_files")
      .select("*")
      .eq("owner_id", args.owner_id)
      .order("created_at", { ascending: false });
    return res.data;
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    throw new Error("Error fetching PDFs");
  }
}
export async function SharePDF(
  _: any,
  args: {
    pdf_id: string;
    name: string;
    unique_address: string;
    owner_id: string;
    is_protected: boolean;
    password: string;
    is_onetime: boolean;
  }
) {
  try {
    const { allowed,pdf } = await checkPublicProtected({
      pdf_id: args.pdf_id,
      is_protected: args.is_protected,
      is_onetime: args.is_onetime,
    });
    if (!allowed) {
      return {data:pdf,isexist:true};
    }
    const { data, error } = await supabaseAdmin
      .from("shared_files")
      .insert({
        pdf_id: args.pdf_id,
        name: args.name,
        unique_address: args.unique_address,
        is_protected: args.is_protected,
        password: args.password,
        owner_id: args.owner_id,
        is_onetime: args.is_onetime,
      })
      .select()
      .single();
      
    if (error) throw error;
    console.log("Uploaded PDF record:", data);
    return {data:data,isexist:false};
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error("Error uploading PDF");
  }
}

export async function deleteSharedPDF(
  _: any,
  args: { unique_address?: string; pdf_id?: string }
) {
  try {
    let query = supabaseAdmin.from("shared_files").delete();

    if (args.unique_address) {
      query = query.eq("unique_address", args.unique_address);
    }

    if (args.pdf_id) {
      query = query.eq("pdf_id", args.pdf_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    console.log("Deleted shared PDF(s):", data);

    return true;
  } catch (error) {
    console.error("Error deleting shared PDF:", error);
    throw new Error("Error deleting shared PDF");
  }
}

export async function getOneSharedPdf(_: any, args: { unique_address: string }) {
   try {
    const res = await supabaseAdmin
      .from("shared_files")
      .select("*")
      .eq("unique_address", args.unique_address)
      .single();
      console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    throw new Error("Error fetching PDFs");
  }
}