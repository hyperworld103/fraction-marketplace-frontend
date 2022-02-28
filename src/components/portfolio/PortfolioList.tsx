import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Collapse, Tooltip } from 'antd'
import { now } from 'lodash'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import clip from '../../assets/icons/clip.svg'
import { getFeatureToggleByChainId } from '../../featureToggle'
import { claimModalVar } from '../../graphql/variables/PortfolioVariable'
import { chainIdVar, connectWalletModalVar } from '../../graphql/variables/WalletVariable'
import { notifySuccess } from '../../services/NotificationService'
import { setPortfolioItemsLiquidity } from '../../services/PortfolioService'
import { formatShortAddress } from '../../services/UtilService'
import { colors, colorsV2, fonts, viewport } from '../../styles/variables'
import { WalletERC20Share } from '../../types/WalletTypes'
import { HeaderMobile } from './HeaderListItemMobile'
import { LoadingSkeleton } from './LoadingSkeleton'
import { LoadingSkeletonMobile } from './LoadingSkeletonMobile'
import { PortfolioListItem } from './PortfolioListItem'
import *  as FaIcons from 'react-icons/fa';

const { Panel } = Collapse

export interface PortfolioListProps {
  className?: string
  erc20share: WalletERC20Share[]
  loading: boolean
}

