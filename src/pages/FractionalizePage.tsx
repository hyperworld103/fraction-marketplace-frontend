import { Button, Input } from 'antd'
import * as IoIcons from 'react-icons/io';
import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { NftCard } from '../components/shared/cards/NftCard'
import { globalConfig } from '../configV2'
import { colors, fonts, viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { WalletErc721Item } from '../types/WalletTypes'
import { walletService } from '../services/WalletService'
import { WalletProvider } from '../graphql/variables/WalletVariable'
import EmptyState from '../components/shared/EmptyState'

export default function FractionalizePage() {
  
  const[searchKey, setSearchKey] = useState('');
  const [searchName, setSearchName] = useState('')

  const [alertError, setAlertError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState<WalletErc721Item[]>([])

  const { paginationLimit } = globalConfig

  const [offset, setOffset] = useState(paginationLimit)
  const [hasMore, setHasMore] = useState(true)

  const loadingCards = (
    <S.CardsContainer>
      {[...Array(paginationLimit)].map(() => (
        <NftCard key={`loading-${Math.random()}`} loading fractionalize size='small' />
      ))}
    </S.CardsContainer>
  )
  const searchHandler = (e) => {
    e.preventDefault();
    setSearchKey(e.target.value);
  }

  const changeSearchName = (e:any, val:string) => {
    e.preventDefault()
    setSearchName(val)
    setSearchKey(val)
  }

  useEffect(() => {
    const getInitialNfts = async () => {
      try {
        const nftItems = await walletService(WalletProvider.api).get721Items(
          0,
          paginationLimit,
          searchName
        )

        setNfts(nftItems)

        if ( nftItems.length < paginationLimit ) {
          setHasMore(false)
        }
      } catch (error) {
        setAlertError(true)
      }
      setLoading(false)
    }
    getInitialNfts()
  }, [searchName])

  const getNextNfts = async () => {
    try {
      const nftItems = await walletService(WalletProvider.api).get721Items(
        offset,
        paginationLimit,
        searchName
      )

      setNfts([...nfts, ...nftItems])
      setOffset(offset + paginationLimit)

      if (nftItems.length < paginationLimit) {
        setHasMore(false)
      }
    } catch (error) {
      setAlertError(true)
    }
  }
  
  console.log(nfts);
  return (
    <DefaultPageTemplate>
      <div style={{marginBottom: '20px', marginTop: '50px'}}>
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
      <InfiniteScroll dataLength={nfts.length} next={getNextNfts} hasMore={hasMore} loader={loadingCards}>
        <S.CardsContainer>
          {nfts.map(nftItem => {
            return (
              <NftCard
                key={`${nftItem.id}`}
                name={nftItem.metadata?.name || `${nftItem.name} #${nftItem.tokenId}`}
                typeName={nftItem.name}
                image={nftItem.metadata?.image}
                metadata={nftItem.metadata}
                address={nftItem.address}
                url={`/wallet/fractionalize/${nftItem.id}`}
                fractionalize
                size='small'
              />
            )
          })}
        </S.CardsContainer>
      </InfiniteScroll>
      {!loading && !nfts.length && (
        <S.BoxMessage>
          <S.H1>No NFT in your wallet</S.H1>
          <S.Span>You can buy one in our marketplace</S.Span>
          <S.Button href='/#/marketplace'>Marketplace</S.Button>
        </S.BoxMessage>
      )}
    </DefaultPageTemplate>
  )
}

export const S = {
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 24px 24px;
    margin: 20px 0 32px;

    @media (max-width: ${viewport.xl}) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media (max-width: ${viewport.lg}) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media (max-width: ${viewport.md}) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: ${viewport.sm}) {
      grid-template-columns: 1fr;
    }
  `,
  EmptyNft: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;

    span {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 32px;
      color: ${colors.gray1};
      margin-top: 20px;
    }

    small {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: ${colors.gray1};
    }

    @media (max-width: ${viewport.sm}) {
      span {
        text-align: center;
      }

      small {
        text-align: center;
      }
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
  BoxMessage: styled.section`
    flex: 1;
    background: ${props=>props.theme.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 5px;

    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: 8px;

    @media (max-width: ${viewport.md}) {
      text-align: center;
    }
  `,
  H1: styled.h1`
    margin-bottom: 8px;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 2.3rem;
    line-height: 3rem;

    color: ${props=>props.theme.gray['3']};
    @media (max-width: ${viewport.md}) {
      font-size: 2.2rem;
    }
  `,
  Span: styled.span`
    margin-bottom: 16px;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 2.2rem;

    color: ${props=>props.theme.gray['3']};
    @media (max-width: ${viewport.md}) {
      font-size: 1.2rem;
    }
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
}
