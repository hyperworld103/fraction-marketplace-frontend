import { gql } from '@apollo/client'

export interface FracByIdWithUserFracsVarsV2 {
  id: string
}

interface UserFrac {
  id: string
}

export interface FracByIdWithUserFracsDataV2 {
  frac: {
    userFracs: UserFrac[]
  }
}

export const FRAC_BY_ID_WITH_USER_FRACS_QUERY_V2 = gql`
  query FracByIdWithUserFracs($id: ID!) {
    frac(id: $id) {
      userFracs {
        id
      }
    }
  }
`
