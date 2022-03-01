import * as Sentry from '@sentry/react'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import erc721Abi from '../abi/erc721.json'
import erc721ZoraAbi from '../abi/erc721Zora.json'
import { allowedChains, getChainConfigById } from '../config'
import { Erc721Attribute, Erc721Properties, Paged } from '../types/UtilTypes'

const getAnimation = async (metadata: {
  animation_url?: string
  properties?: {
    preview_media_file2?: {
      description: string
    }
  }
}) => {
  if (metadata.animation_url) {
    return metadata.animation_url
  }

  if (metadata.properties?.preview_media_file2?.description) {
    return metadata.properties?.preview_media_file2?.description
  }

  return ''
}

export default function paginator<T>(items: T[], current_page: number, per_page_items: number): Paged<T[]> {
  const page = current_page || 1
  const per_page = per_page_items || 10
  const offset = (page - 1) * per_page

  const paginatedItems = items ? items.slice(offset).slice(0, per_page_items) : []
  const total_pages = items ? Math.ceil(items.length / per_page) : 0

  return {
    page,
    per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages,
    data: paginatedItems
  }
}

const getAuthor = (metadata: {
  artist?: string
  attributes?: Erc721Attribute[] | Record<string, unknown>
  author?: string
  createdBy?: string
  properties?: Erc721Properties
}): string | undefined => {
  if (metadata.author) {
    return metadata.author
  }

  if (metadata.createdBy) {
    return metadata.createdBy
  }

  if (Array.isArray(metadata.attributes)) {
    const creators = metadata?.attributes?.filter((attribute: Erc721Attribute) => attribute.trait_type.toLowerCase() === 'creator')

    if (creators && creators.length > 0) {
      return creators.map(attribute => attribute.value).join(', ')
    }
  }

  if (metadata.attributes && typeof metadata.attributes === 'object') {
    return (metadata?.attributes as { artist: string }).artist
  }

  return undefined
}

export const getErc721Metadata = async (address: string, tokenId: string, cid: string, animationType: string, id: string) => {
  let res = {
    id: '',
    description: '',
    image_url: '',
    animation_url: '',
    social_media: '',
    name: '',
    address,
    tokenId,
    author: '',
    animationType: '',
    attributes: undefined
  };

  try {
    const metadata = await axios.get(safeIpfsUrl(cid))
    console.log(111, cid);
    const author = getAuthor(metadata.data)
    const { name, description, image, animation_url, social_media, attributes } = metadata.data
    res = {
      id,
      description,
      image_url: safeIpfsUrl(image),
      animation_url: safeIpfsUrl(animation_url),
      name,
      author,
      address,
      tokenId,
      social_media: social_media,
      attributes: attributes,
      animationType
    }
    
  } catch (error) {
    console.log(error);
    Sentry.captureException(error)
  }
  return res;
}

export const getZoraErc721Metadata = async (address: string, tokenId: string, web3: Web3) => {
  const contractErc2721 = new web3.eth.Contract(erc721ZoraAbi as AbiItem[], address)
  const image = await contractErc2721.methods.tokenURI(tokenId).call()
  const tokenMetadataUri = await contractErc2721.methods.tokenMetadataURI(tokenId).call()

  try {
    const metadata = await axios.get<{
      description: string
      name: string
      mimeType: string
      version: string
      social_media?: string
      web_site_url?: string
      twitter?: string
      telegram?: string
      discord?: string
      instagram?: string
      author?: string
      artist?: string
      createdBy?: string
      attributes?: Erc721Attribute[] | Record<string, unknown>
      properties: Erc721Properties
    }>(safeIpfsUrl(tokenMetadataUri))

    const { name, description } = metadata.data

    const author = getAuthor(metadata.data)

    return {
      description,
      image_url: safeIpfsUrl(image),
      animation_url: safeIpfsUrl(''),
      name,
      author,
      address,
      tokenId,
      social_media: metadata.data.social_media,
      web_site_url: metadata.data.web_site_url,
      twitter: metadata.data.twitter,
      telegram: metadata.data.telegram,
      discord: metadata.data.discord,
      instagram: metadata.data.instagram,
      attributes: metadata.data?.attributes,
      totalSupply: metadata.data?.properties?.total_supply?.description,
      animationType: ''
    }
  } catch (error) {
    Sentry.captureException(error)
  }

  return {
    description: '',
    image_url: '',
    animation_url: '',
    social_media: '',
    web_site_url: '',
    twitter: '',
    telegram: '',
    discord: '',
    instagram: '',
    name: '',
    address,
    tokenId,
    author: '',
    animationType: '',
    attributes: undefined
  }
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString())
  const scaleMul = new BigNumber(10).pow(scalePow)
  return input.times(scaleMul)
}

