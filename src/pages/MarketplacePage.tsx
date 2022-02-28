import { useReactiveVar } from '@apollo/client'
import { Button, Input } from 'antd'
import React, { useEffect, useState, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { FooterCardMarketplace } from '../components/marketplace/FooterCardMarketplace'
import { FooterCardMarketplaceLoading } from '../components/marketplace/FooterCardMarketplaceLoading'
import { PaginationButton } from '../components/shared/buttons/PaginationButton'
import EmptyState from '../components/shared/EmptyState'
import { CardTemplate } from '../components/shared/template/cards/CardTemplate'
import {
  marketplaceFiltersVar,
  sortingDirectionMarketplaceItemsVar,
  sortingFieldMarketplaceItemsVar
} from '../graphql/variables/MarketplaceVariable'
import { useChainConfig, useGlobalConfig } from '../hooks/ConfigHook'
import { useMarketplaceNfts } from '../hooks/MarketplaceHooks'
import { colors, colorsV2, fonts, viewportMargin, viewportV2 } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import Sidebar from '../components/marketplace/Sidebar';
import * as IoIcons from 'react-icons/io';
import { MarketplaceERC20Item } from '../types/MarketplaceTypes'
import { marketplaceService } from '../services/MarketplaceService'
import { MarketplaceFilter } from '../graphql/variables/MarketplaceVariable'

export default function MarketplacePage() {
  const sortingField = useReactiveVar(sortingFieldMarketplaceItemsVar)
  const sortingDirection = useReactiveVar(sortingDirectionMarketplaceItemsVar)
  const { paginationLimit } = useGlobalConfig()
  const { chainId } = useChainConfig()
  const marketplaceFilter = useReactiveVar(marketplaceFiltersVar)
  const [nfts, setNfts] = useState<MarketplaceERC20Item[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [incomplete, setIncomplete] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fracApiVersion, setFracApiVersion] = useState<1 | 2>(2)
  const { marketplaceBlacklist } = useChainConfig()
  const[searchKey, setSearchKey] = useState('');
  const[searchName, setSearchName] = useState('');
  const[sidebar, setSidebar] = useState(false);

  // const { loading, hasMore, loadMore, nfts } = useMarketplaceNfts(marketplaceFilter, sortingDirection, sortingField, paginationLimit)

  const loader = (
    <S.CardsContainer>
      {[...Array(paginationLimit)].map(() => (
        <CardTemplate key={`loading-${Math.random()}`} loading>
          <FooterCardMarketplaceLoading loading />
        </CardTemplate>
      ))}
    </S.CardsContainer>
  )

  const sidebarChange = () => {
    setSidebar(!sidebar);
  }
    
  const searchHandler = (e) => {
    e.preventDefault();
    setSearchKey(e.target.value);
  }

  const changeSearchName = (e:any, val:string) => {
    e.preventDefault()
    setSearchName(val)
    setSearchKey(val)
  }

  const setFilteredNfts = useCallback(
    (items: MarketplaceERC20Item[]) => {
      const filteredItems: MarketplaceERC20Item[] =
        chainId && marketplaceBlacklist ? items.filter(item => !marketplaceBlacklist.includes(item.id)) : items
      setNfts(filteredItems)
    },
    [marketplaceBlacklist, chainId]
  )

  const addItems = useCallback(
    (nftItems: MarketplaceERC20Item[]) => {
      setFilteredNfts(nfts.concat(nftItems))
    },
    [nfts, setFilteredNfts]
  )

  useEffect(() => {
    if (chainId && marketplaceFilter) {
      const getInitialNfts = async () => {
        setLoading(true)
        setHasMore(true)
        const nftItems = await marketplaceService(chainId, 2).getMarketplaceItems(
          sortingDirection,
          sortingField,
          paginationLimit,
          marketplaceFilter,
          offset,
          searchName
        )

        setFilteredNfts(nftItems)
        setOffset(nftItems.length)
        setLoading(false)

        if (nftItems.length < paginationLimit) {
          setHasMore(false)
        }
      }
      getInitialNfts()
    } else {
      setLoading(false)
      setHasMore(false)
    }
  }, [chainId, marketplaceFilter, paginationLimit, setFilteredNfts, sortingDirection, sortingField, searchName])

  const loadMore = useCallback(
    async (customOffset?: number, customPaginationLimit?: number) => {
      if (chainId) {
        const nftItems = await marketplaceService(chainId, fracApiVersion).getMarketplaceItems(
          sortingDirection,
          sortingField,
          customPaginationLimit || paginationLimit,
          marketplaceFilter,
          customOffset || offset,
          searchName
        )

        if (nftItems) {
          const newOffset = offset + nftItems.length
          addItems(nftItems)
          setOffset(newOffset)
        }

        if (nftItems.length < paginationLimit && fracApiVersion === 2 && marketplaceFilter === MarketplaceFilter.all) {
          setFracApiVersion(1)
          if (paginationLimit - nftItems.length > 0) {
            setIncomplete(true)
          }
        } else if (fracApiVersion === 1 || marketplaceFilter !== MarketplaceFilter.all) {
          setHasMore(false)
          setLoading(false)
        }
      }
    },
    [addItems, chainId, marketplaceFilter, fracApiVersion, offset, paginationLimit, sortingDirection, sortingField, searchName]
  )

  useEffect(() => {
    if (incomplete) {
      loadMore(0, 100)
      setIncomplete(false)
    }
  }, [fracApiVersion, incomplete, loadMore])
  return (
    <>    
    <Sidebar sidebarChange = {sidebarChange} handleFilter = {marketplaceFiltersVar} />
    <DefaultPageTemplate bgGray sidebar={sidebar}> 
      <div style={{margin: '0 0 10px 0'}}>
        <S.Title>Recent Products</S.Title>
        <S.Input onChange = {(e) => searchHandler(e)} value={searchKey} type='text' placeholder='Search'></S.Input>
        <div style={{display: 'inline-block', width: '230px'}}>
          <S.Button onClick = {(e) => changeSearchName(e, searchKey)}>
            <IoIcons.IoMdSearch style={{width: '20px', height: '20px', marginBottom: '-7px'}} />
            Search
          </S.Button>
          <S.Button onClick = {(e) => changeSearchName(e, '')}>
            <IoIcons.IoMdSync style={{width: '20px', height: '20px', marginBottom: '-5px'}} />
            Reset
          </S.Button>
        </div>
      </div>
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
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Title: styled.div `
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props:any)=>props.theme.black}
  `,
  Button: styled(Button)`
    margin-right: 20px !important;
    background-color: ${colors.red1};
    color: ${colors.white};
    border-radius: 5px !important;
    padding: 3px 15px 5px 15px !important;
    cursor: pointer !important;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      opacity: 0.8;
    }
    margin-top: 20px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 0px;
      margin-right: 0px !important;
      margin-left: 20px !important;
      float: right;
      margin-bottom: -10px;
    }
  `,
  Input: styled(Input)`
    padding: 0.375rem 0.75rem;
    fontSize: 0.875rem;
    lineHeight: 1.5;
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    backgroundClip: padding-box;
    border: 1px solid ${(props)=>props.theme.gray['2']};
    borderRadius: 0.25rem;
    marginBottom: 10px;
    width: 100%;
    display: inline-block;

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: calc(100% - 230px);
    }
  `,
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
  `,
  Filter: styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    box-shadow: none;
    margin-bottom: ${viewportMargin.base};

    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      border: none;
      box-shadow: none;
    }

    > div {
      display: flex;
      align-items: center;

      &.without-filter {
        width: 100%;
        > button {
          margin-left: auto;
        }
      }

      > div:nth-child(1) {
        display: flex;
        align-items: center;

        span {
          font-family: ${fonts.nunito};
          font-style: normal;
          font-weight: 600;
          font-size: 1.4rem;
          line-height: 1.6rem;
          color: ${colorsV2.gray[3]};
          margin-right: 8px;
        }
      }
    }

    @media (min-width: ${viewportV2.tablet}) {
      margin-bottom: ${viewportMargin.base};
    }

    @media (min-width: ${viewportV2.desktop}) {
      margin-bottom: ${viewportMargin.tablet};
    }
  `,

  Pagination: styled(PaginationButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.white};

    .hide {
      display: none;
    }
  `,
  LoadMoreButton: styled(Button)`
    width: 100%;
    max-width: 304px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    color: ${colorsV2.white};
    background-image: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    margin: 0 auto;

    &:active,
    &:focus,
    &:hover {
      opacity: 0.75;
      color: ${colorsV2.white};
      background-image: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    }
  `
}
