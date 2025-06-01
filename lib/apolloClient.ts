import { ApolloClient, InMemoryCache } from "@apollo/client";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://edubrief-local.local/graphql";

const client = new ApolloClient({
  uri: WORDPRESS_API_URL,
  cache: new InMemoryCache(),
});

export default client;
