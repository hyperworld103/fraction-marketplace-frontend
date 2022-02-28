import { ApolloClient, InMemoryCache } from '@apollo/client'

export const graphQlClient = async (chainId: number, uri: string) => {
  const cache = new InMemoryCache()

  return new ApolloClient({
    uri,
    cache
  })
}
