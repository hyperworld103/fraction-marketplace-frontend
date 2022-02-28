import React from 'react'
import { Button, Skeleton } from 'antd'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { getChainConfigById } from '../../config'
import { useCollectiveBuyBuyer } from '../../hooks/CollectiveBuyHooks'
import { collectiveBuyService } from '../../services/CollectiveBuyService'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'

interface NftSoldProps {
  item: CollectiveBuyMarketplaceItem
  chainId: number
  account?: string
  isOwner: boolean
}

export const NftSold = ({ account, chainId, item, isOwner }: NftSoldProps) => {
  const history = useHistory()
  const { buyer, loading } = useCollectiveBuyBuyer(item.id, account?.toLowerCase() || '', chainId)

  const { networkTokenSymbol } = getChainConfigById(chainId)

  const handleSold = async () => {
    account && (await collectiveBuyService().claim(item.id, account, chainId))
  }

  const handleGoToFractions = () => {
    history.push(`/marketplace/${item.fractions}`)
  }

  return (
    <S.Content>
      <h2>This NFT has been sold</h2>
      <div>
        {loading && !isOwner && (
          <S.Participation>
            <Skeleton.Input active />
            <Skeleton.Input active />
            <Skeleton.Input active />
          </S.Participation>
        )}
        {!loading && !isOwner && (
          <S.Participation>
            <h5>Your Participation</h5>
            <span>{`Value: ${buyer?.amount} ${item.paymentToken.symbol || networkTokenSymbol}`}</span>
            <span>{`Fractions: ${buyer?.fractionsCount} ${item?.symbol || item.erc721?.symbol}`}</span>
          </S.Participation>
        )}
        {loading && isOwner && (
          <S.Participation>
            <Skeleton.Input active />
          </S.Participation>
        )}
        {!loading && isOwner && (
          <S.Participation>
            <h5>Your NFT has been sold and you can claim your Balance</h5>
          </S.Participation>
        )}
        {!isOwner && loading && <Skeleton.Input active />}
        {!isOwner && !loading && <S.Claim onClick={handleSold}>Claim</S.Claim>}
      </div>
      {loading && <Skeleton.Input active />}
      {!loading && <Button onClick={handleGoToFractions}>Go to NFT Fraction page</Button>}
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;

    .ant-skeleton {
      padding: 0;
    }

    .ant-skeleton-input {
      height: 48px;
    }

    > h2 {
      font-weight: 400;
      font-size: 32px;
      line-height: 44px;
      color: ${props => props.theme.black};
    }

    > div {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-radius: ${props => props.theme.borderRadius.small};
      background-color: ${props => props.theme.gray[0]};

      .ant-skeleton {
        width: 100px;
        align-self: center;

        .ant-skeleton-input {
          height: 48px;
        }
      }

      @media (min-width: ${props => props.theme.viewport.tablet}) {
        flex-direction: row;
        gap: unset;
        justify-content: space-between;
      }
    }

    > button {
      background-color: ${props => props.theme.blue.main};
      color: ${props => props.theme.white};
      border-radius: ${props => props.theme.borderRadius.small};
      height: 48px;
      border: none;
      outline: none;
      box-shadow: none;
      transition: background-color ease-in 250ms;

      &:hover,
      &:focus,
      &:active {
        background-color: ${props => props.theme.blue.light};

        > span {
          color: ${props => props.theme.white};
        }
      }

      > span {
        font-size: 20px;
        line-height: 27px;
      }
    }
  `,
  Participation: styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    .ant-skeleton {
      width: 200px !important;

      &:not(:first-of-type) {
        .ant-skeleton-input {
          margin-top: 2px;
          height: 18px !important;
        }
      }

      .ant-skeleton-input {
        height: 24px !important;
      }
    }

    > h5 {
      color: ${props => props.theme.black};
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
    }

    > span {
      color: ${props => props.theme.black};
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  `,
  Claim: styled(Button)`
    height: 48px;
    background-color: ${props => props.theme.green.main};
    border: none;
    outline: none;
    box-shadow: none;
    border-radius: ${props => props.theme.borderRadius.small};
    align-self: center;

    > span {
      font-weight: 600;
      font-size: 20px;
      line-height: 27px;
      color: ${props => props.theme.white};
    }

    &:hover,
    &:focus,
    &:active {
      border: none;
      box-shadow: none;
      outline: none;
      background-color: ${props => props.theme.green.light};
    }
  `
}
