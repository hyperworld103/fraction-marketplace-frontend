import { gql } from '@apollo/client'

export interface NftByWalletVar {
  owner: string
}

export interface NftData {
  id: string
  owner: string
  collection: {
    id: string
    name: string
    symbol: string
  }
  tokenId: string
  tokenURI: string
}

export interface NftByWalletData {
  nfts: NftData[]
}

export const NFTS_BY_WALLET_QUERY = gql`
  query NftByWallet($owner: Bytes) {
    nfts(where: { owner: $owner }) {
      id
      owner
      collection {
        id
        name
        symbol
      }
      tokenId
      tokenURI
    }
  }
`
