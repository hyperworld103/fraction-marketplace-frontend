import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Modal } from 'antd'
import styled from 'styled-components'
import iconApprove from '../../../assets/icons/approve.svg'
import { successRemovedParticipationModalVar } from '../../../graphql/variables/CollectiveBuying'
import { clearTransaction } from '../../../graphql/variables/TransactionVariable'

export interface SuccessRemovedParticipationModalProps {
  className?: string
}

export function SuccessRemovedParticipationModal({ className }: SuccessRemovedParticipationModalProps) {
  const successRemovedParticipationModal = useReactiveVar(successRemovedParticipationModalVar)
  const handleCancel = () => {
    successRemovedParticipationModalVar(false)
    clearTransaction()
  }

  return (
    <S.Container
      onCancel={handleCancel}
      centered
      className={className}
      visible={!!successRemovedParticipationModal}
      footer={null}
      destroyOnClose>
      <S.Content>
        <img src={iconApprove} alt='approved' />
        <div>
          <h1>Your membership has been successfully removed!</h1>
        </div>
        <S.Cancel type='button' onClick={handleCancel}>
          Go back to NFT sell page
        </S.Cancel>
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
  Content: styled.div`
    padding: 80px;
    gap: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 120px;
      height: 120px;
    }
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      h1 {
        font-style: normal;
        font-weight: normal;
        text-align: center;
        font-size: 40px;
        line-height: 55px;
        color: ${props => props.theme.gray[4]};
      }
    }

    @media (max-width: ${props => props.theme.viewport.desktop}) {
      padding: 40px;
    }

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: 767px) {
      padding: 20px 25px;
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
