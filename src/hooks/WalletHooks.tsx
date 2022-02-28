import { useReactiveVar } from '@apollo/client'
import { useEffect, useState } from 'react'
import { getChainConfigById } from '../config'
import { accountVar, chainIdVar, WalletProvider } from '../graphql/variables/WalletVariable'
import { walletService } from '../services/WalletService'
import { BoxAsset } from '../types/BoxTypes'
import { WalletErc721Item } from '../types/WalletTypes'

export function useWalletNfts(paginationLimit: number, offsetParams = 0) {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const [offset, setOffset] = useState(offsetParams)
  const [loading, setLoading] = useState(true)
  const { boxAddress } = getChainConfigById(chainId)
  const [hasMore, setHasMore] = useState(true)
  const [nfts, setNfts] = useState<WalletErc721Item[]>([])

  // useEffect(() => {
  //   const getNfts = async () => {
  //     if (account && chainId) {
  //       const listNfts = await walletService(chainId === 1 ? WalletProvider.api : WalletProvider.theGraph).get721Items(
  //         account,
  //         chainId,
  //         offset,
  //         paginationLimit
  //       )

  //       if (chainId !== 1 || nfts.length < paginationLimit) {
  //         setHasMore(false)
  //       }
  //     }
  //     setLoading(false)
  //   }
  //   getNfts()
  // }, [ nfts, offset, offsetParams, paginationLimit])

//   const loadMore = async () => {
//     if (account && chainId) {
//       const nftItems = await walletService(chainId === 1 ? WalletProvider.api : WalletProvider.theGraph).get721Items(
//         account,
//         chainId,
//         offset,
//         paginationLimit
//       )

//       setOffset(offset + paginationLimit)

//       if (nftItems.length < paginationLimit) {
//         setHasMore(false)
//       }
//     }
//   }

//   return { loading, hasMore, loadMore, nfts }
}

export function useWalletNft(id: string) {
  const [erc721, setErc721] = useState<WalletErc721Item | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getNft = async () => {
      if (id) {
        setIsLoading(true)
        const nft = await walletService(WalletProvider.api).get721Item(id)
        
        if (nft) {
          setErc721(nft)
        } else {
          setErc721(undefined)
        }
        setIsLoading(false)
      }
    }
    getNft()
  }, [id])

  return { erc721, isLoading }
}
