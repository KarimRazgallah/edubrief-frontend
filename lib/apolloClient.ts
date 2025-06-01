import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://edubrief-local.local/graphql",
  cache: new InMemoryCache(),
});

export default client;
