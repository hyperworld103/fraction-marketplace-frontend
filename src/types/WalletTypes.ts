interface Itype {
  name: string
}
interface metadata {
  author?: string
  description?: string
  image?:string
  imageFull?:string
  name?:string
  animation_url?: string
  asset_contract?: Itype
  social_media?:string
  web_site_url?:string
  twitter?: string
  telegram?:string
  discord?: string
  instagram?: string
  animationType?: string
  attributes?: []
}
 
export interface WalletErc721Item {
  tokenId: string
  cid: string
  metadata?:metadata
  ownerAddress?:string
  extension?: string
  address: string
  fee?: string
  boxAddress?: string
  fractions?: string
  fractionsCount?: string
  id?: string
  limitPrice?: string
  reservePrice?: string
  seller?: string
  cutoff?: number | null
  status?: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDING' | 'ENDED'
  timestamp?: string
  boxCount?: number
  name?: string
  symbol?: string
  animationType: string
  likes?: number
  views?: number
}

interface PaymentToken {
  id: string
  decimals?: number
  symbol: string
  address?: string
}
interface Collection {
  id: string
  name: string
  symbol?: string
}

interface Target {
  id: string
  tokenId: string
  tokenURI?: string
  collection?: Collection
}
interface Iliquidity {
  priceDollar: string
  hasLiquidity: boolean
}
export interface WalletERC20Share {
  metadata:metadata
  name?: string
  symbol?: string
  decimals: number
  id: string
  paymentToken: PaymentToken
  target: Target
  balance: string
  released: boolean
  cutoff?:number
  liquidity?:Iliquidity
  totalSupply:string
  exitPrice:string
  vaultBalance:string
}
export interface AssetERC20 {

  decimals:number
  address: string
  symbol: string
  balance: string
  id: string
  name: string
  imageUrl: string
  // paymentToken: PaymentToken
}
// eslint-disable-next-line no-shadow
export enum CollectiveBuyStatus {
  CREATED = 'CREATED',
  FUNDED = 'FUNDED',
  STARTING_OR_ENDING = 'STARTED_OR_ENDING',
  ENDING = 'ENDING',
  ENDED = 'ENDED'
}

export interface Balances {
  eth: number
  usdc: number
}
