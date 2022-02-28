import { WalletErc721Item } from './WalletTypes'

interface PaymentToken {
  id: string
  decimals: number
  symbol: string
}

interface Collection {
  id: string
  name: string
  symbol: string
}

interface Target {
  id: string
  tokenId: string
  tokenURI: string
  collection: Collection
}
export interface Buyer {
  amount: string
  buyer: string
  fractionsCount: string
  ownership: string
}


export interface CollectiveBuyMarketplaceItem {
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
  status: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDING' | 'ENDED'
  target: Target
  timestamp: string
  boxCount?: number
  erc721?: WalletErc721Item
  name?: string
  symbol?: string
}

// eslint-disable-next-line no-shadow
export enum CollectiveBuyStatus {
  CREATED = 'CREATED',
  FUNDED = 'FUNDED',
  STARTING_OR_ENDING = 'STARTED_OR_ENDING',
  ENDING = 'ENDING',
  ENDED = 'ENDED'
}
