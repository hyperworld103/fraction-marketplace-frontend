import { gql } from '@apollo/client'

interface Collection {
  id: string
  name: string
  symbol: string
}

interface Target {
  id: string
  collection: Collection
  tokenId: string
  tokenURI: string
}

interface Buyers {
  amount: string
  buyer: string
  fractionsCount: string
  ownership: string
}

interface PaymentToken {
  id: string
  symbol: string
  decimals: number
}
interface Listing {
  amount: string
  extension: string
  fee: string
  fractions: string
  fractionsCount: string
  id: string
  limitPrice: string
  paymentToken: PaymentToken
  reservePrice: string
  cutoff: number | null
  buyers: Buyers[]
  seller: string
  status: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDING' | 'ENDED'
  target: Target
  timestamp: string
}

export interface ActiveListingByStatusVar {
  status_in: string[]
  first?: number
}

export interface ActiveListingByStatusData {
  listings: Listing[]
}

export const ACTIVE_LISTING_BY_STATUS_QUERY = gql`
  query GetListingItems($status_in: [String], $first: Int = 16) {
    listings(where: { status_in: $status_in }, orderBy: "status", orderDirection: "desc", first: $first) {
      id
      cutoff
      seller
      limitPrice
      extension
      reservePrice
      timestamp
      fee
      fractions
      fractionsCount
      amount
      status
      buyers {
        amount
        buyer
        fractionsCount
        id
        ownership
      }
      paymentToken {
        id
        symbol
        decimals
      }
      target {
        tokenId
        tokenURI
        collection {
          id
          name
          symbol
        }
      }
    }
  }
`
