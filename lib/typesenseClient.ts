import Typesense from "typesense";

// You may want to move this config to an env var or API route for security
const TYPESENSE_HOST = process.env.NEXT_PUBLIC_TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = process.env.NEXT_PUBLIC_TYPESENSE_PORT || "8108";
const TYPESENSE_PROTOCOL = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http";
const TYPESENSE_API_KEY = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || "xyz"; // Use a search-only key!

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: TYPESENSE_PORT,
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

export default typesenseClient;
