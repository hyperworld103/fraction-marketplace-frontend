import { useReactiveVar } from '@apollo/client'
import { Tooltip } from 'antd'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'
import copyIcon from '../../assets/icons/clip-blue.svg'
import external from '../../assets/icons/external-link-blue.svg'
import { getChainConfigById } from '../../config'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { notifySuccess } from '../../services/NotificationService'
import { formatShortAddressDescriptionNft } from '../../services/UtilService'

interface DescriptionNftProps {
  tokenId: string
  collectionId: string
  author?: string
  owner?: string
  totalSupply?: string
  description?: string
  boxCountNft?: number
  className?: string
  isBox?: boolean
}

const copyAddress = () => {
  notifySuccess('Address copied!')
}

export function DescriptionNft({
  tokenId,
  author,
  totalSupply,
  owner = '',
  description,
  collectionId,
  boxCountNft,
  isBox,
  className
}: DescriptionNftProps) {
  const chainId = useReactiveVar(chainIdVar)
  const { etherscanAddress } = getChainConfigById(chainId)
  return (
    <S.Container className={className}>
      <S.ContainerCreator>
        <div>
          <Jazzicon diameter={32} seed={jsNumberForAddress(tokenId)} />
          <div>
            <h2>Creator</h2>
            <span>{`${author ? formatShortAddressDescriptionNft(author) : '-'}`}</span>
          </div>
        </div>
        {!!owner && (
          <div>
            <Jazzicon diameter={32} seed={jsNumberForAddress(tokenId)} />
            <div>
              <h2>Owner</h2>
              <span>{`${formatShortAddressDescriptionNft(owner)}`}</span>
            </div>
          </div>
        )}
      </S.ContainerCreator>
      {!isBox && <h2>{`Edition: 1/${totalSupply || 1}`}</h2>}
      {isBox && <h2>{`N° of NFTs: ${boxCountNft || 0}`}</h2>}
      <S.ContainerInfos>
        <S.CopyToClipboard onCopy={copyAddress} text={collectionId}>
          <Tooltip placement='bottomLeft' title='Click to copy ERC721 address'>
            <small>{formatShortAddressDescriptionNft(collectionId)}</small>
            <img src={copyIcon} alt='Copy ERC721 address' />
          </Tooltip>
        </S.CopyToClipboard>
        <span>{`Token ID: ${tokenId}`}</span>
        <a rel="noopener noreferrer" target='_blank' href={`https://opensea.io/assets/${collectionId}/${tokenId}`}>
          <span>View on open sea</span>
          <img src={external} alt='redirect' />
        </a>
        <a rel="noopener noreferrer" target='_blank' href={`${etherscanAddress}/address/${collectionId}`}>
          <span>View on etherscan</span>
          <img src={external} alt='redirect' />
        </a>
      </S.ContainerInfos>
      <p>{description}</p>
    </S.Container>
  )
}

const S = {
  Container: styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;

    > h2 {
      font-weight: 600;
      font-size: 20px;
      line-height: 27px;
      color: ${props => props.theme.black};
    }

    p {
      margin: 0;
      font-size: 12px;
      white-space: break-spaces;
      word-break: break-word;
    }
  `,
  ContainerCreator: styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    > div {
      display: flex;
      gap: 10px;
      align-items: center;
      > div {
        display: flex;
        flex-direction: column;

        h2 {
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          ${props => props.theme.gray[4]}
        }

        span {
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: ${props => props.theme.blue.main};
        }
      }
    }
  `,
  ContainerInfos: styled.div`
    display: flex;
    flex-direction: column;
    span {
      font-size: 14px;
      line-height: 19px;
      ${props => props.theme.gray[4]}
    }
    a {
      color: ${props => props.theme.blue.main};
      text-decoration: none;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 14px;
      line-height: 19px;
    }
  `,
  CopyToClipboard: styled(CopyToClipboard)`
    font-style: normal;
    font-weight: normal;
    color: ${props => props.theme.blue.main};
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      margin-left: 8px;
      width: 16px;
      height: 16px;
    }
    &:hover {
      opacity: 0.8;
    }
  `
}
