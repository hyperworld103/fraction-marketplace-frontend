import { makeVar } from '@apollo/client'
import { WalletERC20Share } from '../../types/WalletTypes'

export const claimModalVar = makeVar<WalletERC20Share | undefined>(undefined)
