import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
      uri: process.env.HASURA_URL
    }),
  cache: new InMemoryCache(),
  // headers: {
  //   "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
  // }
});
export default client;


