import { makeVar } from '@apollo/client'
import { MarketplaceERC20Item } from '../../types/MarketplaceTypes'
import { AssetERC20 } from '../../types/WalletTypes'

export const buyModalVar = makeVar<
  | {
      type: 'nft' | 'shares'
      item: MarketplaceERC20Item
    }
  | undefined
>(undefined)

export const buyModalLiquidityVar = makeVar<boolean>(false)

export const poolsRefreshingVar = makeVar<number | undefined>(undefined)

export const assetsModalMarketplaceVar = makeVar(false)

export const selectedAssetVar = makeVar<AssetERC20>({
  id: '1',
  name: 'Nftfy',
  symbol: 'NFTFY',
  address: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
  balance: '0',
  decimals: 18,
  imageUrl: ''
})

export const sortingFieldMarketplaceItemsVar = makeVar<'timestamp' | 'liquidity' | 'name'>('timestamp')
export const sortingDirectionMarketplaceItemsVar = makeVar<'asc' | 'desc'>('desc')
export const searchMarketPlaceVar = makeVar<string>('')
export const offsetMarketplaceVar = makeVar<number>(0)

// eslint-disable-next-line no-shadow
export enum MarketplaceFilter {
  all = 'all',
  liveAuction = 'liveAuction',
  sold = 'sold',
  boxes = 'boxes'
}

export const marketplaceFiltersVar = makeVar<MarketplaceFilter>(MarketplaceFilter.all)
