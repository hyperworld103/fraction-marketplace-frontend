import { makeVar } from '@apollo/client'

// eslint-disable-next-line no-shadow
export enum ListingStatus {
  STARTED_OR_ENDING = 'STARTED_OR_ENDING',
  CREATED = 'CREATED',
  FUNDED = 'FUNDED',
  ENDED = 'ENDED'
}

export const removeParticipationModalVar = makeVar<boolean>(false)
export const acceptOfferModalVar = makeVar<boolean>(false)
export const successParticipationModalVar = makeVar<boolean>(false)
export const successRemovedParticipationModalVar = makeVar<boolean>(false)
export const successAcceptOfferModalVar = makeVar<boolean>(false)
export const successSellModalVar = makeVar<string | undefined>(undefined)
export const successClaimModalVar = makeVar<boolean>(false)
