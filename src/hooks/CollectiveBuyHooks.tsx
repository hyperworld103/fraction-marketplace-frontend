import { useReactiveVar } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { successRemovedParticipationModalVar } from '../graphql/variables/CollectiveBuying'
import { clearTransaction, transactionLoadingVar, TransactionType, transactionVar } from '../graphql/variables/TransactionVariable'
import { collectiveBuyService } from '../services/CollectiveBuyService'
import { Buyer, CollectiveBuyMarketplaceItem } from '../types/CollectiveBuyTypes'

const observableTransactionTypes = [
  TransactionType.collectiveBuyJoinGroup,
  TransactionType.collectiveBuyRemoveParticipation,
  TransactionType.collectiveBuyRelist,
  TransactionType.collectiveBuyPayout,
  TransactionType.collectiveBuyClaim,
  TransactionType.collectiveBuyApproveList,
  TransactionType.collectiveBuyAcceptOffer,
  TransactionType.collectiveBuyRedeem,
  TransactionType.collectiveBuyUpdatePrice
]

export function useCollectiveBuyNft(address: string, chainId: number) {
  const [item, setItem] = useState<CollectiveBuyMarketplaceItem | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)

  const obtainItem = useCallback(() => {
    const getItem = async () => {
      const obtainedItem = await collectiveBuyService().getItemById(address, chainId)
      setItem(obtainedItem)
      setLoading(false)
    }

    getItem()
  }, [address, chainId])

  useEffect(() => {
    obtainItem()
  }, [obtainItem])

  useEffect(() => {
    if (transaction && transaction.confirmed && observableTransactionTypes.includes(transaction.type) && !transactionLoading) {
      obtainItem()

      if (transaction.type === TransactionType.collectiveBuyRemoveParticipation) {
        successRemovedParticipationModalVar(true)
      }
      clearTransaction()
    }
  }, [obtainItem, transaction, transactionLoading])

  return { item, loading }
}

export function useCollectiveBuyBuyer(listingId: string, buyerAddress: string, chainId: number) {
  const [buyer, setBuyer] = useState<Buyer | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const obtainItem = useCallback(() => {
    const getItem = async () => {
      const obtainedBuyer = await collectiveBuyService().getItemBuyerByAccount(listingId, buyerAddress, chainId)
      setBuyer(obtainedBuyer)
      setLoading(false)
    }

    getItem()
  }, [buyerAddress, chainId, listingId])

  useEffect(() => {
    obtainItem()
  }, [obtainItem])

  return { buyer, loading }
}

export function useCollectiveBuyBuyers(listingId: string, chainId: number) {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)

  const obtainItem = useCallback(() => {
    const getItem = async () => {
      const obtainedBuyers = await collectiveBuyService().getBuyersByItemId(listingId, chainId)
      setBuyers(obtainedBuyers)
      setLoading(false)
    }

    getItem()
  }, [chainId, listingId])

  useEffect(() => {
    obtainItem()
  }, [obtainItem])

  return { buyers, loading }
}
