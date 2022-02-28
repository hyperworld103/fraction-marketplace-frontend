import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Modal } from 'antd'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import iconApprove from '../../../assets/icons/approve.svg'
import { successClaimModalVar } from '../../../graphql/variables/CollectiveBuying'

export interface SuccessClaimModalProps {
  className?: string
  isOwner: boolean
  fractionAddress: string
}

export function SuccessClaimModal({ className, fractionAddress, isOwner }: SuccessClaimModalProps) {
  const successClaimModal = useReactiveVar(successClaimModalVar)
  const history = useHistory()

  const handleClose = () => {
    successClaimModalVar(false)
    history.push(`/marketplace/${fractionAddress}`)
  }

  return (
    <S.Container onCancel={handleClose} centered className={className} visible={!!successClaimModal} footer={null} destroyOnClose>
      <S.Content>
        <img src={iconApprove} alt='approved' />
        <div>
          <h1>{`Your ${isOwner ? 'funds' : 'fractions'} has been successfully removed!`}</h1>
        </div>
        <S.Cancel type='button' onClick={handleClose}>
          Go to NFT Fraction page
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
