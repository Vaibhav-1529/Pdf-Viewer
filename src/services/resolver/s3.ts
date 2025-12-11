import { v4 as uuidv4 } from 'uuid';
import { createPresignedUrlWithClient } from "../../HelperFun/S3HelperFn";
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { supabaseAdmin } from '../SupaBase/supabaseClient';

export async function getPresignedURL(mime_type: string) {
  const id = uuidv4();
  const key = `${id}.${mime_type}`;
  const url = await createPresignedUrlWithClient(key);
  return { key, url };
}
const client = new S3Client({
  region: process.env.S3_REGION!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});


export async function getPdfUrl(_: any, { key }: any) {
   try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key
    });
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return { url , key };
  } catch (err) {
    return { error: "Could not generate signed URL" };
  }
}

export async function deleteFromS3(_: any, { key }: any) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    const res=await client.send(command);
    if(res)
      return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return false;
  }
}

  export async function getSharedPdfUrl(_: any, { pdf_id }: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("id", pdf_id)
      .single();

    if (error) throw error;
    if (!data) return { error: "File not found" };
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: data.key,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 60 });

    return {
      url,
      key: data.key,
    };
  } catch (err) {
    console.error("Signed URL error:", err);
    return { error: "Could not generate signed URL" };
  }
}
