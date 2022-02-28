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

export interface ListingBuyersByAddressVars {
  id: string
  account: string
}

export interface ListingBuyersByAddressData {
  listing: Listing
}

export const LISTING_BUYERS_BY_ADDRESS_QUERY = gql`
  query GetBuyersByListing($id: ID!, $account: String) {
    listing(id: $id) {
      buyers(where: { buyer: $account }) {
        buyer
        amount
        fractionsCount
        ownership
      }
    }
  }
`
