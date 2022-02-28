import { useCallback, useEffect, useState } from 'react'
import { MarketplaceFilter } from '../graphql/variables/MarketplaceVariable'
import { marketplaceService } from '../services/MarketplaceService'
import { MarketplaceERC20Item } from '../types/MarketplaceTypes'
import { useChainConfig } from './ConfigHook'

export function useMarketplaceNfts(  
  marketplaceFilter: MarketplaceFilter,
  sortingDirection: 'asc' | 'desc',
  sortingField: 'timestamp' | 'liquidity' | 'name',
  paginationLimit: number,
  collection_id = '',
  offSetParams = 0
) {
  const [nfts, setNfts] = useState<MarketplaceERC20Item[]>([])
  const [offset, setOffset] = useState(offSetParams)
  const [loading, setLoading] = useState(false)
  const [incomplete, setIncomplete] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fracApiVersion, setFracApiVersion] = useState<1 | 2>(2)
  const { chainId, marketplaceBlacklist } = useChainConfig()

  const setFilteredNfts = useCallback(
    (items: MarketplaceERC20Item[]) => {
      const filteredItems: MarketplaceERC20Item[] =
        chainId && marketplaceBlacklist ? items.filter(item => !marketplaceBlacklist.includes(item.id)) : items
      setNfts(filteredItems)
    },
    [marketplaceBlacklist, chainId]
  )

  const addItems = useCallback(
    (nftItems: MarketplaceERC20Item[]) => {
      setFilteredNfts(nfts.concat(nftItems))
    },
    [nfts, setFilteredNfts]
  )

  useEffect(() => {
    if (chainId && marketplaceFilter) {
      const getInitialNfts = async () => {
        setLoading(true)
        setHasMore(true)
        const nftItems = await marketplaceService(chainId, 2).getMarketplaceItems(
          sortingDirection,
          sortingField,
          paginationLimit,
          marketplaceFilter
        )

        setFilteredNfts(nftItems)
        setOffset(nftItems.length)
        setLoading(false)

        if (nftItems.length < paginationLimit) {
          setHasMore(false)
        }
      }
      getInitialNfts()
    } else {
      setLoading(false)
      setHasMore(false)
    }
  }, [chainId, marketplaceFilter, paginationLimit, setFilteredNfts, sortingDirection, sortingField])

  const loadMore = useCallback(
    async (customOffset?: number, customPaginationLimit?: number) => {
      if (chainId) {
        const nftItems = await marketplaceService(chainId, fracApiVersion).getMarketplaceItems(
          sortingDirection,
          sortingField,
          customPaginationLimit || paginationLimit,
          marketplaceFilter,
          customOffset || offset
        )

        if (nftItems) {
          const newOffset = offset + nftItems.length
          addItems(nftItems)
          setOffset(newOffset)
        }

        if (nftItems.length < paginationLimit && fracApiVersion === 2 && marketplaceFilter === MarketplaceFilter.all) {
          setFracApiVersion(1)
          if (paginationLimit - nftItems.length > 0) {
            setIncomplete(true)
          }
        } else if (fracApiVersion === 1 || marketplaceFilter !== MarketplaceFilter.all) {
          setHasMore(false)
          setLoading(false)
        }
      }
    },
    [addItems, chainId, marketplaceFilter, fracApiVersion, offset, paginationLimit, sortingDirection, sortingField]
  )

  useEffect(() => {
    if (incomplete) {
      loadMore(0, 100)
      setIncomplete(false)
    }
  }, [fracApiVersion, incomplete, loadMore])

  return { loading, hasMore, loadMore, nfts }
}
