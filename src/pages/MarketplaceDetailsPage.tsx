import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HowItWorks } from '../components/collective-buy/HowItWorks'
import { ListingContainerSkeleton } from '../components/collective-buy/ListingContainerSkeleton'
import { NftDetailSkeleton } from '../components/collective-buy/NftDetailSkeleton'
import { Erc721Loading } from '../components/marketplace/details/Erc721Loading'
import { accountVar, chainIdVar } from '../graphql/variables/WalletVariable'
import CollectiveBuyMarketplaceDetailsPage from './marketplace-details/CollectiveBuyMarketplaceDetailsPage'
import DefaultMarketplaceDetailsPage from './marketplace-details/DefaultMarketplaceDetailsPage'
import TwoColumnsPageTemplate from './shared/templates/TwoColumnsPageTemplate'

// eslint-disable-next-line no-shadow
export enum MarketplacePageType {
  default = 'default',
  listing = 'listing'
}

export default function MarketplaceDetailsPage() {
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const { address, target, routeChainId, type } = useParams<{ address: string; target: string, routeChainId?: string | undefined; type?: string | undefined }>()
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (routeChainId) {
      setSelectedChainId(Number(routeChainId))
    } else {
      setSelectedChainId(chainId)
    }
  }, [chainId, routeChainId])

  if (!selectedChainId) {
    if (type && type === MarketplacePageType.listing) {
      return (
        <TwoColumnsPageTemplate
          topLeftContainer={<NftDetailSkeleton />}
          topRightContainer={<ListingContainerSkeleton />}
          bottomContainer={<HowItWorks />}
        />
      )
    }

    return <Erc721Loading />
  }

  if (type && type === MarketplacePageType.listing) {
    return <CollectiveBuyMarketplaceDetailsPage address={address} itemId={target} account={account} selectedChainId={selectedChainId} />
  }

  return <DefaultMarketplaceDetailsPage account={account} itemId={target} address={address} selectedChainId={selectedChainId} />
}
