import { useCallback, useEffect, useState } from 'react'
import { collectionService } from '../services/CollectionService'
import { MarketplaceCollection } from '../types/MarketplaceTypes'

export function useMyCollections(
  paginationLimit: number,
  searchName: string,
  offSetParams = 0
) {
  const [collections, setCollections] = useState<MarketplaceCollection[]>([])
  const [offset, setOffset] = useState(offSetParams)
  const [loading, setLoading] = useState(false)
  const [incomplete, setIncomplete] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const addItems = useCallback(
    (collectionItems: MarketplaceCollection[]) => {
      setCollections(collections.concat(collectionItems))
    },
    [collections]
  )

  useEffect(() => {
    const getInitialCollections = async () => {
      setLoading(true)
      setHasMore(true)
      const collectonItems = await collectionService().getCollectionItems(
        paginationLimit,
        searchName
      )
      
      setCollections(collectonItems)
      setOffset(collectonItems.length)
      setLoading(false)

      if (collectonItems.length < paginationLimit) {
        setHasMore(false)
      }
    }
    getInitialCollections()
  }, [paginationLimit, searchName])

  const loadMore = useCallback(
    async (customOffset?: number, customPaginationLimit?: number, customSearchName?: string) => {
      const collectonItems = await collectionService().getCollectionItems(
        customPaginationLimit || paginationLimit,
        customSearchName || searchName,
        customOffset || offset
      )

      if (collectonItems) {
        const newOffset = offset + collectonItems.length
        addItems(collectonItems)
        setOffset(newOffset)
      }

      if (collectonItems.length < paginationLimit) {
        setIncomplete(false)
      }
    },
    [addItems, offset, paginationLimit]
  )

  useEffect(() => {
    if (incomplete) {
      loadMore(0, 100)
      setIncomplete(false)
    }
  }, [incomplete, loadMore])

  return { loading, hasMore, loadMore, collections }
}
