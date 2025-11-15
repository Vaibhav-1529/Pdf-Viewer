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

// Start the server (App Router compatible)
const handler = server.start().then(() => {
  return async (req: NextRequest) => {
    const body = await req.json();
    const { operationName, query, variables } = body;

    const result = await server.executeOperation({ query, variables, operationName });
    return NextResponse.json(result);
  };
});

export async function POST(req: NextRequest) {
  const h = await handler;
  return h(req);
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "GraphQL endpoint is running." });
}
