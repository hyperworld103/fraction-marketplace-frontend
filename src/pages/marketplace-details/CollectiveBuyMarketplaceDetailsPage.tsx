import React, { useEffect } from 'react'
import { HowItWorks } from '../../components/collective-buy/HowItWorks'
import { ListingContainer } from '../../components/collective-buy/ListingContainer'
import { ListingContainerSkeleton } from '../../components/collective-buy/ListingContainerSkeleton'
import { NftDetails } from '../../components/collective-buy/NftDetails'
import { NftDetailSkeleton } from '../../components/collective-buy/NftDetailSkeleton'
import { useCollectiveBuyNft } from '../../hooks/CollectiveBuyHooks'
import { Page404 } from '../Page404'
import TwoColumnsPageTemplate from '../shared/templates/TwoColumnsPageTemplate'

export interface CollectiveBuyMarketplaceDetailsPageProps {
  address: string
  itemId: string
  account: string | undefined
  selectedChainId: number
}

export default function CollectiveBuyMarketplaceDetailsPage({ address, itemId, selectedChainId }: CollectiveBuyMarketplaceDetailsPageProps) {
  const { item, loading } = useCollectiveBuyNft(address, selectedChainId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <TwoColumnsPageTemplate
        canGoBack
        topLeftContainer={<NftDetailSkeleton />}
        topRightContainer={<ListingContainerSkeleton />}
        bottomContainer={<HowItWorks />}
      />
    )
  }

  if (!item && !loading) {
    return <Page404 />
  }

  return (
    <TwoColumnsPageTemplate
      canGoBack
      topLeftContainer={item?.erc721 && <NftDetails name={item?.name} symbol={item?.symbol} erc721={item?.erc721} />}
      topRightContainer={item && <ListingContainer item={item} />}
      bottomContainer={<HowItWorks />}
    />
  )
}
