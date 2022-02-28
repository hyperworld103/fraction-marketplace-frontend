import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainConfig, getChainConfigById } from '../../config'

export const boxGraphQlClient = (chainId: number) => {
  const chain: ChainConfig = getChainConfigById(chainId)

  return new ApolloClient({
    uri: chain.box.subgraphUrl,
    typeDefs: undefined,
    resolvers: undefined,
    cache: new InMemoryCache({})
  })
}
