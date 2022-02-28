import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainConfig, getChainConfigById } from '../../../config'

export const nftfyNftGraphQlClient = (chainId: number) => {
  const chain: ChainConfig = getChainConfigById(chainId)

  return new ApolloClient({
    uri: chain.nftfyNftBaseUrl,
    typeDefs: undefined,
    resolvers: undefined,
    cache: new InMemoryCache({})
  })
}
