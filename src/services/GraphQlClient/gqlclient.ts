import { GraphQLClient } from "graphql-request";

const graphqlClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`);

export default graphqlClient;
