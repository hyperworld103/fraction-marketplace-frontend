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

export interface BoxByIdData {
  box: Box
}

export interface Items {
  box: Box
  collection: Collection
  id: string
  tokenId: string
  tokenURI: string
}

export interface BoxByIDVars {
  id: string
}

export const BOX_BY_ID_QUERY = gql`
  query GetBoxesById($id: String) {
    box(id: $id) {
      id
      tokenId
      owner
      tokenURI
      items {
        id
        tokenId
        tokenURI
        collection {
          id
          name
          symbol
        }
      }
      collection {
        id
        name
        symbol
      }
    }
  }
`
