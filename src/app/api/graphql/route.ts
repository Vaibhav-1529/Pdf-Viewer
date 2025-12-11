import { ApolloServer } from "@apollo/server";
import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-tag";
import { deletePDF, getPdfById, getPDFs, uploadPDF } from "@/services/resolver/pdf";
import { deleteFromS3, getPresignedURL, getSharedPdfUrl } from "@/services/resolver/s3";
import { getPdfUrl } from "@/services/resolver/s3";
import { deleteSharedPDF, getOneSharedPdf, getSharedPDFs, SharePDF } from "@/services/resolver/sharedPdf";

const allowedOrigins = [
  "http://localhost:3000",
  "https://studio.apollographql.com",
  "https://pdf-viewer-ivory.vercel.app",
  "https://pdf-store-s3.s3.eu-north-1.amazonaws.com"
];

const typeDefs = gql`
type PresignedResponse {
  url: String
  key: String
  error:String
}

  type PDF {
    id: String!
    name: String!
    mime_type: String!
    created_at: String!
    key: String!
    user_id: String!
    size: Int!
  }
  type SharedPDF {
    id: String!
    name: String!
    created_at: String!
    pdf_id: String!
    owner_id: String!
    unique_address: String!
    is_protected: Boolean!
    password: String
    is_onetime: Boolean!
  }

  type Query {
    getPdfById(id:String!):PDF
    getPDFs(user_id: String!): [PDF!]
    getPresignedURL(mime_type: String!): PresignedResponse!
    getPdfUrl(key: String!): PresignedResponse!
    getSharedPDFs(owner_id:String!): [SharedPDF!]
    getOneSharedPdf(unique_address:String!):SharedPDF
    getSharedPdfUrl(pdf_id:String!):PresignedResponse!
  }

  type Mutation {
    uploadPDF(
      name: String!
      mime_type: String!
      user_id: String!
      key: String!
      size: Int!
    ): PDF!
    deletePDF(id: String!): Boolean!
    deleteFromS3(key: String!): Boolean!
    SharePDF(
      pdf_id:String!
      unique_address:String!
      owner_id:String!
      is_protected:Boolean!
      password:String
      is_onetime:Boolean!
      name:String!
    ): SharedPDF!
    deleteSharedPDF(unique_address:String
    pdf_id:String
    ):Boolean!
  }
`;

const resolvers = {
  Query: {
    getPdfById,
    getPDFs,
    getPresignedURL,
    getPdfUrl,
    getSharedPDFs,
    getOneSharedPdf,
    getSharedPdfUrl
  },
  Mutation: {
    uploadPDF,
    deletePDF,
    deleteFromS3,
    SharePDF,
    deleteSharedPDF
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = server.start();

function buildHeaders(origin: string) {
  const headers: Record<string, string> = {};

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
  headers["Access-Control-Allow-Headers"] =
    "Content-Type, Authorization, Credentials";
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers = buildHeaders(origin);

  return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers = buildHeaders(origin);

  try {
    await startServer;

    const { query, variables, operationName } = await req.json();

    const result = await server.executeOperation({
      query,
      variables,
      operationName,
    });

    const payload =
      result.body.kind === "single"
        ? result.body.singleResult
        : result.body;

    return NextResponse.json(payload, { headers });
  } catch (err: any) {
    return NextResponse.json(
      { errors: [{ message: err.message }] },
      { status: 500, headers }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "GraphQL API Running" });
}
