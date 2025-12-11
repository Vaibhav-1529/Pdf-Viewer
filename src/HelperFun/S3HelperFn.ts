import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import graphqlClient from "../services/GraphQlClient/gqlclient";
import { GET_PRESIGNED_URL } from "../services/gql/queries";

const client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.S3_ACESSS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});


export const createPresignedUrlWithClient = (key: any) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};



export async function uploadPDFToS3(file: File) {
  const ext = file.name.split(".").pop();
  const filename = `${uuidv4()}.${ext}`;

  try {
    console.log("Requesting presigned URL for file:", file.type);
    const { url, key } = await graphqlClient.request(GET_PRESIGNED_URL, {
      mime_type: file.type,
    });
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to S3");
    }

    return filename;
  } catch (err) {
    return { error: "Upload failed" };
  }
}