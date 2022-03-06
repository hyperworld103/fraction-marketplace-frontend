import axios from 'axios'
import { now } from 'lodash'
import { getChainConfigById } from '../config'
import { nftfyFracGraphQlClientV1 } from '../graphql/nftfy/frac-v1/ClientNftfyFracGraphql'
import { nftfyFracGraphQlClientV2 } from '../graphql/nftfy/frac-v2/ClientNftfyFracGraphql'
import { CurrencyAssetByIdData, CurrencyAssetByIdVars, CURRENCY_ASSET_BY_ID_QUERY } from '../graphql/nftfy/frac-v2/frac/CurrencyAssetById'
import { WalletProvider } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { ERC20Asset, MarketplaceERC20Item, MarketplaceERC20ItemTypeEnum } from '../types/MarketplaceTypes'
import { AssetERC20 } from '../types/WalletTypes'
import { notifyError } from './NotificationService'
import { TheGraphPeerToPeerService } from './PeerToPeerService'
import { zeroXQuoteService } from './QuoteService'
import { units } from './UtilService'
import { getErc20Balance, walletService } from './WalletService'
import erc20Abi from '../abi/erc20.json'
import erc20SharesAbi from '../abi/erc20shares.json'
import erc20AuctionAbi from '../abi/erc20NftfyAuction.json'
import { initializeWeb3 } from './MultiWalletService'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import { API } from '../constants/api';
import { scale } from '../services/UtilService'
import Cookies from 'universal-cookie';

interface MarketplaceService {
  getMarketplaceItems(
    orderDirection: 'asc' | 'desc',
    orderField: 'timestamp' | 'liquidity' | 'name',
    paginationLimit: number,
    filterCurrent: string,
    offset?: number,
    searchName?: string,
    released?: boolean
  ): Promise<MarketplaceERC20Item[]>
  getMarketplaceItemByAddress(erc20Address: string, itemId: string): Promise<MarketplaceERC20Item | undefined>
  getAsset(erc20Address: string): Promise<ERC20Asset | undefined>
}

