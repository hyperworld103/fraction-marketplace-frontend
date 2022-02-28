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

interface PaymentToken {
  id: string
  symbol: string
  decimals: number
}

interface Buyer {
  amount: string
  buyer: string
  fractionsCount: string
  ownership: string
}

interface Listing {
  amount: string
  extension: string
  extra: string
  fee: string
  fractions: string
  fractionsCount: string
  id: string
  limitPrice: string
  paymentToken: PaymentToken
  cutoff: number | null
  reservePrice: string
  seller: string
  buyers: Buyer[]
  status: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDING' | 'ENDED'
  target: Target
  timestamp: string
}

export interface MarketplaceListingByIdVars {
  id: string
}

export interface MarketplaceListingByIdData {
  listing: Listing
}

export const MARKETPLACE_LISTING_BY_ID_QUERY = gql`
  query GetItemById($id: ID!) {
    listing(id: $id) {
      id
      seller
      limitPrice
      extension
      extra
      reservePrice
      timestamp
      fee
      fractions
      fractionsCount
      amount
      status
      cutoff
      buyers(first: 2, orderBy: id, orderDirection: desc) {
        amount
        buyer
        fractionsCount
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
