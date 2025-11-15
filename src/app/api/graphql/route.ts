// src/app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest, NextResponse } from "next/server";
import { createUser, getuserByToken, loginUser, logoutUser } from "@/services/resolver/user";
import { getPDFs, uploadPDF } from "@/services/resolver/pdf";

// GraphQL Schema
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

// Resolvers
const resolvers = {
  Query: { loginUser, logoutUser, getPDFs, getuserByToken },
  Mutation: { createUser, uploadPDF },
};

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Handler function for App Router with CORS
async function graphqlHandler(req: NextRequest) {
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Only handle POST requests for GraphQL
  if (req.method === "POST") {
    const body = await req.json();
    const { operationName, query, variables } = body;

    await server.start(); // ensure Apollo server is started
    const result = await server.executeOperation({ query, variables, operationName });

    const res = NextResponse.json(result);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res;
  }

  // Fallback GET request for health check
  if (req.method === "GET") {
    const res = NextResponse.json({ message: "GraphQL endpoint is running." });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  // Method not allowed
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export { graphqlHandler as POST, graphqlHandler as GET, graphqlHandler as OPTIONS };
