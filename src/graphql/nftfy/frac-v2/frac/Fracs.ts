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
  fractionPrice: string
  reservePrice: string
  released: boolean
  paymentToken: Currency
  fractionsCount: string
  totalSupply: string
  vaultBalance: string
  cutoff: number
  minimumDuration: number
  type?: 'SET_PRICE' | 'AUCTION'
  status: 'PAUSE_OR_OFFER' | 'OFFER' | 'AUCTION' | 'AUCTION_OR_SOLD'
}

export interface FracsVarsV2 {
  name: string
  orderField: string
  orderDirection: string
  released: boolean
  first?: number
  skip?: number
  target_contains?: string
  status_contains?: string
  type_contains?: string
  cutoff_lt?: number
  cutoff_gte?: number
}

export interface FracsDataV2 {
  fracs: Frac[]
}

// TODO: Add again the type field
export const FRACS_QUERY_V2 = gql`
  query GetMarketplaceItems(
    $orderField: Frac_orderBy
    $orderDirection: OrderDirection
    $name: String = ""
    $released: Boolean = false
    $first: Int = 16
    $skip: Int = 0
    $target_contains: String = ""
    $status_contains: String = ""
    $type_contains: String = ""
  ) {
    fracs(
      where: {
        name_contains: $name
        target_contains: $target_contains
        status_contains: $status_contains
        type_contains: $type_contains
        released: $released
      }
      orderBy: $orderField
      orderDirection: $orderDirection
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      name
      type
      status
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
      fractionPrice
      reservePrice
      paymentToken {
        id
        name
        symbol
        decimals
      }
      cutoff
      minimumDuration
      bids(orderBy: timestamp, orderDirection: desc) {
        reservePrice
      }
      released
    }
  }
`

export const FRACS_QUERY_V2_FILTER_BY_AUCTION_SOLD = gql`
  query GetMarketplaceItems(
    $orderField: Frac_orderBy
    $orderDirection: OrderDirection
    $name: String = ""
    $cutoff_lt: Int = 0
    $released: Boolean = false
    $first: Int = 16
    $skip: Int = 0
  ) {
    fracs(
      where: { name_contains: $name, released: $released, cutoff_lt: $cutoff_lt }
      orderBy: $orderField
      orderDirection: $orderDirection
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      name
      type
      status
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
      fractionPrice
      reservePrice
      paymentToken {
        id
        name
        symbol
        decimals
      }
      cutoff
      minimumDuration
      bids(orderBy: timestamp, orderDirection: desc) {
        reservePrice
      }
      released
    }
  }
`

export const FRACS_QUERY_V2_FILTER_BY_LIVE_AUCTION_SOLD = gql`
  query GetMarketplaceItems(
    $orderField: Frac_orderBy
    $orderDirection: OrderDirection
    $name: String = ""
    $cutoff_gte: Int = 0
    $released: Boolean = false
    $first: Int = 16
    $skip: Int = 0
  ) {
    fracs(
      where: { name_contains: $name, released: $released, cutoff_gte: $cutoff_gte }
      orderBy: $orderField
      orderDirection: $orderDirection
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      name
      type
      status
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
      fractionPrice
      reservePrice
      paymentToken {
        id
        name
        symbol
        decimals
      }
      cutoff
      minimumDuration
      bids(orderBy: timestamp, orderDirection: desc) {
        reservePrice
      }
      released
    }
  }
`
