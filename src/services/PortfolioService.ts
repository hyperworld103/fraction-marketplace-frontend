import { WalletERC20Share } from '../types/WalletTypes'
import { TheGraphPeerToPeerService } from './PeerToPeerService'
import { zeroXQuoteService } from './QuoteService'
import { units } from './UtilService'

export const setPortfolioItemsLiquidity = async (erc20Shares: WalletERC20Share[], chainId: number): Promise<WalletERC20Share[]> => {
  const erc20ItemsWithLiquidity = erc20Shares.map(async (erc20ShareItem: WalletERC20Share) => {
    const midMarketPrice = await TheGraphPeerToPeerService(chainId).getTokensPairMarketPrice(
      erc20ShareItem.id,
      erc20ShareItem.paymentToken.id
    )

    if (!midMarketPrice || midMarketPrice === '0') {
      return {
        ...erc20ShareItem,
        liquidity: {
          hasLiquidity: false,
          priceDollar: ''
        }
      }
    }

    const amount = units(midMarketPrice, erc20ShareItem.paymentToken.decimals || 18)
    const paymentToken = erc20ShareItem.paymentToken.symbol === null ? 'ETH' : erc20ShareItem.paymentToken.id
    const quote = await zeroXQuoteService().quoteToStablecoin(paymentToken, amount, erc20ShareItem.paymentToken.decimals || 18, chainId)

    return {
      ...erc20ShareItem,
      liquidity: quote
    }
  })

  return Promise.all(erc20ItemsWithLiquidity)
}
