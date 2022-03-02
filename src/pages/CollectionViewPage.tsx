import { Button, Input } from 'antd'
import * as IoIcons from 'react-icons/io';
import { colors } from '../styles/variables'
import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import EmptyState from '../components/shared/EmptyState'
import CollectionMain from '../components/collection/CollectionMain';
import { Footer } from '../components/shared/layout/footer/Footer'
import Navbarmenu from '../components/shared/layout/header/Navbarmenu'
import { getCollectionInfo } from '../services/CollectionService'
import { NftCard } from '../components/shared/cards/NftCard'
import { globalConfig } from '../configV2'
import { WalletErc721Item } from '../types/WalletTypes'
import { walletService } from '../services/WalletService'
import { WalletProvider } from '../graphql/variables/WalletVariable'

export default function CollectionViewPage() {
  const { address } = useParams<{ address: string }>()
  const [collection, setCollection] = useState({});
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

  useEffect(()=>{
    getCollection();
  }, [])

  const getCollection = async () => {
    let data = {contract_address: address};
    let collectionData = await getCollectionInfo(data);
    console.log(collectionData);
    setCollection(collectionData);
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

  useEffect(() => {
    const getInitialNfts = async () => {
      if (collection) {
        if(!collection['_id']) return;
        try {
          const nftItems = await walletService(WalletProvider.api).get721Items(
            0,
            paginationLimit,
            searchName,
            collection['_id']
          )

          setNfts(nftItems)

          if ( nftItems.length < paginationLimit ) {
            setHasMore(false)
          }
        } catch (error) {
          setAlertError(true)
        }
      }
      setLoading(false)
    }
    getInitialNfts()
  }, [collection, searchName])

  const getNextNfts = async () => {
    if (collection) {
      if(!collection['_id']) return;
      try {
        const nftItems = await walletService(WalletProvider.api).get721Items(
          offset,
          paginationLimit,
          searchName,
          collection['_id']
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
  }

  return (
    <S.Div>
      <Navbarmenu />
      <S.Main>
        <CollectionMain contract_address={collection['contract_address']} id={collection['_id']} name={collection['name']} logo={collection['image']} banner={collection['banner']} item_count={collection['item_count']} royalties={collection['royalties']} volume_traded={collection['volume_traded']}/>
      </S.Main>   
      <S.Contents>
        <div style={{marginBottom: '20px'}}>
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
                  url={`/items/${nftItem.id}`}
                  fractionalize
                  size='small'
                />
              )
            })}
          </S.CardsContainer>
        </InfiniteScroll>
      </S.Contents>
      <Footer />
    </S.Div>
  )
}

export const S = {
  Div: styled.div `
    background: ${props => props.theme.white};
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
  Main: styled.div `
    width: 100%;
    background: #F6F6F6;
    margin-top: 96px;
  `,
  Contents: styled.div `
    width: 100%;
    padding: 3px 24px;
    width: 100%;
    min-height: 34vh;
    background: ${props => props.theme.white};
    display: block;
    align-items: center;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      min-height: 39vh;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      min-height: 54.2vh;
    }
    @media (min-width: 1150px) {
      width: 90%;
      margin: auto;
    }
    @media (min-width: ${props => props.theme.viewport.desktopl}) {
      width: 80%;
      margin: auto;
    }
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      width: 80%;
      margin: auto;
      min-height: 33.3vh;
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

    @media (min-width: 1150px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 6vw;
    }

    @media (min-width: ${props => props.theme.viewport.desktopl}) {
      grid-template-columns: repeat(3, 1fr);
      gap: 6vw;
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      grid-template-columns: repeat(3, 1fr);
      gap: 6vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }

    @media (min-width: 1500px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }

    @media (min-width: 1680px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 4vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }
  `
}
