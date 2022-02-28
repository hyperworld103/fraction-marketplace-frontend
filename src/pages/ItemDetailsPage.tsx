import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import styled from 'styled-components'
import { Image } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import {API} from '../constants/api';
import { Erc721Image } from '../components/shared/Erc721Image'
import * as IoIcons from 'react-icons/io';
import { useWalletNft } from '../hooks/WalletHooks'
import { FractionalizeDetailsCardsLoading } from '../components/fractionalize/FractionalizeDetailsCardsLoading'
import { safeIpfsUrl } from '../services/UtilService'

export default function NftDetailsPage() {
  const history = useHistory()
  const { itemId } = useParams<{ itemId: string }>()
  const { erc721 } = useWalletNft(itemId)

  if (!erc721) {
    return (
      <DefaultPageTemplate>
        <FractionalizeDetailsCardsLoading />
      </DefaultPageTemplate>
    )
  }
  const Back = (e) => {
    e.preventDefault();
    history.push('/collection/view/' + erc721?.address);
  }
  return (
    <DefaultPageTemplate>
      <S.Content>
        <S.LeftContent>
        <S.Back onClick={(e)=>Back(e)}>
            <IoIcons.IoMdArrowBack style={{marginBottom: '-2px', marginRight: '5px'}} />
            Back
          </S.Back>
          <S.Title>{erc721.metadata?.name}</S.Title>
            <Erc721Image
                image={erc721.metadata?.imageFull || ''}
                name={erc721.metadata?.name || `${erc721.name} #${erc721.tokenId}`}
                animation={erc721.metadata?.animation_url}
                animationType={erc721.metadata?.animationType}
              />
          <S.Ipfs>
            <a href={erc721.animationType==='image'?safeIpfsUrl(erc721.metadata?.image) :safeIpfsUrl(erc721.metadata?.animation_url)} target='_blank' rel="noopener noreferrer">View on IPFS</a>
          </S.Ipfs>
          <S.EtherScan>
            <a href={erc721&&API.etherscan_url + erc721.address} target='_blank' rel="noopener noreferrer">View on FtmScan</a>
          </S.EtherScan>
        </S.LeftContent>
        <S.RightContent>
          <S.Row>             
            <S.Sub>Author:</S.Sub>
            {erc721.metadata?.author}
          </S.Row>
          <S.Contract>             
            <S.Sub>Contract Address:</S.Sub>
            {erc721?.address}
          </S.Contract>
          <S.Row>             
            <S.Sub>Token Id:</S.Sub>
            {erc721?.tokenId}
          </S.Row>
          <S.Row>             
            <S.Sub>Like:</S.Sub>
            {erc721?.likes}
          </S.Row>
          <S.Row>             
            <S.Sub>Views:</S.Sub>
            {erc721?.views}
          </S.Row>
          <S.Row>
            <S.Sub>Description: </S.Sub>
            <S.TextArea maxLength={1000} showCount rows={7} value={erc721.metadata?.description} readOnly />
          </S.Row>
          {/* <Button>Close Sale</Button> */}
        </S.RightContent>
      </S.Content>
    </DefaultPageTemplate>
  )
}

const S = {
  Content: styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 1rem;
    align-items: center;
  `,
  LeftContent: styled.div `
    width: 100%;
    backgound: ${props => props.theme.gray['0']};

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: 50%;
      display: inline-block;
    }
    @media (min-width: ${props => props.theme.viewport.desktopl}) {
      padding-right: 3rem;
    }
  `,
  Image: styled(Image) `
    width: 100%;
    min-height: 300px;
  `,
  Title: styled.div `
    font-size: 3rem;
    font-weight: 600;
    color: ${props=>props.theme.gray['4']};
    margin-bottom: 2rem;
  `,
  Back: styled.div `
    width: 60px;
    font-size: 1rem;
    color: ${props=>props.theme.gray['4']};
    cursor: pointer;
  `,
  Ipfs: styled.div `
    margin-top: 2rem;
  `,
  EtherScan: styled.div `
    margin-top: 0.1rem;
  `,
  RightContent: styled.div `
    width: 100%;
    backgound: ${props => props.theme.gray['1']};
    margin-top: 2rem;
    border: 0;
    border-radius: 20px;

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: 50%;
      padding-left: 2rem;      
      display: inline-block;
      margin-top: 3rem;
    }
    @media (min-width: ${props => props.theme.viewport.desktopl}) {
      padding-left: 3rem;
    }
  `,
  TextArea: styled(TextArea)`
    border-radius: 8px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    .ant-input {
      color: ${(props)=>props.theme.gray['2']};
      background: ${(props)=>props.theme.gray['0']};
      border: 1px solid ${(props)=>props.theme.gray['2']};
      font-size: 16px;
      line-height: 1.5rem;
    }
  `,
  Row: styled.div `
    font-size: 16px;
    color: ${props=>props.theme.gray['2']};
    line-height: 1.5rem;
  `,
  Contract: styled.div `
    font-size: 14px;
    color: ${props=>props.theme.gray['2']};
    line-height: 1.5rem;
    margin-bottom: 15px;
    @media (min-width: ${props => props.theme.viewport.mobile}) {
      font-size: 16px;
    }
  `,
  Sub: styled.p ` 
    width: 150px;
    font-size: 16px;
    color: ${props=>props.theme.gray['3']};
    display: inline-block;
  `
}