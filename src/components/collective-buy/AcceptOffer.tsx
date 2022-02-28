import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import { BigNumber } from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { collectiveBuyService } from '../../services/CollectiveBuyService'

interface AcceptOfferProps {
  itemId: string
  itemAmount: string
  itemReservePrice: string
}

export function AcceptOffer({ itemId, itemAmount, itemReservePrice }: AcceptOfferProps) {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const remainingPercent = () => {
    const calculatePercent = new BigNumber(itemAmount).dividedBy(itemReservePrice).multipliedBy(100).toNumber()
    if (calculatePercent === 100) return calculatePercent
    const result = 100 - calculatePercent
    return result.toFixed(2)
  }

  const handleAccept = async () => {
    if (account) {
      await collectiveBuyService().accept(itemId, account, chainId)
    }
  }
  return (
    <>
      <S.Content>
        <S.Info>Receive {remainingPercent()}% in fractions</S.Info>
        <S.TokenButton onClick={handleAccept}>accept offer</S.TokenButton>
      </S.Content>
    </>
  )
}
const S = {
  Content: styled.div`
    display: flex;
    gap: 8px;
    flex-direction: row;
    align-items: center;
  `,
  TokenButton: styled(Button)`
    border-radius: 8px;
    background-color: ${props => props.theme.green.main};
    color: ${props => props.theme.white};
    border: none;
    outline: none;
    box-shadow: none;
    transition: background-color 250ms ease-in;
    width: 156px;
    font-weight: 600;
    height: 48px;
    > span {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
    }
    &:active,
    &:focus {
      background-color: ${props => props.theme.green.light};
      color: ${props => props.theme.white};
      border: none;
      outline: none;
      box-shadow: none;
    }

    &:hover {
      background-color: ${props => props.theme.green.light};
      color: ${props => props.theme.white};
      border: none;
      outline: none;
      box-shadow: none;
    }

    &:disabled {
      background-color: ${props => props.theme.green.lighter};
      color: ${props => props.theme.white};
      border: none;
      outline: none;
      box-shadow: none;

      &:hover {
        background-color: ${props => props.theme.green.lighter};
        color: ${props => props.theme.white};
        border: none;
        outline: none;
        box-shadow: none;
      }
    }
  `,
  Info: styled.div`
    display: flex;
    align-items: center;
    padding: 12px 14.5px 12px 14.5px;
    background-color: ${props => props.theme.gray[0]};
    color: ${props => props.theme.gray[4]};
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.small};
    font-weight: 400;
    font-size: 14px;
    line-height: 19.1px;
    width: 291px;
  `
}
