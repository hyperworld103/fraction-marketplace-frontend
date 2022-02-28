import { gql } from '@apollo/client'
import { NftData } from '../wallet/nftsByWallet'

export interface NftByAddressVar {
  id: string
}

export interface NftByAddressData {
  nft: NftData
}

export const NFT_BY_ADDRESS_QUERY = gql`
  query NftByWallet($id: ID) {
    nft(id: $id) {
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
