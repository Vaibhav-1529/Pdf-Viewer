// src/app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest, NextResponse } from "next/server";
import { createUser, getuserByToken, loginUser, logoutUser } from "@/services/resolver/user";
import { getPDFs, uploadPDF } from "@/services/resolver/pdf";

// === CORS headers ===
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // For production, replace * with your frontend URL
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

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

// === Main handler with CORS support ===
async function graphqlHandler(req: NextRequest) {
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  // Handle POST (GraphQL requests)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { operationName, query, variables } = body;

      // Ensure Apollo server is started
      await server.start();
      const result = await server.executeOperation({ query, variables, operationName });

      const res = NextResponse.json(result, { headers: corsHeaders });
      return res;
    } catch (error: any) {
      console.error("GraphQL Error:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // Handle GET (health check)
  if (req.method === "GET") {
    return new NextResponse(JSON.stringify({ message: "GraphQL endpoint is running." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Method not allowed
  return new NextResponse("Method Not Allowed", { status: 405, headers: corsHeaders });
}

// Export for App Router
export { graphqlHandler as POST, graphqlHandler as GET, graphqlHandler as OPTIONS };
