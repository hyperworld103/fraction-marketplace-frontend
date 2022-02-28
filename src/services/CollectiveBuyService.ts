import { MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import fromExponential from 'from-exponential'
import { AbiItem } from 'web3-utils'
import erc20Abi from '../abi/erc20.json'
import erc721Abi from '../abi/erc721.json'
import nftfyCollectiveBuyAbi from '../abi/nftfyCollectiveBuyAbi.json'
import { getChainConfigById } from '../config'
import { chainConfig } from '../configV2'
import { graphQlClient } from '../graphql/ClientGraphql'
import {
  ACTIVE_LISTING_BY_STATUS_QUERY,
  ActiveListingByStatusData,
  ActiveListingByStatusVar
} from '../graphql/nftfy/collective-buy/listing/ActiveListingByStatus'
import {
  ACTIVE_LISTING_ID_BY_TARGET_QUERY,
  ActiveListingIdByTargetData,
  ActiveListingIdByTargetVars
} from '../graphql/nftfy/collective-buy/listing/ActiveListingIdByTarget'
import {
  LISTING_BUYERS_BY_ADDRESS_QUERY,
  ListingBuyersByAddressData,
  ListingBuyersByAddressVars
} from '../graphql/nftfy/collective-buy/listing/ListingBuyerByAddress'
import { LISTING_BUYERS_QUERY, ListingBuyersData, ListingBuyersVars } from '../graphql/nftfy/collective-buy/listing/ListingBuyers'
import {
  MARKETPLACE_LISTING_BY_ID_QUERY,
  MarketplaceListingByIdData,
  MarketplaceListingByIdVars
} from '../graphql/nftfy/collective-buy/listing/MarketplaceListingById'
import {
  MARKETPLACE_LISTING_STARTING_STATUS_QUERY,
  MarketplaceListingStartingStatusData,
  MarketplaceListingStartingStatusVar
} from '../graphql/nftfy/collective-buy/listing/MarketplaceListingStartingStatus'
import { ListingStatus } from '../graphql/variables/CollectiveBuying'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { WalletProvider } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { Buyer, CollectiveBuyMarketplaceItem } from '../types/CollectiveBuyTypes'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { units } from './UtilService'
import { walletService } from './WalletService'

interface CollectiveBuyService {
  getItemById(id: string, chainId: number): Promise<CollectiveBuyMarketplaceItem | undefined>
  getItemIdByTarget(tokenId: string, erc721Address: string, chainId: number): Promise<string | undefined>
  approvedOnErc721(tokenId: string, erc721Address: string, chainId: number): Promise<string>
  approveOnErc721(erc721Address: string, accountAddress: string, tokenId: string, chainId: number): Promise<void>
  approvedOnErc20(erc20Address: string, accountAddress: string, chainId: number): Promise<boolean>
  approveOnErc20(erc20Address: string, accountAddress: string, chainId: number): Promise<void>
  list(
    erc721Address: string,
    tokenId: string,
    paymentTokenAddress: string,
    paymentTokenDecimals: number,
    paymentTokenSymbol: string,
    reservePrice: string,
    extension: number,
    chainId: number,
    accountAddress: string,
    name: string,
    symbol: string,
    type: 'AUCTION' | 'SET_PRICE',
    communityFee: number,
    maximumPrice?: string
  ): Promise<void>
  getItemsByStatus(status: ListingStatus[], pageLimit: number, chainId: number): Promise<CollectiveBuyMarketplaceItem[]>
  leave(listingId: string, accountAddress: string, chainId: number): Promise<void>
  join(
    isNetworkPaymentToken: boolean,
    listingId: string,
    amount: string,
    paymentTokenDecimals: number,
    account: string,
    chainId: number
  ): Promise<void>
  getBuyersByItemId(itemId: string, chainId: number): Promise<Buyer[]>
  payout(listingId: string, accountAddress: string, chainId: number): Promise<void>
  claim(listingId: string, accountAddress: string, chainId: number): Promise<void>
  getItemBuyerByAccount(listingId: string, accountAddress: string, chainId: number): Promise<Buyer | undefined>
  relist(listingId: string, accountAddress: string, chainId: number): Promise<void>
  getItemsByStartingStatus(pageLimit: number, chainId: number): Promise<CollectiveBuyMarketplaceItem[]>
  cancel(listingId: string, accountAddress: string, chainId: number): Promise<void>
  updatePrice(
    listingId: string,
    reservePrice: string,
    paymentTokenDecimals: number,
    accountAddress: string,
    chainId: number,
    limitPrice?: string
  ): Promise<void>
  accept(listingId: string, account: string, chainId: number): Promise<void>
}

export const collectiveBuyService = (): CollectiveBuyService => {
  const setItemMetadata = async (chainId: number, item: CollectiveBuyMarketplaceItem): Promise<CollectiveBuyMarketplaceItem> => {
    if (!item.target.tokenURI) {
      return item
    }

    const erc721 = await walletService(chainId === 1 ? WalletProvider.api : WalletProvider.theGraph).get721Item(
      item.target.tokenId
    )

    if (!erc721) {
      return item
    }

    return {
      ...item,
      erc721
    }
  }

  return {
    async getItemById(id: string, chainId: number): Promise<CollectiveBuyMarketplaceItem | undefined> {
      const config = chainConfig(chainId)

      if (!config || !config.collectiveBuy.thegraph) {
        return undefined
      }

      const client = await graphQlClient(chainId, config.collectiveBuy.thegraph)

      const { data, error } = await client.query<MarketplaceListingByIdData, MarketplaceListingByIdVars>({
        query: MARKETPLACE_LISTING_BY_ID_QUERY,
        variables: { id }
      })

      if (error) {
        notifyError(code[5011], error)
        return undefined
      }

      if (!data.listing) {
        return undefined
      }

      const web3 = initializeWeb3(chainId)
      const extraData = web3.eth.abi.decodeParameters(['bytes32', 'string', 'string', 'uint256'], data.listing.extra)

      const collectiveBuy: CollectiveBuyMarketplaceItem = { ...data.listing, name: extraData[1], symbol: extraData[2] }

      return setItemMetadata(chainId, collectiveBuy)
    },
    async getItemIdByTarget(tokenId: string, erc721Address: string, chainId: number): Promise<string | undefined> {
      const config = chainConfig(chainId)

      if (!config || !config.collectiveBuy.thegraph) {
        notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
        return undefined
      }

      const client = await graphQlClient(chainId, config.collectiveBuy.thegraph)

      const { data, error } = await client.query<ActiveListingIdByTargetData, ActiveListingIdByTargetVars>({
        query: ACTIVE_LISTING_ID_BY_TARGET_QUERY,
        variables: { target: `${erc721Address}#${tokenId}` }
      })

      if (error) {
        notifyError(code[5011], error)
        return undefined
      }

      if (data.listings.length === 0) {
        return undefined
      }

      return data.listings[0].id
    },
    async approvedOnErc721(tokenId: string, erc721Address: string, chainId: number): Promise<string> {
      try {
        const web3 = initializeWeb3(chainId)

        const contractErc721 = new web3.eth.Contract(erc721Abi as AbiItem[], erc721Address)
        return contractErc721.methods.getApproved(tokenId).call()
      } catch (e) {
        notifyError(code[5011], e)
        return ''
      }
    },
    async approveOnErc721(erc721Address: string, accountAddress: string, tokenId: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)

        const contractErc721 = new web3.eth.Contract(erc721Abi as AbiItem[], erc721Address)
        contractErc721.methods
          .approve(config.collectiveBuy.contract, tokenId)
          .send({ from: accountAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.collectiveBuyApproveList) : clearTransaction()
          })
      } catch (e) {
        notifyError(code[5011], e)
      }
    },
    async approvedOnErc20(erc20Address: string, accountAddress: string, chainId: number): Promise<boolean> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return false
        }

        const web3 = initializeWeb3(chainId)

        const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
        const allowance = await contractErc20.methods.allowance(accountAddress, config.collectiveBuy.contract).call()

        return new BigNumber(allowance).gt(0)
      } catch (e) {
        notifyError(code[5011], e)
        return false
      }
    },
    async approveOnErc20(erc20Address: string, accountAddress: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)

        const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
        contractErc20.methods
          .approve(config.collectiveBuy.contract, MaxUint256.toString())
          .send({ from: accountAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.collectiveBuyApproveList) : clearTransaction()
          })
      } catch (e) {
        notifyError(code[5011], e)
      }
    },
    async list(
      erc721Address: string,
      tokenId: string,
      paymentTokenAddress: string,
      paymentTokenDecimals: number,
      paymentTokenSymbol: string,
      reservePrice: string,
      extension: number,
      chainId: number,
      accountAddress: string,
      name: string,
      symbol: string,
      type: 'AUCTION' | 'SET_PRICE',
      communityFee: number,
      maximumPrice?: string
    ): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const safePaymentTokenAddress = paymentTokenSymbol === config.networkTokenSymbol ? config.networkTokenAddress : paymentTokenAddress

        const web3 = initializeWeb3(chainId)

        const limitPrice = maximumPrice ? units(maximumPrice, paymentTokenDecimals) : units('10', 50)

        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)

        const communityFeeUnits = units(communityFee.toString(10), 18)
        const typeBytes = web3.utils.asciiToHex(type)

        const extras = web3.eth.abi.encodeParameters(
          ['bytes32', 'string', 'string', 'uint256'],
          [typeBytes, name, symbol, communityFeeUnits]
        )

        contractNftfy.methods
          .list(erc721Address, tokenId, safePaymentTokenAddress, units(reservePrice, paymentTokenDecimals), limitPrice, extension, extras)
          .send({ from: accountAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.collectiveBuyList) : clearTransaction()
          })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async getItemsByStatus(status: ListingStatus[], pageLimit: number, chainId: number): Promise<CollectiveBuyMarketplaceItem[]> {
      const config = chainConfig(chainId)

      if (!config || !config.collectiveBuy.thegraph) {
        notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
        return []
      }

      const client = await graphQlClient(chainId, config.collectiveBuy.thegraph)

      const { data, error } = await client.query<ActiveListingByStatusData, ActiveListingByStatusVar>({
        query: ACTIVE_LISTING_BY_STATUS_QUERY,
        variables: { status_in: status, first: pageLimit }
      })

      if (error) {
        notifyError(code[5011], error)
        return []
      }

      if (data.listings.length === 0) {
        return []
      }

      const setItemsMetadata = async (items: CollectiveBuyMarketplaceItem[]) => {
        const itemsFormatted: CollectiveBuyMarketplaceItem[] = []

        await Promise.all(
          items.map(async item => {
            itemsFormatted.push(await setItemMetadata(chainId, item))
          })
        )

        return itemsFormatted
      }

      const result = await setItemsMetadata(data.listings)

      return result
    },
    async join(
      isNetworkToken: boolean,
      listingId: string,
      amount: string,
      paymentTokenDecimals: number,
      account: string,
      chainId: number
    ): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)

        const amountToUnits = fromExponential(units(amount, paymentTokenDecimals))
        const payableAmount = isNetworkToken ? amountToUnits : '0'

        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.join(listingId, amountToUnits).send({ from: account, value: payableAmount }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyJoinGroup) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async leave(listingId: string, accountAddress: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.leave(listingId).send({ from: accountAddress }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyRemoveParticipation) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async getBuyersByItemId(itemId: string, chainId: number): Promise<Buyer[]> {
      const config = chainConfig(chainId)

      if (!config || !config.collectiveBuy.thegraph) {
        return []
      }

      const client = await graphQlClient(chainId, config.collectiveBuy.thegraph)

      const { data, error } = await client.query<ListingBuyersData, ListingBuyersVars>({
        query: LISTING_BUYERS_QUERY,
        variables: { id: itemId }
      })

      if (error) {
        notifyError(code[5011], error)
        return []
      }

      if (!data.listing || !data.listing.buyers) {
        return []
      }

      return data.listing.buyers
    },
    async payout(listingId: string, accountAddress: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.payout(listingId).send({ from: accountAddress }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyPayout) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async claim(listingId: string, accountAddress: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.claim(listingId, accountAddress).send({ from: accountAddress }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyClaim) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async getItemBuyerByAccount(listingId: string, accountAddress: string, chainId: number): Promise<Buyer | undefined> {
      const config = chainConfig(chainId)

      if (!config || !config.collectiveBuy.thegraph) {
        return undefined
      }

      const client = await graphQlClient(chainId, config.collectiveBuy.thegraph)

      const { data, error } = await client.query<ListingBuyersByAddressData, ListingBuyersByAddressVars>({
        query: LISTING_BUYERS_BY_ADDRESS_QUERY,
        variables: { id: listingId, account: accountAddress }
      })

      if (error) {
        notifyError(code[5011], error)
        return undefined
      }

      if (!data.listing || data.listing.buyers.length === 0) {
        return undefined
      }

      return data.listing.buyers[0]
    },
    async relist(listingId: string, accountAddress: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.relist(listingId).send({ from: accountAddress }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyRelist) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async getItemsByStartingStatus(pageLimit: number, chainId: number): Promise<CollectiveBuyMarketplaceItem[]> {
      const config = chainConfig(chainId)

      if (!config || !config.collectiveBuy.thegraph) {
        notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
        return []
      }

      const client = await graphQlClient(chainId, config.collectiveBuy.thegraph)
      const now = Math.round(Date.now() / 1000)

      const { data, error } = await client.query<MarketplaceListingStartingStatusData, MarketplaceListingStartingStatusVar>({
        query: MARKETPLACE_LISTING_STARTING_STATUS_QUERY,
        variables: { cutoff_gt: now, first: pageLimit }
      })

      if (error) {
        notifyError(code[5011], error)
        return []
      }

      if (data.listings.length === 0) {
        return []
      }
      const setItemsMetadata = async (items: CollectiveBuyMarketplaceItem[]) => {
        const itemsFormatted: CollectiveBuyMarketplaceItem[] = []

        await Promise.all(
          items.map(async item => {
            itemsFormatted.push(await setItemMetadata(chainId, item))
          })
        )

        return itemsFormatted
      }

      const result = await setItemsMetadata(data.listings)

      return result
    },
    async accept(listingId: string, account: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.accept(listingId).send({ from: account }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyAcceptOffer) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async cancel(listingId: string, accountAddress: string, chainId: number): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods.cancel(listingId).send({ from: accountAddress }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.collectiveBuyCancel) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async updatePrice(
      listingId: string,
      reservePrice: string,
      paymentTokenDecimals: number,
      accountAddress: string,
      chainId: number,
      limitPrice?: string
    ): Promise<void> {
      try {
        const config = chainConfig(chainId)

        if (!config || !config.collectiveBuy.contract) {
          notifyError(code[5011], { name: 'Failed to obtain chain config', message: 'Failed to obtain chain config' })
          return
        }

        const web3 = initializeWeb3(chainId)
        const contractNftfy = new web3.eth.Contract(nftfyCollectiveBuyAbi as AbiItem[], config.collectiveBuy.contract)
        contractNftfy.methods
          .updatePrice(
            listingId,
            units(reservePrice, paymentTokenDecimals),
            limitPrice ? units(limitPrice, paymentTokenDecimals) : units('10', 50)
          )
          .send({ from: accountAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.collectiveBuyUpdatePrice) : clearTransaction()
          })
      } catch (error) {
        notifyError(code[5011], error)
      }
    }
  }
}