export const PortfolioList: React.FC<PortfolioListProps> = ({ className, erc20share, loading }: PortfolioListProps) => {
  const [erc20listItems, setErc20listItems] = useState<WalletERC20Share[]>([])

  const chainId = useReactiveVar(chainIdVar)
  const featureToggle = getFeatureToggleByChainId(chainId)

  useEffect(() => {
    const getERC20Shares = async () => {
      const erc20list = await setPortfolioItemsLiquidity(erc20share, chainId)
      setErc20listItems(erc20list)
    }

    getERC20Shares()
  }, [chainId, erc20share])

  const openConnectWalletModal = () => {
    connectWalletModalVar(true)
  }

  const loadingShares = []
  const loadingMobile = []

  for (let i = 1; i <= 4; i += 1) {
    loadingShares.push(<LoadingSkeleton key={`loading-${i}`} />)
  }

  for (let i = 1; i <= 4; i += 1) {
    loadingMobile.push(<LoadingSkeletonMobile key={`loading-mobile-${i}`} />)
  }

  const headerPortfolioMobile = (erc20: WalletERC20Share) => {
    return <HeaderMobile erc20={erc20} />
  }

  return (
    <S.Container className={className}>
      <S.Table>
        {loading && loadingShares}
        <S.PanelHeaderTable>
          {!loading && !!erc20listItems.length && (
            <>
              <S.TitleTable>Fractions</S.TitleTable>
              <S.TitleTable>Price</S.TitleTable>
              <S.TitleTable>Balance</S.TitleTable>
              <S.TitleTable>Actions</S.TitleTable>
            </>
          )}
        </S.PanelHeaderTable>
        {erc20listItems.map(erc20Item => (
          <S.PanelContentTable key={`erc20share-${erc20Item.id}`}>
            <PortfolioListItem erc20={erc20Item} />
          </S.PanelContentTable>
        ))}
      </S.Table>
      <S.ERC20TableMobile>
        <S.ERC20ContentMobile>
          <S.Collapse expandIconPosition='right' ghost>
            {loading && loadingMobile}
            {erc20listItems.map(erc20Item => (
              <Panel header={headerPortfolioMobile(erc20Item)} key={`erc20-mobile-${erc20Item.id}`} showArrow collapsible='header'>
                <S.PanelContentItems>
                  <S.PanelContentTitle>
                    Details
                    <S.ClipBoard text={erc20Item.id} onCopy={() => notifySuccess('Copied!')}>
                      <Tooltip placement='right' title='Copy ERC20 Shares Address'>
                        <h6>{formatShortAddress(erc20Item.id)}</h6>
                        <FaIcons.FaCopy style={{marginLeft: '0.5rem'}}/>
                      </Tooltip>
                    </S.ClipBoard>
                  </S.PanelContentTitle>
                  <S.PanelContent>
                    <S.PanelTitle>Action</S.PanelTitle>
                    <S.PanelValue>
                      {(erc20Item.released || (erc20Item.cutoff && now() / 1000 > erc20Item.cutoff)) && (
                        <S.Claim onClick={() => claimModalVar(erc20Item)}>Claim</S.Claim>
                      )}
                      {featureToggle?.portfolio.trade && <S.ActionButton href={`/#/marketplace/${erc20Item.id}`}>Trade</S.ActionButton>}
                    </S.PanelValue>
                  </S.PanelContent>
                </S.PanelContentItems>
              </Panel>
            ))}
          </S.Collapse>
        </S.ERC20ContentMobile>
      </S.ERC20TableMobile>
      {/* {!loading && (
        <S.BoxMessage className={className}>
          <S.H1>Please connect your wallet</S.H1>
          <S.Span>To see the portfolio you should connect the wallet</S.Span>
          <S.Button onClick={openConnectWalletModal}>Connect Wallet</S.Button>
        </S.BoxMessage>
      )} */}
      {!loading && !erc20listItems.length && (
        <S.BoxMessage>
          <S.H1>Fractions not found in your wallet</S.H1>
          <S.Span>You can buy fractions in our marketplace</S.Span>
          <S.Button href='/#/marketplace'>Marketplace</S.Button>
        </S.BoxMessage>
      )}
    </S.Container>
  )
}
export const S = {
  Container: styled.div`
    background: ${props=>props.theme.white};
    flex: 1;
    @media (max-width: ${viewport.sm}) {
      max-width: 304px;
      margin: 0 auto;
    }
    @media (max-width: ${viewport.md}) {
      max-width: 720px;
      margin: 0 auto;
    }
  `,
  ClipBoard: styled(CopyToClipboard)`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${props=>props.theme.gray['4']};
    h6 {
      margin-right: 5px;
      color: ${props=>props.theme.gray['4']};
    }
  `,
  Table: styled.div`
    flex: 1;
    max-width: 800px;
    margin: 0 auto;
    @media (max-width: ${viewport.sm}) {
      display: none;
    }
  `,
  PanelHeaderTable: styled.div`
    flex: 1;
    margin: 24px 0px;
    display: grid;
    grid-template-columns: 360px 1fr 2fr 200px;
    gap: 16px 10px;
  `,
  PanelContentTable: styled.div`
    flex: 1;
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: 360px 1fr 2fr 200px;
    gap: 16px 10px;
    border: 1px solid ${props=>props.theme.gray['1']};
  `,
  TokenTitle: styled.div``,
  TokenSpanTitle: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${props=>props.theme.gray['3']};

    color: ${colors.gray2};
  `,
  TitleTable: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: ${colors.gray9};
  `,
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
  Erc20SpanTable: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${colors.gray2};
  `,
  Erc20SpanTableGray: styled.span`
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
  Claim: styled(Button)`
    flex: 1;
    max-width: 72px;
    max-height: 24px;

    background: ${colorsV2.green.main};
    border-radius: 5px;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;

    color: ${colors.white};

    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;

    &:hover {
      background: ${colorsV2.green.light};
      color: ${colors.white};
    }
    &:focus {
      background: ${colorsV2.green.light};
      color: ${colors.white};
    }
  `,

  ERC20TableMobile: styled.div`
    display: none;
    @media (max-width: ${viewport.sm}) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `,
  ERC20ContentMobile: styled.div`
    flex: 1;
  `,
  Collapse: styled(Collapse)`
    .ant-collapse-header {
      padding: 0 !important;
    }

    .ant-collapse-content > .ant-collapse-content-box {
      padding: 0px 16px 0px 0px;
    }
  `,
  PanelHeader: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    align-items: center;
  `,

  PanelDivInfo: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 16px;
  `,
  PriceDiv: styled.div`
    display: flex;
    flex-direction: row;
  `,
  PanelErc20Name: styled.h1`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;

    color: ${colors.gray2};
  `,
  PanelErc20Price: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-right: 4px;

    color: ${colors.gray9};
  `,
  PanelErc20PriceValue: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: ${colors.gray2};
  `,
  BalanceDiv: styled.div`
    display: flex;
    flex-direction: row;
  `,
  PanelErc20Balance: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-right: 4px;

    color: ${colors.gray9};
  `,
  PanelErc20BalanceValue: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: ${colors.gray2};
  `,
  PanelContentItems: styled.div`
    flex: 1;
    display: inline;
    flex-direction: column;
  `,
  PanelContentTitle: styled.h1`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 8px;
    width: 50%;
    display: inline-block;

    color: ${colors.gray2};
  `,
  PanelContent: styled.div`
    flex: 1;
    display: inline-block;
    width: 45%;
    flex-direction: column;

    justify-content: space-between;
    margin-bottom: 8px;
    .green {
      color: ${colors.green1};
    }
    .red {
      color: ${colors.red1};
    }
  `,
  PanelTitle: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: ${colors.gray1};
  `,
  PanelValue: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: ${colors.gray2};
    display: flex;
    flex-direction: row;
  `,

  BoxMessage: styled.section`
    flex: 1;
    max-width: 640px;
    margin: 0 auto;
    background: ${props=>props.theme.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 5px;

    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: 8px;
    box-shadow: 1px 1px 5px rgb(0 0 0 / 5%);

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

    color: ${colors.gray1};
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

    color: ${colors.gray1};
    @media (max-width: ${viewport.md}) {
      font-size: 1.2rem;
    }
  `,
  Button: styled(Button)`
    width: 100%;
    max-width: 192px;
    background: ${props=>props.theme.gray['0']};
    border: 1px solid ${colors.gray5};
    box-sizing: border-box;
    border-radius: 8px;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;

    color: ${props=>props.theme.gray['3']};
    &:focus {
      color: ${colors.gray1};
      border: 1px solid ${colors.gray5};
      outline: none;
    }
    &:hover {
      color: ${colors.gray1};
      border: 1px solid ${colors.gray5};
    }
  `,
  LinkItem: styled(Link)`
    text-decoration: none;
  `,
  ActionButton: styled(Button)`
    flex: 1;
    max-width: 105px;
    max-height: 24px;
    padding: 0 10px 0 10px;

    background: ${colors.blue1};
    border-radius: 5px;

    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    /* font-size: 14px;
    line-height: 22px; */

    color: ${colors.white};

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${colors.blue1};
      color: ${colors.white};
    }
    &:focus {
      background: ${colors.blue1};
      color: ${colors.white};
    }
  `
}
