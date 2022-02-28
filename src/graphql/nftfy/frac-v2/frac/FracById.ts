import { gql } from '@apollo/client'

export interface Collection {
  id: string
  name: string
}

export interface Currency {
  id: string
  name: string
  symbol: string
  decimals: number
}

export interface Nft {
  id: string
  collection: Collection
  tokenId: string
  tokenURI: string
}

export interface Frac {
  id: string
  name: string
  cutoff: number
  minimumDuration: number
  target: Nft
  symbol: string
  decimals: number
  fractionPrice: string
  reservePrice: string
  released: boolean
  paymentToken: Currency
  fractionsCount: string
  totalSupply: string
  vaultBalance: string
  type: 'SET_PRICE' | 'AUCTION'
  status: 'PAUSE_OR_OFFER' | 'OFFER' | 'AUCTION' | 'AUCTION_OR_SOLD'
}

export interface FracByIdVarsV2 {
  id: string
}

export interface FracByIdDataV2 {
  frac: Frac
}

// TODO: Add again the type field
export const FRAC_BY_ID_QUERY_V2 = gql`
  query GetMarketplaceItemById($id: ID!) {
    frac(id: $id) {
      id
      name
      type
      target {
        id
        collection {
          id
          name
        }
        tokenId
        tokenURI
      }
      symbol
      decimals
      fractionsCount
      fractionPrice
      reservePrice
      paymentToken {
        id
        name
        symbol
        decimals
      }
      released
      totalSupply
      vaultBalance
      bids(orderBy: timestamp, orderDirection: desc) {
        id
        txId
        bidder
        reservePrice
        timestamp
      }
      minimumDuration
      cutoff
    }
  }
`
