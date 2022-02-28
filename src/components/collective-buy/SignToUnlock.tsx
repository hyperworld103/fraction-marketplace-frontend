import React from 'react'
import { Button, Skeleton } from 'antd'
import styled from 'styled-components'
import { useCollectiveBuyBuyers } from '../../hooks/CollectiveBuyHooks'
import { collectiveBuyService } from '../../services/CollectiveBuyService'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'

interface SignToUnlockProps {
  item: CollectiveBuyMarketplaceItem
  chainId: number
  account: string
}

export const SignToUnlock = ({ account, chainId, item }: SignToUnlockProps) => {
  const { buyers, loading } = useCollectiveBuyBuyers(item.id, chainId)

  const handleRelist = async () => {
    account && (await collectiveBuyService().relist(item.id, account, chainId))
  }

  const isOwnerOrHolder = item.seller === account.toLowerCase() || !!buyers.find(buyer => buyer.buyer === account.toLowerCase())

  return (
    <S.Content>
      <h2>This NFT has been sold</h2>
      <div>
        {loading && (
          <S.Participation>
            <Skeleton.Input active />
            <Skeleton.Input active />
          </S.Participation>
        )}
        {!loading && (
          <S.Participation>
            <h5>Waiting sign to unlock fractions and funds!</h5>
            <h5>Only owner or fractions holders can do this action.</h5>
          </S.Participation>
        )}
      </div>
      {isOwnerOrHolder && <Button onClick={handleRelist}>Sign to unlock</Button>}
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
  `
}
