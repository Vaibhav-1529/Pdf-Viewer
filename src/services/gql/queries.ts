import { gql } from "graphql-request";

export const GET_PDFS = gql`
  query Query($user_id: String!) {
  getPDFs(user_id: $user_id) {
    id
    name
    mime_type
    created_at
    key
    user_id
    size
  }
}
`;

export const GET_PDF_BY_ID = gql`
  query Query($id: String!) {
  getPdfById(id: $id) {
    id
    name
    mime_type
    created_at
    key
    user_id
    size
  }
}
`;

export const UPLOAD_PDF = gql`
  mutation Mutation(
    $name: String!
    $mime_type: String!
    $user_id: String!
    $key: String!
    $size: Int!
  ) {
    uploadPDF(
      name: $name
      mime_type: $mime_type
      user_id: $user_id
      key: $key
      size: $size
    ) {
      id
      name
      mime_type
      created_at
      key
      user_id
      size
    }
  }
`;
export const DELETE_PDF = gql`
  mutation DeletePDF($id: String!) {
  deletePDF(id: $id)
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
export const GET_PRESIGNED_URL = gql`
  query GetPresignedURL($mime_type: String!) {
    getPresignedURL(mime_type: $mime_type) {
      key
      url
    }
  }
`;
export const GET_PDF_URL = gql`
  query GetPdfUrl($key: String!) {
    getPdfUrl(key: $key) {
      url
      key
    }
  }
`;
export const DELETE_PDF_FROM_S3 = gql`
  mutation Mutation($key: String!) {
    deleteFromS3(key: $key)
  }
`;
export const SHARE_PDF = gql`
mutation Mutation($pdf_id: String!, $unique_address: String!, $owner_id: String!, $is_protected: Boolean!,$password: String,$is_onetime:Boolean!,$name:String!) {
  SharePDF(pdf_id: $pdf_id, unique_address: $unique_address, owner_id: $owner_id, is_protected: $is_protected,password:$password,is_onetime:$is_onetime,name:$name) {
    id
    name
    created_at
    pdf_id
    owner_id
    unique_address
    is_protected
    password
    is_onetime
  }
}
`
export const GET_SHARED_PDFS = gql`
  query Query($owner_id: String!) {
  getSharedPDFs(owner_id: $owner_id) {
    id
    name
    created_at
    pdf_id
    owner_id
    unique_address
    is_protected
    password
    is_onetime
  }
}`
export const GET_ONE_SHARED_PDFS = gql`
  query Query($unique_address: String!) {
  getOneSharedPdf(unique_address: $unique_address) {
    id
    name
    created_at
    pdf_id
    owner_id
    unique_address
    is_protected
    password
    is_onetime
  }
}`
export const GET_SHARED_PDF_URL = gql`
query GetSharedPdfUrl($pdf_id: String!) {
  getSharedPdfUrl(pdf_id: $pdf_id) {
    url
    key
  }
} 
`
export const DELETE_SHARED_PDF = gql`
mutation Mutation($unique_address: String,$pdf_id:String) {
  deleteSharedPDF(unique_address: $unique_address,pdf_id:$pdf_id)
}
`
