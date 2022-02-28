import { makeVar } from '@apollo/client'
import { AssetERC20 } from '../../types/WalletTypes'

export const selectPaymentTokenModalVar = makeVar(false)
export const selectPaymentTokenModalLoadingVar = makeVar(false)
export const paymentTokenVar = makeVar<AssetERC20>({
  id: '1',
  name: 'mytoken',
  symbol: 'MTK',
  address: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
  balance: '0',
  decimals: 18,
  imageUrl: ''
})
