import { ApolloServer } from "@apollo/server";
import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-tag";
import {
  createUser,
  loginUser,
  logoutUser,
  getuserByToken,
} from "@/services/resolver/user";
import { deletePDF, getPDFs, uploadPDF } from "@/services/resolver/pdf";
const allowedOrigins = [
  "http://localhost:3000",
  "https://pdf-viewer-ten-rouge.vercel.app",
  "https://pdf-viewer-dbt3d2fwe-vaibhav-1529s-projects.vercel.app",
  "https://pdf-viewer-qab3xkdh2-vaibhav-1529s-projects.vercel.app",
];
const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    username: String!
    avatar: String
  }

  type PDF {
    id: String!
    name: String!
    mimeType: String!
    data: String!
    createdAt: String!
    userId: String!
  }

  type Query {
    loginUser(email: String!, password: String!): User
    logoutUser: Boolean!
    getPDFs(userId: String!): [PDF!]!
    getuserByToken(userId: String!): User
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      username: String!
      password: String!
      avatar: String
    ): User!

    uploadPDF(
      name: String!
      mimeType: String!
      data: String!
      userId: String!
    ): PDF!
    deletePDF(id: String!): Boolean!
  }
`;

const resolvers = {
  Query: {
    loginUser,
    logoutUser,
    getPDFs,
    getuserByToken,
  },
  Mutation: {
    createUser,
    uploadPDF,
    deletePDF,
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = server.start();
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {};

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  }

  try {
    await startServer;

    const { query, variables, operationName } = await req.json();

    const result = await server.executeOperation({
      query,
      variables,
      operationName,
    });
const payload = result.body.kind === "single" ? result.body.singleResult : result.body;

return NextResponse.json(payload, { headers });
  } catch (err: any) {
    console.error("GraphQL Error:", err);
    return NextResponse.json(
      { errors: [{ message: err.message }] },
      { status: 500, headers }
    );
  }
}
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {};

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  }

  return new NextResponse(null, { status: 204, headers });
}
export async function GET() {
  return NextResponse.json({ status: "GraphQL API Running" });
}
