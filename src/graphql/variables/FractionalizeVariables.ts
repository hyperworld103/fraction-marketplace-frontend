import { makeVar } from '@apollo/client'
import { AssetERC20 } from '../../types/WalletTypes'

export const selectPaymentTokenModalVar = makeVar(false)
export const selectPaymentTokenModalLoadingVar = makeVar(false)
export const paymentTokenVar = makeVar<AssetERC20>({
  id: '2',
  name: 'Ether',
  symbol: 'ETH',
  address: '0x0000000000000000000000000000000000000000',
  balance: '0',
  decimals: 18,
  imageUrl: ''
})
