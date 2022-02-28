import { gql } from '@apollo/client'

export interface SellOrder {
  id: string
  owner: string
  price: string
  baseAmount: string
  quoteAmount: string
}

export interface GetSellOrdersPriceByMarketIdVars {
  marketId: string
}

interface OrderPrice {
  price: string
}

export interface GetSellOrdersPriceByMarketIdData {
  sellOrders: OrderPrice[]
}

export const GET_SELL_ORDERS_PRICE_BY_MARKET_ID_QUERY = gql`
  query GetSellOrderPriceByMarketId($marketId: String) {
    sellOrders(where: { market: $marketId, quoteAmount_gt: 0, baseAmount_gt: 0 }, orderBy: quoteAmount, orderDirection: desc) {
      price
    }
  }
`