export const marketplaceService = (chainId: number, version: 1 | 2): MarketplaceService => {
  const { boxAddress } = getChainConfigById(chainId)

  const setMarketplaceItemMetadata = async (erc20Item: MarketplaceERC20Item) => {
    if (!erc20Item.target.tokenURI) {
      return erc20Item
    }

    const { erc20List } = getChainConfigById(chainId)

    const erc721Item = await walletService(WalletProvider.api).get721Item(
      erc20Item.target.id
    )
 
    if (!erc721Item) {
      return erc20Item
    }

    const { metadata } = erc721Item

    if (metadata && !metadata?.name) {
      metadata.name = `${erc721Item.name} #${erc721Item.tokenId}`
    }

    // Get the payment token symbol from the config for the erc20 while the new update is not deployed on the subgraph, as decided with
    // Rodrigo
    const paymentTokenSymbol = !erc20Item.paymentToken.id ? 'ETH' : erc20List.find(erc20 => erc20.id === erc20Item.paymentToken?.id)?.symbol

    return {
      ...erc20Item,
      paymentTokenSymbol,
      metadata,
      nftCount: 0
    }
  }

  const setMarketplaceItemHoldersCount = async (erc20Item: MarketplaceERC20Item): Promise<MarketplaceERC20Item> => {
    const web3 = initializeWeb3(chainId)

    const contractERC20shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], 
      erc20Item.id)

    console.log(contractERC20shares);
    let w_holders = await contractERC20shares.methods.holders().call()

    console.log(w_holders);
    return { ...erc20Item, holdersCount: w_holders }
  }

  // const executeQuery = async (item: any, activeFilters?: any): Promise<MarketplaceERC20Item> => {
  //   const web3 = initializeWeb3(chainId)
  //   if(!item.frac_id)
  //     return;

  //   let contractERC20share
  //   if(item.frac_id.type == "set_price")
  //     contractERC20share = new web3.eth.Contract(erc20SharesAbi as AbiItem[], item.frac_id.fractionAddress)
  //   else
  //     contractERC20share = new web3.eth.Contract(erc20AuctionAbi as AbiItem[], item.frac_id.fractionAddress) 
    
  //   let w_status = await contractERC20share.methods.status().call()
    
  //   if(w_status == 'PAUSE')
  //     w_status = 'PAUSE_OR_OFFER'
  //   else if(w_status == 'OFFER' && item.frac_id.type == 'set_price')
  //     w_status = 'OFFER'
  //   else if(w_status == 'OFFER')
  //     w_status = 'PAUSE_OR_OFFER'
  //   else if(w_status == 'AUCTION')
  //     w_status = 'AUCTION'
  //   else if(w_status == 'SOLD' && item.frac_id.type == 'set_price')
  //     w_status = 'SOLD'
  //   else
  //     w_status = 'AUCTION_OR_SOLD'

  //   if(!!activeFilters)
  //   {
  //     if(activeFilters == 'startAuction' && !(w_status == 'PAUSE_OR_OFFER')){
  //       return;
  //     } else if(activeFilters == 'liveAuction' && !(w_status == 'AUCTION')){
  //       return;
  //     } else if(activeFilters == 'buyNow' && !(w_status == 'SOLD')){
  //       return;
  //     } else if(activeFilters == 'recentSold' && !(w_status == 'AUCTION_OR_SOLD')) {
  //       return;
  //     }
  //   }

  //   let w_type: MarketplaceERC20ItemTypeEnum = MarketplaceERC20ItemTypeEnum.AUCTION
  //   if(item.frac_id.type == 'set_price')
  //     w_type = MarketplaceERC20ItemTypeEnum.SET_PRICE

  //   let w_vaultBalance = await contractERC20share.methods.vaultBalance().call()
  //   w_vaultBalance = scale(new BigNumber(w_vaultBalance), -item.frac_id.decimals).toString()

  //   let w_released = await contractERC20share.methods.released().call()

  //   let w_totalSupply = await contractERC20share.methods.totalSupply().call()
  //   w_totalSupply = scale(new BigNumber(w_totalSupply), -item.frac_id.decimals).toString()

  //   let w_cutoff = -1
  //   if(item.frac_id.type == "auction") {
  //     w_cutoff = await contractERC20share.methods.cutoff().call()
  //     if(~w_cutoff < 0)
  //       w_cutoff = ~w_cutoff
  //   }

  //   let contractERC20 = new web3.eth.Contract(erc20Abi as AbiItem[], item.frac_id.paymentToken)

  //   let w_payment_symbol = await contractERC20.methods.symbol().call()
  //   let w_payment_decimals = await contractERC20.methods.decimals().call()
  //   let w_payment_name = await contractERC20.methods.decimals().call()
    
  //   let w_reservePrice = await contractERC20share.methods.reservePrice().call()

  //   w_reservePrice = scale(new BigNumber(w_reservePrice), -w_payment_decimals).toString()
  //   let w_sharePrice = scale(new BigNumber(item.frac_id.fractionPrice), -(w_payment_decimals - item.frac_id.decimals)).toString()
  //   let w_sharesCount = scale(new BigNumber(item.frac_id.fractionCount), -item.frac_id.decimals).toString()

  //   return {
  //     id: item.frac_id.fractionAddress,
  //     name: item.frac_id.name,
  //     symbol: item.frac_id.symbol,
  //     decimals: item.frac_id.decimals,
  //     exitPrice: w_reservePrice,
  //     released: w_released,
  //     timestamp: item.frac_id.create_date,
  //     sharePrice: w_sharePrice,
  //     sharesCount: w_sharesCount,
  //     totalSupply: w_totalSupply,
  //     vaultBalance: w_vaultBalance,
  //     type: w_type,
  //     status: w_status,
  //     cutoff: w_cutoff,
  //     minimumDuration: item.frac_id.days,
  //     bids: [],
  //     paymentToken: {
  //       id: item.frac_id.paymentToken,
  //       name: w_payment_name,
  //       symbol: w_payment_symbol,
  //       decimals: w_payment_decimals
  //     },
  //     target: {
  //       id: item._id,
  //       tokenId: item.token_id,
  //       tokenURI: 'https://ipfs.io/ipfs/' + item.cid,
  //       collection: {
  //         id: item.collection_id.contract_address,
  //         name: item.collection_id.name
  //       }
  //     }
  //   }
  // }  

  return {
    async getMarketplaceItems(
      orderDirection: 'asc' | 'desc',
      orderField: 'timestamp' | 'liquidity' | 'name',
      paginationLimit,
      activeFilters,
      offset = 0,
      searchName: string,
      released = false
    ) {
      const setMarketplaceItemsMetadata = async (erc20Items: MarketplaceERC20Item[]) => {
        const erc20ItemsFormatted: MarketplaceERC20Item[] = []
        await Promise.all(
          erc20Items.map(async erc20Item => {
            erc20ItemsFormatted.push(await setMarketplaceItemMetadata(erc20Item))
          })
        )
        return erc20ItemsFormatted
      }  
      const cookies = new Cookies()
      const headers = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer '+ cookies.get('token')
          }
      };
      let cond_data = {};
      cond_data['chainId'] = chainId;
      cond_data['paginationLimit'] = paginationLimit;
      cond_data['offset'] = offset;
      cond_data['searchName'] = searchName;
      cond_data['orderField'] = orderField;
      cond_data['orderDirection'] = orderDirection;
      cond_data['activeFilters'] = activeFilters;

      try {
        let w_result = await axios.post(API.server_url + API.item_fracMarketList, cond_data, headers)
        if(w_result.status === 200){
          let w_temp: any = w_result.data;
          let erc20Items: MarketplaceERC20Item[] = w_temp.data;
          console.log("1111", erc20Items)
          return await setMarketplaceItemsMetadata(erc20Items)   
        }
        return []
      } catch(e){
        return []
      }
    },

    async getMarketplaceItemByAddress(erc20Address: string, itemId: string) {
      const cookies = new Cookies()
      const headers = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer '+ cookies.get('token')
          }
      };
      let cond_data = {};
      cond_data['frac_addr'] = erc20Address;

      try {
        let w_result = await axios.post(API.server_url + API.item_fractionGet, cond_data, headers)

        if(w_result.status === 200){
          let w_temp: any = w_result.data;
          let w_erc20Item: MarketplaceERC20Item = w_temp.data;
 
          const erc20ItemWithMetadata = await setMarketplaceItemMetadata(w_erc20Item)

          return setMarketplaceItemHoldersCount(erc20ItemWithMetadata)
        }
        return undefined
      } catch(e){
        return undefined
      }
    },
    async getAsset(erc20Address: string) {
      const client = version === 2 ? await nftfyFracGraphQlClientV2(chainId) : await nftfyFracGraphQlClientV1(chainId)
      const { data, error } = await client.query<CurrencyAssetByIdData, CurrencyAssetByIdVars>({
        query: CURRENCY_ASSET_BY_ID_QUERY,
        variables: {
          id: erc20Address
        }
      })

      if (error || !data || !data.currency) {
        // TODO: Uncomment after refactor chainId
        // notifyError(code[5016])
        return undefined
      }

      return {
        ...data.currency,
        address: data.currency.id,
        imageUrl: ''
      }
    }
  }
}

