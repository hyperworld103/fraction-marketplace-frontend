import { gql } from '@apollo/client'

export interface CurrencyAssetByIdVars {
  id: string
}

export interface CurrencyAssetByIdData {
  currency: {
    id: string
    name: string
    symbol: string
    decimals: number
  }
}

export const CURRENCY_ASSET_BY_ID_QUERY = gql`
  query CurrencyAssetById($id: ID!) {
    currency(id: $id) {
      id
      name
      symbol
      decimals
    }
  }
`
