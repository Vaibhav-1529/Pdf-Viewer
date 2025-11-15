// src/app/api/graphql/route.ts
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
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
  Query: {
    loginUser,
    logoutUser,
    getPDFs,
    getuserByToken,
  },
  Mutation: {
    createUser,
    uploadPDF,
  },
};

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export GET and POST using the Next.js App Router handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

// App Router requires export functions
export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
