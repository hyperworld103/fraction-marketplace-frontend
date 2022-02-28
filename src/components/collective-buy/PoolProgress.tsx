import { Progress } from 'antd'
import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { getChainConfigById } from '../../config'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'

interface PoolProgressProps {
  chainId: number
  item: CollectiveBuyMarketplaceItem
}
export function PoolProgress({ chainId, item }: PoolProgressProps) {
  const { networkTokenSymbol } = getChainConfigById(chainId)
  const calculatePercent = new BigNumber(item.amount).dividedBy(item.reservePrice).multipliedBy(100).toNumber()

  return (
    <S.Section>
      <h4>Buyers Pool Progress</h4>
      <Progress percent={calculatePercent} />
      <small>{`${new BigNumber(item.amount.replaceAll(',', ''))
        .toNumber()
        .toLocaleString('en', { maximumFractionDigits: item.paymentToken.decimals })} ${
        item.paymentToken.symbol || networkTokenSymbol
      }`}</small>
    </S.Section>
  )
}

const S = {
  Section: styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    font-style: normal;
    font-weight: normal;

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      margin-left: 0;
    }

    > div {
      display: flex;
      gap: 24px;
    }

    .ant-progress-outer {
      display: flex;
      align-items: center;
      width: 182px;
      padding-right: 8px;
    }

    .ant-progress.ant-progress-line.ant-progress-status-normal.ant-progress-show-info.ant-progress-default {
      span {
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        line-height: 33px;
        margin-left: 8px;
      }
    }

    .ant-progress-inner {
      background: ${props => props.theme.white};
      border: 1px solid ${props => props.theme.gray[0]};
    }

    .ant-progress-bg {
      height: 32px !important;
    }

    h4 {
      font-size: 14px;
      line-height: 19px;
      color: ${props => props.theme.gray[4]};
    }
    small {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: ${props => props.theme.black};
      text-align: center;
    }
  `
}
