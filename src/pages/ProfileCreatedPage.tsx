import { useReactiveVar } from '@apollo/client'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { FooterCardMarketplace } from '../components/marketplace/FooterCardMarketplace'
import { FooterCardMarketplaceLoading } from '../components/marketplace/FooterCardMarketplaceLoading'
import EmptyState from '../components/shared/EmptyState'
import { CardTemplate } from '../components/shared/template/cards/CardTemplate'
import {
  marketplaceFiltersVar,
  sortingDirectionMarketplaceItemsVar,
  sortingFieldMarketplaceItemsVar
} from '../graphql/variables/MarketplaceVariable'
import { useChainConfig, useGlobalConfig } from '../hooks/ConfigHook'
import { useMarketplaceNfts } from '../hooks/MarketplaceHooks'
import { ProfilePageTemplate } from './shared/templates/ProfilePageTemplate'

export default function ProfileCreatedPage() {
  const sortingField = useReactiveVar(sortingFieldMarketplaceItemsVar)
  const sortingDirection = useReactiveVar(sortingDirectionMarketplaceItemsVar)
  const { paginationLimit } = useGlobalConfig()
  const { chainId } = useChainConfig()
  const marketplaceFilter = useReactiveVar(marketplaceFiltersVar)

  const { loading, hasMore, loadMore, nfts } = useMarketplaceNfts(marketplaceFilter, sortingDirection, sortingField, paginationLimit)

  const loader = (
    <S.CardsContainer>
      {[...Array(paginationLimit)].map(() => (
        <CardTemplate key={`loading-${Math.random()}`} loading>
          <FooterCardMarketplaceLoading loading />
        </CardTemplate>
      ))}
    </S.CardsContainer>
  )

  return (
    <ProfilePageTemplate> 
      {!loading && !nfts.length && <EmptyState />}
      <InfiniteScroll next={loadMore} hasMore={hasMore} loader={loader} dataLength={nfts.length}>
        <S.CardsContainer>
          {nfts.map(nftItem => {
            const image = String(nftItem?.metadata?.image)
            return (
              <CardTemplate
                key={`${nftItem.id}`}
                image={image}
                animation_url={nftItem?.metadata?.animation_url}
                name={String(nftItem?.metadata?.name)}
                isBoxNftCount={nftItem?.nftCount}
                collectionAddress={nftItem?.target.collection.id}
                url={`/marketplace/${nftItem.id}`}>
                <FooterCardMarketplace erc20Item={nftItem} chainId={Number(chainId)} />
              </CardTemplate>
            )
          })}
        </S.CardsContainer>
      </InfiniteScroll>
    </ProfilePageTemplate>
  )
}

export const S = {
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 4vw;
    justify-content: flex-start;
    align-items: flex-start;

    > div:last-of-type {
      margin-bottom: 4vw;
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      grid-template-columns: repeat(3, 1fr);

      > div:last-of-type {
        margin-bottom: 4vw;
      }
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }
  `
}
