import React, { useState } from 'react'
import styled from 'styled-components'
import { useWalletNft } from '../../hooks/WalletHooks'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'
import { DescriptionNft } from './DescriptionNft'
import { Purchase } from './Purchase'

interface ListingContainerProps {
  item: CollectiveBuyMarketplaceItem
}

export function ListingContainer({ item }: ListingContainerProps) {
  const [metaTab, setMetadataTab] = useState<'purchase' | 'description'>('purchase')

  return (
    <S.Container>
      <header>
        <button type='button' className={`${metaTab === 'purchase' ? 'active' : ''}`} onClick={() => setMetadataTab('purchase')}>
          Purchase
        </button>
        <button type='button' className={`${metaTab === 'description' ? 'active' : ''}`} onClick={() => setMetadataTab('description')}>
          Description
        </button>
      </header>
      <S.Content>
        {metaTab === 'description' && (
          <DescriptionNft
            tokenId={item.erc721?.tokenId || ''}
            author={item.erc721?.metadata?.author}
            owner={item.erc721?.ownerAddress}
            description={item.erc721?.metadata?.description}
            collectionId={item.erc721?.address || ''}
            boxCountNft={0}
          />
        )}
        {metaTab === 'purchase' && <Purchase item={item} />}
      </S.Content>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: ${props => props.theme.margin.small} 0;

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      padding: ${props => props.theme.margin.small};
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      padding: ${props => props.theme.margin.medium};
    }

    header {
      display: flex;
      align-items: center;
      gap: 24px;

      > button {
        border: none;
        background-color: transparent;
        padding: 0;
        cursor: pointer;
        height: fit-content;
        width: fit-content;
        color: ${props => props.theme.gray[4]};
        transition: color 250ms ease-in;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 25px;

        &.active {
          color: ${props => props.theme.blue.main};
        }
        &:active,
        &:focus {
          color: ${props => props.theme.blue.main};
        }
        &:hover,
        &:active {
          color: ${props => props.theme.blue.main};
        }
      }
    }
  `,
  Content: styled.div``
}
