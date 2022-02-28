import { gql } from '@apollo/client'

export interface BuyOrder {
  id: string
  owner: string
  price: string
  baseAmount: string
  quoteAmount: string
}

export interface GetBuyOrdersPriceByMarketIdVars {
  marketId: string
}

interface OrderPrice {
  price: string
}

export interface GetBuyOrdersPriceByMarketIdData {
  buyOrders: OrderPrice[]
}

export const GET_BUY_ORDERS_PRICE_BY_MARKET_ID_QUERY = gql`
  query GetBuyOrderPriceByMarketId($marketId: String) {
    buyOrders(where: { market: $marketId, quoteAmount_gt: 0, baseAmount_gt: 0 }, orderBy: quoteAmount, orderDirection: asc) {
      price
    }
  }
`
