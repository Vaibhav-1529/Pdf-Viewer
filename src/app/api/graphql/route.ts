// src/app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest, NextResponse } from "next/server";
import { createUser, getuserByToken, loginUser, logoutUser } from "@/services/resolver/user";
import { getPDFs, uploadPDF } from "@/services/resolver/pdf";

// === Allowed frontend domains ===
const allowedOrigins = [
  "https://pdf-viewer-ten-rouge.vercel.app",
  "https://pdf-viewer-dbt3d2fwe-vaibhav-1529s-projects.vercel.app",
  "https://pdf-viewer-qab3xkdh2-vaibhav-1529s-projects.vercel.app",
  // Add more Vercel deployment domains here
];

// === GraphQL schema ===
const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    username: String!
    password: String!
    avatar: String
  }

  type PDF {
    id: String!
    name: String!
    mimeType: String!
    data: String!
    createdAt: String!
    user: User!
    userId: String!
  }

  type Query {
    loginUser(email: String!, password: String!): User!
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
  }
`;

// === Resolvers ===
const resolvers = {
  Query: { loginUser, logoutUser, getPDFs, getuserByToken },
  Mutation: { createUser, uploadPDF },
};

// === Apollo Server ===
const server = new ApolloServer({ typeDefs, resolvers });

async function graphqlHandler(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {};

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  }

  // Preflight request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  // GraphQL POST
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { query, variables, operationName } = body;

      await server.start();
      const result = await server.executeOperation({ query, variables, operationName });

      return NextResponse.json(result, { headers });
    } catch (err: any) {
      console.error("GraphQL Error:", err);
      return NextResponse.json({ error: err.message }, { status: 500, headers });
    }
  }

  // GET health check
  if (req.method === "GET") {
    return NextResponse.json({ message: "GraphQL endpoint is running." }, { headers });
  }

  return new NextResponse("Method Not Allowed", { status: 405, headers });
}

export { graphqlHandler as POST, graphqlHandler as GET, graphqlHandler as OPTIONS };
