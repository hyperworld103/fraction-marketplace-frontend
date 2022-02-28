import { useReactiveVar } from '@apollo/client'
import { Button, Modal } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { removeParticipationModalVar } from '../../../graphql/variables/CollectiveBuying'
import { accountVar, chainIdVar } from '../../../graphql/variables/WalletVariable'
import { collectiveBuyService } from '../../../services/CollectiveBuyService'
import { Buyer } from '../../../types/CollectiveBuyTypes'

export interface RemoveParticipationModalProps {
  listingId: string
  buyer: Buyer
  paymentTokenSymbol: string
  className?: string
}

export function RemoveParticipationModal({ className, buyer, paymentTokenSymbol, listingId }: RemoveParticipationModalProps) {
  const removeParticipationModal = useReactiveVar(removeParticipationModalVar)
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)

  const handleClose = () => {
    removeParticipationModalVar(false)
  }

  const handleRemove = async () => {
    account && (await collectiveBuyService().leave(listingId, account, chainId))
    handleClose()
  }

  return (
    <S.Container onCancel={handleClose} className={className} visible={!!removeParticipationModal} footer={null} centered destroyOnClose>
      <S.Content>
        <h1>Are you sure you want to remove your participation?</h1>
        <div>
          <span>Your Participation</span>
          <span>{`${buyer.amount} ${paymentTokenSymbol}`}</span>
        </div>
        <S.Button onClick={handleRemove}>Remove</S.Button>
        <S.Cancel type='button'>Cancel</S.Cancel>
      </S.Content>
    </S.Container>
  )
}
export const S = {
  Container: styled(Modal)`
    border-radius: 16px;

    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-content {
      border-radius: 16px;
      width: 615px;
      @media (max-width: ${props => props.theme.viewport.desktopXl}) {
        width: 100%;
        max-width: 615px;
      }
    }
    .ant-modal-close-x {
      display: none;
    }
    .ant-modal-footer {
      display: none;
    }
  `,
  Content: styled.section`
    padding: 80px;
    gap: 24px;
    display: flex;
    flex-direction: column;

    h1 {
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 33px;
      text-align: center;
      color: ${props => props.theme.gray[4]};
    }

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 17px;
      background: ${props => props.theme.gray[0]};
      border-radius: 16px;

      span {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 25px;
        color: ${props => props.theme.black};
      }
    }

    @media (max-width: ${props => props.theme.viewport.desktop}) {
      padding: 40px;
    }

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: 767px) {
      padding: 20px 25px;
    }
  `,
  Button: styled(Button)`
    border: none;
    width: 100%;
    height: 48px;
    background-color: ${props => props.theme.blue.main};
    border-radius: 8px;

    &:disabled {
      background-color: ${props => props.theme.blue.lighter};
      span {
        color: ${props => props.theme.white};
      }

      &:hover,
      &:focus,
      &:active {
        background-color: ${props => props.theme.blue.lighter};
        span {
          color: ${props => props.theme.white};
        }
      }
    }

    &:hover,
    &:focus,
    &:active {
      background-color: ${props => props.theme.blue.dark};
      span {
        color: ${props => props.theme.white};
      }
    }
    span {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 27px;
      color: ${props => props.theme.white};
    }
  `,
  Cancel: styled.button`
    width: 100%;
    padding: 0;
    margin: 0;
    cursor: pointer;
    border: none;
    background: none;
    color: ${props => props.theme.blue.main};
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 27px;
    transition: 250ms color ease-in;

    &:focus {
      color: ${props => props.theme.blue.main};
    }

    &:hover {
      color: ${props => props.theme.blue.main};
    }

    &.active {
      color: ${props => props.theme.blue.main};

      &:focus {
        color: ${props => props.theme.blue.main};
      }

      &:hover {
        color: ${props => props.theme.blue.light};
      }
    }
  `
}
