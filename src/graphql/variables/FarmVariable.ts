import { makeVar } from '@apollo/client'

export const stakeModalVar = makeVar<'stake' | 'unstake' | undefined>(undefined)
