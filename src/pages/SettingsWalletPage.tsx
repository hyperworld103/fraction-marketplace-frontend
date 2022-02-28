import { Button, Modal, Input } from 'antd'
import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import * as IoIcons from 'react-icons/io';
import { SettingsPageTemplate } from './shared/templates/SettingsPageTemplate'
import { notifyWarning } from '../services/NotificationService'
import { AppContext } from '../contexts'
import TransferModal  from '../components/settings/TransferModal'
import { useBalances } from '../hooks/BalanceHooks'

export default function SettingsWalletPage() {
  const { user } = useContext(AppContext)
  const { balances } = useBalances(user)
  const[visible, setVisible] = useState(false)

  const submitTransfer = () => {
    setVisible(true);
  }
  const copyAddress = () => {
    navigator.clipboard.writeText(user.public_key);
    notifyWarning('Wallet address copied')
  }
  return (
    <SettingsPageTemplate>
      <header>Wallet</header>
      <S.Balance>
        <span>Your Wallet Balance : </span>
        <span>{balances.eth}</span>
        <span> ETH</span>
        <span>{balances.usdc}</span>
        <span> USDC</span>
      </S.Balance>
      <S.AddressDiv onClick={copyAddress}>
        <S.Input value={user.public_key} readOnly />      
        <IoIcons.IoMdCopy style={{float: 'right', fontSize: '20px'}} />
      </S.AddressDiv>
      <div style={{width: '100%', marginTop: '20px'}}>
        <S.Button onClick = { submitTransfer }>
          Transfer
        </S.Button>
      </div>
      <TransferModal visible={visible} setVisible={setVisible}/>
    </SettingsPageTemplate>
  )
}

export const S = {
  Input: styled(Input)`
    max-width: 195px;
    padding: 0px;
    color: ${props=>props.theme.gray['4']};
    border: 0px;
    background: transparent;
    cursor: pointer;
    @media (min-width: ${props => props.theme.viewport.mobile}) {
      max-width: 233px;
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      max-width: 80%;
    }
  `,
  Balance: styled.div`
    width: 100%;
    margin-left: 20px;
    margin-top: 20px;

    span: nth-child(3) {
      margin-right: 10px;
    }
  `,
  AddressDiv: styled.div `
    width: 100%;
    display: inline-block;
    margin: 20px 20px 0 20px;
    background-color: ${props=>props.theme.gray['1']};
    border: 1px solid ${props=>props.theme.gray['3']};
    padding: 7px;
    border-radius: 5px;
    cursor: pointer;
  `,
  Modal: styled(Modal)`
    border-radius: 8px;

    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-content {
      border-radius: 16px;
      max-width: 489px;
    }
    .ant-modal-close-x {
      display: none;
    }
  `,
  Button: styled(Button)`
    display: inline-block !important;
    margin-left: 20px !important;
    background-color: ${colors.red1};
    color: ${colors.white};
    border-radius: 5px !important;
    padding: 3px 15px 5px 15px !important;
    cursor: pointer !important;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      opacity: 0.8;
    }
    margin-bottom: 20px;
  `,
}
