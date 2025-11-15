import { gql } from "graphql-request";

export const LOGIN_USER = gql`
  query LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      name
      email
      username
      avatar
    }
  }
`;

export const LOGOUT_USER = gql`
  query LogoutUser {
    logoutUser
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $username: String!
    $password: String!
    $avatar: String
  ) {
    createUser(
      name: $name
      email: $email
      username: $username
      password: $password
      avatar: $avatar
    ) {
      id
      name
      email
      username
      avatar
    }
  }
`;

export const GET_PDFS = gql`
  query GetPDFs($userId: String!) {
    getPDFs(userId: $userId) {
      id
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
    uploadPDF(name: $name, mimeType: $mimeType, data: $data, userId: $userId) {
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
  query GetUserByToken($userId: String!) {
    getuserByToken(userId: $userId) {
      id
      name
      email
      username
      avatar
    }
  }
`;
