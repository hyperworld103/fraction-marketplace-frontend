interface Currency {
  id: string
  name: string
  symbol: string
  decimals: number
}

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
  boxItemCount: number | null
  tokenId: string
  tokenURI: string
  collection: Collection
}

interface Erc721 {
  id: string
  tokenId: string
  tokenURI: string
  collection: {
    id: string
    name: string
  }
}

interface Metadata {
  name?: string
  image?: string
  imageFull?: string
  description?: string
  animationType?: string
  animation_url?: string
  author?: string
  totalSupply?: string
}

export interface MarketplaceCollection {
  id: string
  address: string
  name: string
  item_count: number
  banner: string
  logo: string
}

export interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: string
  collection_id: string
  current_owner: string
  price: number
  media: string
  thumb: string
  metadata: string
  token_id: string
  external_link: string
  type: 'SET_PRICE' | 'AUCTION'
  status?: 'PAUSE_OR_OFFER' | 'OFFER' | 'AUCTION' | 'SOLD' | 'AUCTION_OR_SOLD'
}

export interface MarketplaceERC20ItemBid {
  id: string
  txId: string
  bidder: string
  reservePrice: string
  timestamp: number
}

export interface MarketplaceERC20Item {
  id: string
  name: string
  nftCount?: number
  target: Erc721
  symbol: string
  decimals: number
  exitPrice: string
  released: boolean
  paymentToken: Currency
  timestamp?: number
  sharePrice: string
  sharesCount: string
  totalSupply: string
  vaultBalance: string
  wrapper?: string
  holdersCount?: number
  type: 'SET_PRICE' | 'AUCTION'
  status?: 'PAUSE_OR_OFFER' | 'OFFER' | 'AUCTION' | 'SOLD' | 'AUCTION_OR_SOLD'
  liquidity?: {
    priceDollar: string
    hasLiquidity: boolean
  }
  metadata?: Metadata
  bids?: MarketplaceERC20ItemBid[]
  cutoff?: number
  minimumDuration?: number
}

export interface MarketplaceListERC20Item {
  amount: string
  cutoff: number | null
  id: string
  name: string
  paymentToken: PaymentToken
  reservePrice: string
  seller: string
  status: MarketplaceERC20ItemStatusEnum
  target: Target
  timestamp: number
  type: MarketplaceERC20ItemTypeEnum
  usersCount: number
  metadata?: Metadata
  extra: string | null
}

export interface ERC20Asset {
  id: string
  name: string
  symbol: string
  address: string
  decimals: number
  imageUrl: string
  locked?: boolean
}

// eslint-disable-next-line no-shadow
export enum MarketplaceERC20ItemStatusEnum {
  PAUSE_OR_OFFER = 'PAUSE_OR_OFFER',
  OFFER = 'OFFER',
  AUCTION = 'AUCTION',
  SOLD = 'SOLD',
  AUCTION_OR_SOLD = 'AUCTION_OR_SOLD',
  CREATED = 'CREATED',
  FUNDED = 'FUNDED',
  STARTED_OR_ENDING = 'STARTED_OR_ENDING',
  ENDING = 'ENDING',
  ENDED = 'ENDED'
}

// eslint-disable-next-line no-shadow
export enum MarketplaceERC20ItemTypeEnum {
  AUCTION = 'AUCTION',
  SET_PRICE = 'SET_PRICE',
  COLLECTIVE_PURCHASE = 'COLLECTIVE_PURCHASE'
}