export const setMarketplaceItemsLiquidity = async (
  erc20Items: MarketplaceERC20Item[],
  chainId: number
): Promise<MarketplaceERC20Item[]> => {
  const erc20ItemsWithLiquidity: MarketplaceERC20Item[] = []

  await Promise.all(
    erc20Items.map(async erc20Item => {
      erc20ItemsWithLiquidity.push(await setMarketplaceItemLiquidity(erc20Item, chainId))
    })
  )

  return erc20ItemsWithLiquidity
}

export const setMarketplaceItemLiquidity = async (erc20Item: MarketplaceERC20Item, chainId: number): Promise<MarketplaceERC20Item> => {
  const itemWithLiquidity = { ...erc20Item }
  if (!erc20Item.paymentToken) {
    itemWithLiquidity.liquidity = {
      hasLiquidity: false,
      priceDollar: ''
    }
    return erc20Item
  }

  // const erc20MarketPrice = await TheGraphPeerToPeerService(chainId).getTokensPairMarketPrice(
  //   erc20Item.id,
  //   erc20Item.paymentToken.id,
  //   erc20Item.paymentToken.decimals
  // )
  let erc20MarketPrice;

  if (!erc20MarketPrice) {
    itemWithLiquidity.liquidity = {
      hasLiquidity: false,
      priceDollar: ''
    }
    return erc20Item
  }

  // itemWithLiquidity.liquidity = await zeroXQuoteService().quoteToStablecoin(
  //   erc20Item.paymentToken.id,
  //   units(erc20MarketPrice, erc20Item.paymentToken.decimals),
  //   erc20Item.paymentToken.decimals,
  //   chainId
  // )

  return itemWithLiquidity
}

export const getMarketplaceAssetsList = async (chainId: number) => {
  const { ethAddress, balancer, erc20List } = getChainConfigById(chainId)
  const { eth } = balancer

  const erc20Promises: Promise<AssetERC20>[] = erc20List.map(async erc20 => {
    const balance = await getErc20Balance(erc20.address === eth ? ethAddress : erc20.address, erc20.decimals, chainId)
    return { ...erc20, balance: balance.toString() }
  })

  return Promise.all(erc20Promises)
}
