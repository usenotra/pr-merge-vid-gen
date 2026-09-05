import { GITHUB_SEARCH_PAGE_SIZE } from "@/constants/pr-merge-video"

export const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export const HTTP_UNAUTHORIZED = 401

export const USER_AGENT = "pr-merge-vid-gen"

export const PR_MERGE_QUERY = `
  query PrMerges(
    $owner: String!
    $repo: String!
    $queryString: String!
    $after: String
  ) {
    repository(owner: $owner, name: $repo) {
      name
      nameWithOwner
      url
      isPrivate
    }
    search(
      query: $queryString
      type: ISSUE
      first: ${GITHUB_SEARCH_PAGE_SIZE}
      after: $after
    ) {
      issueCount
      nodes {
        ... on PullRequest {
          mergedAt
          mergedBy {
            __typename
            login
            avatarUrl(size: 280)
            ... on User {
              name
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`
