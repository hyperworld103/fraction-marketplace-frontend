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
  timestamp: number
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

export interface FracsVarsV1 {
  name: string
  orderField: string
  orderDirection: string
  released: boolean
  first?: number
  skip?: number
}

export interface FracsDataV1 {
  fracs: Frac[]
}

export const FRACS_QUERY_V1 = gql`
  query GetMarketplaceItems($orderField: Frac_orderBy, $orderDirection: OrderDirection, $name: String = "", $released: Boolean = false) {
    fracs(
      where: { released: $released, name_contains: $name }
      orderBy: $orderField
      orderDirection: $orderDirection
      first: 100
      skip: 0
    ) {
      id
      timestamp
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
      sharePrice
      exitPrice
      paymentToken {
        id
        name
        symbol
        decimals
      }
      released
    }
  }
`
