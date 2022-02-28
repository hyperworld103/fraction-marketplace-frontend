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

export interface Buyer {
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
  seller: string
  cutoff: number | null
  buyers: Buyer[]
  status: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDED'
  target: Target
  timestamp: string
}

export interface MarketplaceListingStartingStatusVar {
  cutoff_gt: number
  first?: number
}

export interface MarketplaceListingStartingStatusData {
  listings: Listing[]
}

export const MARKETPLACE_LISTING_STARTING_STATUS_QUERY = gql`
  query GetListingItems($cutoff_gt: Int = 0, $first: Int = 16) {
    listings(where: { cutoff_gt: $cutoff_gt }, first: $first) {
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
