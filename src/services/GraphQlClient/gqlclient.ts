import { GraphQLClient } from "graphql-request";

const graphqlClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`);

export default graphqlClient;
