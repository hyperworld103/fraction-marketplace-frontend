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
  target: Nft
  symbol: string
  decimals: number
  sharePrice: string
  exitPrice: string
  released: boolean
  paymentToken: Currency
  sharesCount: string
  totalSupply: string
  vaultBalance: string
}

export interface FracByIdVarsV1 {
  id: string
}

export interface FracByIdDataV1 {
  frac: Frac
}

export const FRAC_BY_ID_QUERY_V1 = gql`
  query GetMarketplaceItemById($id: ID!) {
    frac(id: $id) {
      id
      name
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
      sharesCount
      sharePrice
      exitPrice
      paymentToken {
        id
        name
        symbol
        decimals
      }
      released
      totalSupply
      vaultBalance
    }
  }
`
