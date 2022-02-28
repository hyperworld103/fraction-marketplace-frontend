import { gql } from '@apollo/client'

export interface Currency {
  id: string
  name: string
  symbol: string
  decimals: number
}

export interface BuyOrder {
  id: string
  owner: string
  price: string
  baseAmount: string
  quoteAmount: string
}

export interface SellOrder {
  id: string
  owner: string
  price: string
  baseAmount: string
  quoteAmount: string
}

export interface Trade {
  id: string
  side: 'BUY' | 'SELL'
  orderId: string
  maker: string
  taker: string
  price: number
  baseAmount: string
  quoteAmount: string
  baseFeeAmount: string | null
  quoteFeeAmount: string | null
  market: {
    baseCurrency: {
      id: string
    }
    quoteCurrency: {
      id: string
    }
  }
  timestamp: string
}

export interface GetMarketByIdVars {
  id: string
}

export interface GetMarketByIdData {
  market: {
    bids: BuyOrder[]
    asks: SellOrder[]
    trades: Trade[]
  }
}

export const GET_MARKET_BY_ID_QUERY = gql`
  query MarketById($id: ID!) {
    market(id: $id) {
      bids(where: { baseAmount_gt: 0, quoteAmount_gt: 0 }, orderBy: quoteAmount, orderDirection: asc) {
        id
        price
        baseAmount
        quoteAmount
        owner
        price
      }
      asks(where: { baseAmount_gt: 0, quoteAmount_gt: 0 }, orderBy: quoteAmount, orderDirection: desc) {
        id
        price
        baseAmount
        quoteAmount
        owner
        price
      }
      trades {
        id
        orderId
        market {
          baseCurrency {
            id
          }
          quoteCurrency {
            id
          }
        }
        side
        maker
        taker
        price
        baseAmount
        baseFeeAmount
        quoteAmount
        quoteFeeAmount
        timestamp
      }
    }
  }
`
