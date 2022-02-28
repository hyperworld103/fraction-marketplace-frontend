import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainConfig, getChainConfigById } from '../../../config'

export const nftfyFracGraphQlClientV1 = async (chainId: number) => {
  const chain: ChainConfig = getChainConfigById(chainId)
  const cache = new InMemoryCache()

  return new ApolloClient({
    uri: chain.nftfyFracBaseUrl,
    cache
  })
}
