import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainConfig, getChainConfigById } from '../../../config'

export const nftfyPeerToPeerGraphQlClient = (chainId: number) => {
  const chain: ChainConfig = getChainConfigById(chainId)

  return new ApolloClient({
    uri: chain.nftfyPeerToPeerBaseUrl,
    typeDefs: undefined,
    resolvers: undefined,
    cache: new InMemoryCache({})
  })
}
