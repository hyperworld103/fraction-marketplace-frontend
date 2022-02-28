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
interface PaymentToken {
  id: string
  symbol: string
  decimals: number
}

export interface NftBoxItems {
  address: string
  tokenId: string
  image_url:string
  // fee: string
  // fractions: string
  // fractionsCount: string
  // id: string
  // paymentToken: PaymentToken
  // target: Target
  boxCount?: number
  erc721?: WalletErc721Item
  name: string
  symbol?: string
  loading: boolean
  title: string
}

export interface BoxAsset {
  nftCount: number,
  boxAddress: string,
  boxId: number
  image: string
  nfts: NftBoxItems[]
  name: string
  ownerOf: string
  description: string
  web_site_url: string
  twitter: string
  telegram: string
  discord: string
  instagram: string
  author:string
  social_media: string

}
interface metadata {
  name?: string
  image?: string
  imageFull?: string
  description?: string
  animationType?: string
  animation_url?: string
  author?: string
  totalSupply?: string
}
export interface WalletErc721ItemModal {
  tokenId: string
  loading: boolean
  disabled: boolean
  ownerAddress?: string
  extension?: string
  address: string
  fee?: string
  boxAddress?: string
  fractions?: string
  symbol?: string
  metadata?: metadata
  name?: string
  fractionsCount?: string
  id?: string
  limitPrice?: string
  reservePrice?: string
  seller?: string
  cutoff?: number | null
  status?: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDING' | 'ENDED'
  timestamp?: string
  boxCount?: number
}

