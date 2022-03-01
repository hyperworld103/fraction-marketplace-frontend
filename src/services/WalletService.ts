import axios from 'axios'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import erc20Abi from '../abi/erc20.json'
import erc20SharesAbi from '../abi/erc20shares.json'
import erc20AuctionAbi from '../abi/erc20NftfyAuction.json'
import erc721Abi from '../abi/erc721.json'
import erc721WrappedAbi from '../abi/erc721wrapped.json'
import nftfyAbi from '../abi/fraction.json'
import nftfyTokenIcon from '../assets/tokens/nftfy.svg'
import { getChainConfigById } from '../config'
import { NFT_BY_ADDRESS_QUERY, NftByAddressData, NftByAddressVar } from '../graphql/nftfy/nft/nft/nftByAddress'
import { NftByWalletData, NftByWalletVar, NFTS_BY_WALLET_QUERY } from '../graphql/nftfy/nft/wallet/nftsByWallet'
import { WalletProvider } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { MarketplaceERC20Item } from '../types/MarketplaceTypes'
import { WalletERC20Share, WalletErc721Item } from '../types/WalletTypes'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { getErc721Metadata, getZoraErc721Metadata, isAllowedChain, scale } from './UtilService'
import Cookies from 'universal-cookie';
import { API } from '../constants/api';
import { userService } from '../services/UserService'

interface WalletService {
  get721Items(offset: number, limit: number, searchName?: string, address?: string): Promise<WalletErc721Item[]>
  get721Item(id: string): Promise<WalletErc721Item | null>
  getERC20Shares(chainId: number): Promise<WalletERC20Share[]>
  getERC20SharesByAddress(walletAddress: string, erc20Address: string, chainId: number): Promise<WalletERC20Share | undefined>
}

export const walletService = (providerName: WalletProvider): WalletService => {
  switch (providerName) {
    case WalletProvider.api:
      return apiProvider()
    default:
      return apiProvider()
  }
}

