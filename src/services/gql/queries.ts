import { gql } from "graphql-request";
export const LOGIN_USER = gql`
  query LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      email
      name
      id
      username
      avatar
    }
  }
`;
export const LOGOUT_USER = gql`
  query Query {
    logoutUser
  }
`;
export const CREATE_USER = gql`
  mutation Mutation(
    $name: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    createUser(
      name: $name
      email: $email
      username: $username
      password: $password
    ) {
      email
      id
      name
      avatar
      username
    }
  }
`;
export const GET_PDFS = gql`
  query GetPDFs($userId: String!) {
    getPDFs(userId: $userId) {
      name
      mimeType
      data
      createdAt
      userId
    }
  }
`;
export const UPLOAD_PDF = gql`
  mutation UploadPDF(
    $name: String!
    $mimeType: String!
    $data: String!
    $userId: String!
  ) {
    uploadPDF(
      name: $name
      mimeType: $mimeType
      data: $data
      userId: $userId
    ) {
      id
      name
      mimeType
      data
      createdAt
      userId
    }
  }
`;

export const GET_USER_BY_TOKEN = gql`
query Query($userId: String!) {
  getuserByToken(userId: $userId) {
    avatar
    email
    id
    name
    username
  }
} `;