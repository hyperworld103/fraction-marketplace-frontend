import { makeVar } from '@apollo/client'
import { MarketplaceERC20Item } from '../../types/MarketplaceTypes'

export const placeBidModalVar = makeVar<MarketplaceERC20Item | undefined>(undefined)