const apiProvider = (): WalletService => {
  return {
    get721Items: async (offset, limit, searchName, collection_id) => {
      const cookies = new Cookies()
      const headers = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer '+ cookies.get('token')
          }
      };

      let erc721Items: WalletErc721Item[] = []
      let cond_data = {};
      cond_data['paginationLimit'] = limit;
      cond_data['offset'] = offset;
      if(!!searchName) cond_data['searchName'] = searchName;
      if(!!collection_id) cond_data['collection_id'] = collection_id;
      cond_data['type'] = 'fraction'

      try {
        let w_result = await axios.post(API.server_url + API.item_list, cond_data, headers)
        
        if(w_result.status === 200){
          let w_temp: any = w_result.data
          const nftsByWallet: any = w_temp.data
          nftsByWallet.map((nft: any) => {
            erc721Items.push({
              address: nft.collection_id.contract_address,
              tokenId: nft.token_id,
              cid: nft.cid,
              name: nft.collection_id.name,
              symbol: nft.collection_id.contract_symbol,
              animationType: nft.category,
              id: nft._id
            })
          })

          const erc721ItemsMetadataPromises: Promise<{
            id: string
            name: string
            address: string
            tokenId: string
            description: string
            image_url: string
            animation_url: string | undefined
            social_media?: string
            animationType: string | undefined
          }>[] = []
          erc721Items.forEach(erc721Item => erc721ItemsMetadataPromises.push(getErc721Metadata(erc721Item.address, erc721Item.tokenId, erc721Item.cid, erc721Item.animationType, erc721Item.id)))
          const erc721ItemsMetadata = await Promise.all(erc721ItemsMetadataPromises)

          erc721Items = erc721Items.map(erc721Item => {
            const metadata = erc721ItemsMetadata.find(
              erc721ItemMetadata => erc721Item.id == erc721ItemMetadata.id
            )
  
            if (metadata) {
              const erc721ItemClone = { ...erc721Item }
  
              erc721ItemClone.metadata = {
                name: metadata.name,
                image: metadata.image_url,
                imageFull: metadata.image_url,
                social_media: metadata.social_media,
                description: metadata.description,
                animation_url: String(metadata.animation_url),
                animationType: metadata.animationType
              }
              return erc721ItemClone
            }
  
            return erc721Item
          })
  
          return erc721Items
        }
      } catch(e) {
        return []
      }
    },
    get721Item: async (id): Promise<WalletErc721Item | null> => {
      const cookies = new Cookies()
      const headers = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer '+ cookies.get('token')
          }
      };

      let cond_data = {};

      cond_data['item_id'] = id;
      cond_data['type'] = 'fraction'

      try {
        let w_result = await axios.post(API.server_url + API.item_detail, cond_data, headers)
        if(w_result.status === 200){
          let w_temp: any = w_result.data
          const nftsByWallet: any = w_temp.result    
          let erc721Item: WalletErc721Item = {
            address: nftsByWallet.collection_id.contract_address,
            tokenId: nftsByWallet.token_id,
            cid: nftsByWallet.cid,
            name: nftsByWallet.collection_id.name,
            symbol: nftsByWallet.collection_id.contract_symbol,
            animationType: nftsByWallet.category,
            id: nftsByWallet._id,
            likes: nftsByWallet.like_count,
            views: nftsByWallet.view_count
          }
          const erc721Metadata = await getErc721Metadata(erc721Item.address, erc721Item.tokenId, erc721Item.cid, erc721Item.animationType, erc721Item.id)
          if(erc721Metadata)
          {
            const erc721ItemClone = { ...erc721Item }
            erc721ItemClone.metadata = {
              name: erc721Metadata.name,
              image: erc721Metadata.image_url,
              imageFull: erc721Metadata.image_url,
              social_media: erc721Metadata.social_media,
              description: erc721Metadata.description,
              animation_url: String(erc721Metadata.animation_url),
              animationType: erc721Metadata.animationType
            }
            return erc721ItemClone
          }
          return erc721Item
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Could not find metadata`)
        return null
      }
    },
    getERC20Shares: async (chainId): Promise<WalletERC20Share[]> => {
      // TODO: Implement on api provider
      const cookies = new Cookies()
      const headers = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer '+ cookies.get('token')
          }
      };

      let cond_data = {};
      cond_data['chainId'] = chainId;
      let w_result = await axios.post(API.server_url + API.item_fracList, cond_data, headers)
      if(w_result.status === 200){
        let w_temp: any = w_result.data;
        let erc20SharesItems: any[] = w_temp.data;

        const erc20Shares: Promise<WalletERC20Share>[] = erc20SharesItems.map(async userFrac => {
          // TODO: Implement on the Graph the get721Item()
          const erc721Item = await walletService(WalletProvider.api).get721Item(
            userFrac.frac.target.id
          )

          const metadata = erc721Item?.metadata

          return {
            ...userFrac,
            ...userFrac.frac,
            metadata: metadata || undefined
          }
        })

        return Promise.all(erc20Shares)
        
      } 
      return Promise.all([])
    },
    getERC20SharesByAddress(): Promise<WalletERC20Share | undefined> {
      // TODO: Implement on api provider
      return Promise.resolve(undefined)
    }
  }
}

export const getErc20Balance = async (
  erc20Address: string,
  erc20Decimals: number,
  chainId: number,
  erc20Symbol?: string
): Promise<BigNumber> => {
  const { ethAddress, networkTokenSymbol } = getChainConfigById(chainId)

  if (!isAllowedChain(chainId)) {
    return new Promise(() => 0)
  }
  
  const balance = await userService().getErc20Balance(erc20Address)
  if (erc20Address === ethAddress || (erc20Symbol && erc20Symbol === networkTokenSymbol)) {          
    return scale(new BigNumber(balance), -18)
  }
  
  return scale(new BigNumber(balance), -erc20Decimals)
}

export const addMetamaskCustomToken = (erc20: MarketplaceERC20Item, chainId: number) => {
  const web3 = initializeWeb3(chainId)

  web3.givenProvider.sendAsync({
    method: 'metamask_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: erc20.id,
        symbol: erc20.symbol,
        decimals: erc20.decimals,
        image: erc20.metadata?.image
      }
    }
  })
}

export const getAssetLogo = (address: string, chainId: number): string => {
  if (address === '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c') {
    return nftfyTokenIcon
  }

  const { assets } = getChainConfigById(chainId)
  const web3 = initializeWeb3(chainId)
  try {
    if (assets.includes(address.toLowerCase())) {
      return `https://raw.githubusercontent.com/balancer-labs/assets/master/assets/${address.toLowerCase()}.png`
    }
    if (address.toLowerCase() === '0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd') {
      return 'https://raw.githubusercontent.com/balancer-labs/assets/master/assets/0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd.png'
    }
    if (address.toLowerCase() === '0x6fcb6408499a7c0f242e32d77eb51ffa1dd28a7e') {
      return 'https://raw.githubusercontent.com/balancer-labs/assets/master/assets/0x6fcb6408499a7c0f242e32d77eb51ffa1dd28a7e.png'
    }
    if (address.toLowerCase() === '0xffffffff2ba8f66d4e51811c5190992176930278') {
      return 'https://raw.githubusercontent.com/balancer-labs/assets/master/assets/0xffffffff2ba8f66d4e51811c5190992176930278.png'
    }
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${web3.utils.toChecksumAddress(
      address
    )}/logo.png`
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return ''
  }
}

export const addErc20ToMetamask = (
  erc20Address: string,
  erc20Decimals: number,
  erc20Symbol: string,
  erc20ImageUrl: string,
  chainId: number
) => {
  const web3 = initializeWeb3(chainId)

  web3.givenProvider.sendAsync({
    method: 'metamask_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: erc20Address,
        symbol: erc20Symbol,
        decimals: erc20Decimals,
        image: erc20ImageUrl || `${window.location.href}/assets/nftfy.svg`
      }
    }
  })
}

export const addNftFyToMetamask = (chainId: number) => {
  const web3 = initializeWeb3(chainId)

  web3.givenProvider.sendAsync({
    method: 'metamask_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
        symbol: 'NFTFY',
        decimals: 18,
        image: `${window.location.href}/assets/nftfy.svg`
      }
    }
  })
}
