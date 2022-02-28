import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainConfig, getChainConfigById } from '../../../config'

export const nftfyFracGraphQlClientV2 = async (chainId: number) => {
  const chain: ChainConfig = getChainConfigById(chainId)
  const cache = new InMemoryCache()

  return new ApolloClient({
    uri: chain.nftfy2FracBaseUrl,
    cache
  })
}
