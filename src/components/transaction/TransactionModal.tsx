import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { Modal, Spin } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import { transactionModalVar, transactionVar } from '../../graphql/variables/TransactionVariable'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { transactionService } from '../../services/TransactionService'
import { colorsV2 } from '../../styles/variables'

export function ModalTransaction() {
  const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />
  const transaction = useReactiveVar(transactionVar)
  const chainId = useReactiveVar(chainIdVar)
  const transactionModal = useReactiveVar(transactionModalVar)

  useEffect(() => {
    if (transaction && !transaction.confirmed && chainId) {
      transactionService().confirm(transaction.hash, chainId)
    }
  }, [chainId, transaction])

  return (
    <S.ModalTransaction visible={!!transactionModal} footer={null} destroyOnClose>
      <S.Container>
        <div>
          <Spin indicator={antIcon} />
        </div>
        <div>
          <h1>Waiting for blockchain confirmation</h1>
          <span>This may take a few seconds</span>
        </div>
      </S.Container>
    </S.ModalTransaction>
  )
}

export const S = {
  ModalTransaction: styled(Modal)`
    border-radius: 8px;

    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-content {
      background-color: ${props=>props.theme.white};
      border-radius: 16px;
      max-width: 350px;
      height: 280px;
      padding: 25px;
      margin: 0 auto;
    }

    .ant-modal-close-x {
      display: none;
    }

    .ant-modal-close {
      position: absolute;
      top: 15px;
      right: -2px;
    }
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: ${props=>props.theme.white}
    > div {
      display: flex;
      align-items: center;
      height: 80%;
    }
    div:nth-child(2) {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 20%;
      margin-top: 20px;
      margin-bottom: 20px;
      h1 {
        font-size: 18px;
        line-height: 20px;
        color: ${props=>props.theme.gray['4']};
        margin-bottom: 8px;
      }
      span {
        font-size: 14px;
        line-height: 16px;
        color: ${props=>props.theme.gray['3']};
      }
    }
  `
}
