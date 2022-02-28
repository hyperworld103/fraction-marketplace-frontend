import axios from 'axios'
import BigNumber from 'bignumber.js'
import { now } from 'lodash'
import Web3 from 'web3'
import { getChainConfigById } from '../config'
import { coins, units } from './UtilService'

interface QuoteService {
  quoteToStablecoin(erc20Address: string, erc20Amount: string, erc20Decimals: number, chainId: number): Promise<QuoteStablecoinPrice>
}

interface QuoteStablecoinPrice {
  hasLiquidity: boolean
  priceDollar: string
  createdAt: number
}

interface ZeroXResponse {
  data: { price: string }
}

export const zeroXQuoteService = (): QuoteService => {
  return {
    async quoteToStablecoin(
      erc20Address: string,
      erc20Amount: string,
      erc20Decimals: number,
      chainId: number
    ): Promise<QuoteStablecoinPrice> {
      try {
        const { zeroXBaseUrl, stableCoinAddress, ethAddress } = getChainConfigById(chainId)
        const address = erc20Address === ethAddress || erc20Address === '' ? 'ETH' : erc20Address

        const getCachedQuotation = (): QuoteStablecoinPrice | undefined => {
          const cachedQuoteJSON = localStorage.getItem(`${erc20Address}-${stableCoinAddress}`)

          if (!cachedQuoteJSON) {
            return undefined
          }

          const cachedQuote: QuoteStablecoinPrice = JSON.parse(cachedQuoteJSON)

          const ageInMinutes = (now() - cachedQuote.createdAt) / 1000 / 60

          if (ageInMinutes > 5) {
            localStorage.removeItem(`${erc20Address}-${stableCoinAddress}`)
            return undefined
          }

          return cachedQuote
        }

        const cachedQuotation = getCachedQuotation()

        if (cachedQuotation) {
          return {
            ...cachedQuotation,
            priceDollar: new BigNumber(cachedQuotation.priceDollar)
              .multipliedBy(coins(erc20Amount, erc20Decimals))
              .toNumber()
              .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }

        if (erc20Amount === '' || erc20Amount === 'NaN') {
          return {
            hasLiquidity: false,
            priceDollar: '',
            createdAt: now()
          }
        }

        if (erc20Address === Web3.utils.toChecksumAddress(stableCoinAddress)) {
          return {
            hasLiquidity: true,
            priceDollar: '1',
            createdAt: now()
          }
        }

        const quoteDollar = await axios.get<string, ZeroXResponse>(
          `${zeroXBaseUrl}/swap/v1/quote?buyToken=${address}&sellToken=${stableCoinAddress}&buyAmount=${units('1', erc20Decimals)}`
        )

        const itemLiquidity = {
          hasLiquidity: true,
          priceDollar: quoteDollar.data.price,
          createdAt: now()
        }

        localStorage.setItem(`${erc20Address}-${stableCoinAddress}`, JSON.stringify(itemLiquidity))

        return {
          ...itemLiquidity,
          priceDollar: new BigNumber(itemLiquidity.priceDollar)
            .multipliedBy(coins(erc20Amount, erc20Decimals))
            .toNumber()
            .toLocaleString('en', { maximumFractionDigits: 2 })
        }
      } catch (error) {
        return { hasLiquidity: false, priceDollar: '', createdAt: now() }
      }
    }
  }
}
