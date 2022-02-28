import { gql } from '@apollo/client'

interface Listing {
  id: string
}

export interface ActiveListingIdByTargetVars {
  target: string
}

export interface ActiveListingIdByTargetData {
  listings: Listing[]
}

export const ACTIVE_LISTING_ID_BY_TARGET_QUERY = gql`
  query GetSoldItem($target: String) {
    listings(where: { target: $target, status: "CREATED" }) {
      id
    }
  }
`
