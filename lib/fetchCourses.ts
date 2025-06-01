import { gql } from "@apollo/client";
import client from "./apolloClient";

export async function fetchCourses() {
  const { data } = await client.query({
    query: gql`
      query {
        courses {
          nodes {
            id
            databaseId
            title
            courses {
              difficulty
              duration
              tags
            }
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return data.courses.nodes;
}
