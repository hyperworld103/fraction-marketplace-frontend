import { gql } from '@apollo/client'

interface Buyer {
  amount: string
  buyer: string
  fractionsCount: string
  ownership: string
}

interface Listing {
  buyers: Buyer[]
}

export interface ListingBuyersVars {
  id: string
}

export interface ListingBuyersData {
  listing: Listing
}

export const LISTING_BUYERS_QUERY = gql`
  query GetBuyersByListing($id: ID!) {
    listing(id: $id) {
      buyers {
        buyer
        amount
        fractionsCount
        ownership
      }
    }
  }
`
