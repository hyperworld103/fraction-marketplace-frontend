import { gql } from '@apollo/client'

export interface Collection {
  id: string
  name: string
  symbol: string
}

export interface Box {
  collection: Collection
  id: string
  items: Items[]
  owner: string
  tokenId: string
  tokenURI: string
}

export interface BoxByOwnerData {
  boxes: Box[]
}
export interface Items {
  box: Box
  collection: Collection
  id: string
  tokenId: string
  tokenURI: string
}

export interface BoxByOwnerVars {
  owner: string
}

export const BOX_BY_OWNER_QUERY = gql`
  query GetBoxesByOwner($owner: String) {
    boxes(where: { owner: $owner }) {
      id
      owner
      collection {
        id
        name
        symbol
      }
      items {
        tokenId
        tokenURI
        collection {
          id
          name
        }
      }
      tokenURI
      tokenId
      tokenURI
    }
  }
`
