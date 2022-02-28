import { useReactiveVar } from '@apollo/client'
import { Button, Tooltip } from 'antd'
import { now } from 'lodash'
import React, { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import clip from '../../assets/icons/clip.svg'
import notFound from '../../assets/notfound.svg'
import { getFeatureToggleByChainId } from '../../featureToggle'
import { claimModalVar } from '../../graphql/variables/PortfolioVariable'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { notifySuccess } from '../../services/NotificationService'
import { formatShortAddress, safeFractionsName } from '../../services/UtilService'
import { colors, colorsV2, fonts } from '../../styles/variables'
import { WalletERC20Share } from '../../types/WalletTypes'
import { ContractImage } from '../shared/ContractImage'
import *  as FaIcons from 'react-icons/fa';

export interface PortfolioListItemProps {
  erc20: WalletERC20Share
}

export function PortfolioListItem({ erc20 }: PortfolioListItemProps) {
  const [price, setPrice] = useState<string | undefined>(undefined)
  const chainId = useReactiveVar(chainIdVar)
  const featureToggle = getFeatureToggleByChainId(chainId)

  useEffect(() => {
    const getPrice = async () => {
      setPrice(erc20.liquidity?.priceDollar === '' ? '0' : erc20.liquidity?.priceDollar)
    }
    getPrice()
  }, [chainId, erc20.liquidity, erc20.name])

  return (
    <>
      <S.DivImage>
        <ContractImage src={erc20.metadata?.image || notFound} name={erc20.target.collection?.name || ''} large={false} />
        <div>
          <S.Span>
            <S.Link to={`/marketplace/${erc20.id}`}>{`${safeFractionsName(erc20.name)} `}</S.Link>
            <S.Symbol>{erc20.symbol}</S.Symbol>
          </S.Span>
          <S.ClipBoard text={erc20.id} onCopy={() => notifySuccess('Copied!')}>
            <Tooltip placement='right' title='Copy ERC20 Shares Address'>
              <h6>{formatShortAddress(erc20.id)}</h6>
              <FaIcons.FaCopy style={{marginLeft: '0.5rem'}}/>
            </Tooltip>
          </S.ClipBoard>
        </div>
      </S.DivImage>
      <S.Line>
        <S.Span>{price ? `$${Number(price).toLocaleString('en-us', { maximumFractionDigits: 2 })}` : '-'}</S.Span>
      </S.Line>
      <S.Line>
        <S.Span>{Number(erc20.balance).toLocaleString('en-us', { maximumFractionDigits: 6 })}</S.Span>
      </S.Line>
      <S.Line>
        {(erc20.released || (erc20.cutoff && now() / 1000 > erc20.cutoff)) && <S.Claim onClick={() => claimModalVar(erc20)}>Claim</S.Claim>}
        {featureToggle?.portfolio.trade && <S.ActionButton href={`#/marketplace/${erc20.id}`}>Trade</S.ActionButton>}
      </S.Line>
    </>
  )
}
export const S = {
  DivImage: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;

    .ant-image {
      margin-right: 16px;
    }

    .ant-skeleton-element .ant-skeleton-avatar {
      vertical-align: baseline;
    }
    h3.ant-skeleton-title {
      margin-left: 16px;
    }
  `,

  ClipBoard: styled(CopyToClipboard)`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${props=>props.theme.gray['4']};
    h6 {
      font-size: 12px;
      margin-right: 5px;
      color: ${props=>props.theme.gray['4']};
    }
  `,
  Line: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    .green {
      color: ${colors.green1};
    }
    .red {
      color: ${colors.red1};
    }
  `,
  Span: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${props=>props.theme.gray['2']};
  `,
  SpanGray: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${colors.gray5};
    margin-left: 8px;
  `,
  Symbol: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;

    color: ${colors.gray5};
  `,
  Link: styled(Link)`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: ${props=>props.theme.gray['4']};
  `,
  ActionButton: styled(Button)`
    height: 32px;

    background: ${colors.blue1};
    border-radius: 8px;

    box-shadow: none;
    border: none;
    outline: none;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    color: ${colors.white};

    padding: 0 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${colors.blue1};
      color: ${colors.white};
      box-shadow: none;
      border: none;
      outline: none;
      opacity: 0.8;
    }
    &:focus {
      background: ${colors.blue1};
      color: ${colors.white};
      box-shadow: none;
      border: none;
      outline: none;
      opacity: 0.8;
    }

    &:not(:first-child) {
      margin-left: 8px;
    }
  `,
  Claim: styled(Button)`
    height: 32px;

    background: ${colorsV2.green.main};
    border-radius: 8px;

    box-shadow: none;
    border: none;
    outline: none;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    color: ${colors.white};

    padding: 0 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${colorsV2.green.light};
      color: ${colors.white};
      box-shadow: none;
      border: none;
      outline: none;
      opacity: 0.8;
    }
    &:focus {
      background: ${colorsV2.green.light};
      color: ${colors.white};
      box-shadow: none;
      border: none;
      outline: none;
      opacity: 0.8;
    }

    &:not(:first-child) {
      margin-left: 8px;
    }
  `
}