export function valid(amount: string, decimals: number): boolean {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`)
  return regex.test(amount)
}

export function units(coinsValue: string, decimals: number): string {
  if (!valid(coinsValue, decimals)) throw new Error('Invalid amount')
  let i = coinsValue.indexOf('.')
  if (i < 0) i = coinsValue.length
  const s = coinsValue.slice(i + 1)
  return coinsValue.slice(0, i) + s + '0'.repeat(decimals - s.length)
}

export function coins(unitsValue: string, decimals: number): string {
  if (!valid(unitsValue, 0)) throw new Error('Invalid amount')
  if (decimals === 0) return unitsValue
  const s = unitsValue.padStart(1 + decimals, '0')
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`
}

export function formatShortAddress(addressFormat: string): string {
  return `${addressFormat.slice(0, 6)}...${addressFormat.slice(-6)}`
}

export function formatShortAddressDescriptionNft(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}...`
}

export function formatShortAddressWallet(addressFormat: string): string {
  return `${addressFormat.slice(0, 6)}`
}

export function dollarFormat(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatSymbol(tokenSymbol: string) {
  return tokenSymbol.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol
}

export function formatDomain(domain: string) {
  const domainName = domain?.substr(0, domain.lastIndexOf('.'))
  const domainType = domain?.substr(domain.lastIndexOf('.'))
  const formattedName = domainName.length > 9 ? `${domainName.substr(0, 3)}...${domainName.substr(-3)}` : domainName

  return `${formattedName}${domainType}`
}

export function safeFractionsName(erc20Name: string): string {
  return erc20Name.replace('Shares', 'Fractions').replace('shares', 'fractions')
}

export function isEnsContractAddress(address: string, chainId: number): boolean {
  const { decentraland, ens } = getChainConfigById(chainId)
  return address === ens.contractAddress || address === decentraland.ens.contractAddress
}

export const imgLH3 = (url: string, size: number): string => {
  return url.includes('https://lh3') ? `${url}=s${size}-c` : url
}
export const safeIpfsUrl = (url: string): string => {
  if (url.includes('ipfs')) {
    return url
  }
  return 'https://ipfs.io/ipfs/' + url
}

export const isBlacklisted = (chainId: number, type: 'contractAddress' | 'tokenId', item: string): boolean => {
  const { blacklist } = getChainConfigById(chainId)

  switch (type) {
    case 'contractAddress':
      return blacklist.contractAddresses.findIndex(blacklistedAddress => blacklistedAddress.toLowerCase() === item.toLowerCase()) > -1
    case 'tokenId':
      return blacklist.tokenIdList.findIndex(blacklistedTokenId => blacklistedTokenId.toLowerCase() === item.toLowerCase()) > -1
    default:
      return false
  }
}

export function isAllowedChain(chainId: number): boolean {
  return allowedChains.includes(chainId)
}

export const getErc721MetadataByTokenUri = async (tokenUri: string, tokenId: string, address: string) => {
  try {
    const metadata = await axios.get<{
      description: string
      image?: string
      imageUrl?: string
      previewUrl?: string
      author?: string
      social_media?: string
      web_site_url?: string
      twitter?: string
      telegram?: string
      discord?: string
      instagram?: string
      artist?: string
      createdBy?: string
      name: string
      animation_url?: string
      attributes?: Erc721Attribute[] | Record<string, unknown>
      properties: Erc721Properties
    }>(safeIpfsUrl(tokenUri))

    const author = getAuthor(metadata.data)

    const animation = await getAnimation(metadata.data)

    const { name, description, image, imageUrl } = metadata.data
    return { description, image_url: safeIpfsUrl(image || imageUrl || ''), name, address, tokenId, author, animation_url: animation }
  } catch (error) {
    Sentry.captureException(error)
  }

  return { description: '', image_url: '', name: '', address, tokenId, animation_url: '' }
}
export const sleep = (ms = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
