import { LoadingOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { Modal, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { wrongNetworkModalVar } from '../../graphql/variables/WalletVariable'
import { colors, fonts } from '../../styles/variables'

export default function WrongNetworkModal() {
  const wrongNetworkModal = useReactiveVar(wrongNetworkModalVar)
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return (
    <S.Modal visible={!!wrongNetworkModal} keyboard={false} centered closable={false}>
      <S.ContainerModal>
        <S.Spin indicator={antIcon} />
        <h1>Wrong network</h1>
        <span>Change your network</span>
      </S.ContainerModal>
    </S.Modal>
  )
}

export const S = {
  Modal: styled(Modal)`
    border-radius: 8px;

    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-content {
      border-radius: 16px;
      max-width: 300px;
      margin: 0 auto;
    }
    .ant-modal-footer {
      display: none;
    }
  `,
  ContainerModal: styled.div`
    width: 100%;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1 {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: ${colors.gray2};
    }
    span {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: ${colors.blue1};
    }
  `,
  Spin: styled(Spin)`
    margin-bottom: 16px;
  `
}
