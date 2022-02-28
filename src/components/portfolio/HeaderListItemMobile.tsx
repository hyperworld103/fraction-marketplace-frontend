import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import notFound from '../../assets/notfound.svg'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { zeroXQuoteService } from '../../services/QuoteService'
import { safeFractionsName, units } from '../../services/UtilService'
import { colors, fonts } from '../../styles/variables'
import { WalletERC20Share } from '../../types/WalletTypes'
import { ContractImage } from '../shared/ContractImage'

export interface PortfolioListItemProps {
  erc20: WalletERC20Share
}

export function HeaderMobile({ erc20 }: PortfolioListItemProps) {
  const [price, setPrice] = useState<string | undefined>(undefined)
  const chainId = useReactiveVar(chainIdVar)

  useEffect(() => {
    const getPrice = async () => {
      const paymentToken = erc20.paymentToken.symbol === null ? 'ETH' : erc20.paymentToken.id
      const amount = units('1', erc20.decimals)
      const quote = await zeroXQuoteService().quoteToStablecoin(paymentToken, amount, erc20.decimals, chainId)

      setPrice(quote.priceDollar === '' ? '0' : quote.priceDollar)
    }
    getPrice()
  }, [chainId, erc20.id, erc20.decimals, erc20.paymentToken])
  return (
    <S.PanelHeader>
      <ContractImage src={erc20.metadata?.image || notFound} name={erc20.target?.collection?.name || ''} large={false} />
      <S.PanelDivInfo>
        <S.ContainerName>
          <S.PanelErc20Name>{safeFractionsName(erc20.name)}</S.PanelErc20Name>
          <S.Symbol>{erc20.symbol}</S.Symbol>
        </S.ContainerName>
        <S.PriceDiv>
          <S.PanelErc20Price>Price </S.PanelErc20Price>
          <S.PanelErc20PriceValue>
            {price ? `$${Number(Number(price).toFixed(6)).toLocaleString('en-us', { maximumFractionDigits: 2 })}` : '-'}
          </S.PanelErc20PriceValue>
        </S.PriceDiv>
        <S.BalanceDiv>
          <S.PanelErc20Balance>Balance </S.PanelErc20Balance>
          <S.PanelErc20BalanceValue>
            {Number(Number(erc20.balance).toFixed(6)).toLocaleString('en-us', { maximumFractionDigits: 2 })}
          </S.PanelErc20BalanceValue>
        </S.BalanceDiv>
      </S.PanelDivInfo>
    </S.PanelHeader>
  )
}
export const S = {
  PanelHeader: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    align-items: center;
    color: ${props=>props.theme.gray['4']};
  `,
  PanelDivInfo: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 16px;
  `,
  ContainerName: styled.div`
    display: flex;
    flex-direction: column;
  `,
  PanelErc20Name: styled.h1`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 21px;
    margin-right: 30px;
    color: ${props=>props.theme.gray['4']};
  `,
  Symbol: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;

    color: ${props=>props.theme.gray['4']};
  `,
  PriceDiv: styled.div`
    display: flex;
    flex-direction: row;
  `,
  PanelErc20Price: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-right: 4px;

    color: ${props=>props.theme.gray['4']};
  `,
  PanelErc20PriceValue: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: ${props=>props.theme.gray['2']};
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

    color: ${props=>props.theme.gray['4']};
  `,
  PanelErc20BalanceValue: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: ${props=>props.theme.gray['2']};
  `
}
