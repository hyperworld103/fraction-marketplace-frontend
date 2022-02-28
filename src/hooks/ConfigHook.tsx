import { useReactiveVar } from '@apollo/client'
import { chainConfig, globalConfig, GlobalConfigV2 } from '../configV2'
import { FeatureToggle, getFeatureToggleByChainId } from '../featureToggle'
import { chainIdVar } from '../graphql/variables/WalletVariable'

interface ChainConfigV2Migration {
  chainId: number | undefined
  marketplaceBlacklist: string[]
}

export function useGlobalConfig(): GlobalConfigV2 {
  return globalConfig
}

export function useChainConfig(): ChainConfigV2Migration {
  const chainId = useReactiveVar(chainIdVar)
  const config = chainConfig(chainId)
  return { chainId: config?.chainId, marketplaceBlacklist: config?.marketplaceBlacklist || [] }
}

export function useFeatureToggle(): FeatureToggle | undefined {
  const { chainId } = useChainConfig()

  if (chainId) {
    return getFeatureToggleByChainId(chainId)
  }

  return undefined
}
