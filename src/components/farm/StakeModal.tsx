import { useReactiveVar } from '@apollo/client'
import { Button, InputNumber, Modal, Tabs } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { clearTransaction, transactionLoadingVar, TransactionType, transactionVar } from '../../graphql/variables/TransactionVariable'
import { accountVar } from '../../graphql/variables/WalletVariable'
import { farmService } from '../../services/FarmService'
import { notifySuccess } from '../../services/NotificationService'
import { colors, fonts, viewport } from '../../styles/variables'

const { TabPane } = Tabs

export interface StakeModalProps {
  action: 'stake' | 'unstake' | undefined
  onCancel: () => void
  name: string
  contract: string
  contractErc20: string
  contractPosition: number
  rightChainId: number
}

export const StakeModal = ({ action, onCancel, contract, contractErc20, name, contractPosition, rightChainId }: StakeModalProps) => {
  const account = useReactiveVar(accountVar)
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [invalid, setInvalid] = useState<boolean>(false)
  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const { userPoolBalance, getErc20Balance, deposit, withdraw } = farmService(rightChainId)

  const handleCancel = () => {
    onCancel()
  }

  const checkBalance = useCallback(async () => {
    if (account) {
      if (action === 'stake') {
        const balanceValue = await getErc20Balance(account, contractErc20)
        setBalance(balanceValue.toString())
      }

      if (action === 'unstake') {
        const balanceValue = await userPoolBalance(account, contract, contractPosition)
        setBalance(balanceValue)
      }
    }

    if (balance && amount) {
      if (Number(amount) < 0 || Number(amount) > Number(balance)) {
        setInvalid(true)
      } else {
        setInvalid(false)
      }
    } else {
      setInvalid(false)
    }
  }, [account, action, amount, balance, contract, contractErc20, contractPosition, getErc20Balance, userPoolBalance])

  const handleChange = (value: string | number | null | undefined) => {
    if (value) {
      setAmount(value.toString().replace(',', '.'))
    } else {
      setAmount('0')
    }
    setLoading(false)
  }

  const max = () => {
    setAmount(balance)
  }
  const stake = async () => {
    if (account) {
      deposit(amount, account, contract, contractPosition)
      setAmount('')
      notifySuccess('Confirm the transaction on wallet')
    }
  }

  const unstake = () => {
    if (account) {
      withdraw(amount, account, contract, contractPosition)
      setAmount('')
      notifySuccess('Confirm the transaction on wallet')
    }
  }
  const actionButton = () => {
    action === 'stake' ? stake() : unstake()
  }

  useEffect(() => {
    !transactionLoading && checkBalance()
  }, [account, action, checkBalance, transactionLoading])

  useEffect(() => {
    if (
      !transactionLoading &&
      transaction &&
      (transaction.type === TransactionType.farmDeposit || transaction.type === TransactionType.farmWithdraw) &&
      transaction.confirmed
    ) {
      clearTransaction()
      checkBalance()
    }
  }, [checkBalance, transaction, transactionLoading])

  return (
    <S.Modal
      title={`${action?.charAt(0).toUpperCase()}${action?.slice(1, action.length)} LP Tokens`}
      visible={action === 'stake' || action === 'unstake'}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose>
      <S.Content>
        <div>
          <S.DivTitleBox>
            <span>{`${action?.charAt(0).toUpperCase()}${action?.slice(1, action.length)}`}</span>
            <span>{`Balance: ${Number(balance).toFixed(3)}`}</span>
          </S.DivTitleBox>
          <S.Form>
            <S.FormGroup>
              <S.InputNumber
                type='number'
                defaultValue={0}
                value={Number(amount)}
                onChange={handleChange}
                placeholder='0'
                min={0}
                max={Number(balance)}
              />
              <S.InputDiv>
                <S.ButtonMax onClick={max}>Max</S.ButtonMax>
                <span>{name}</span>
              </S.InputDiv>
            </S.FormGroup>
          </S.Form>
        </div>
        <S.ActionDiv>
          <div>
            <S.CancelButton onClick={onCancel}>Cancel</S.CancelButton>
            <S.ButtonAction disabled={invalid || Number(amount) === 0} onClick={actionButton} loading={loading}>
              {action === 'stake' ? 'Confirm Stake' : 'Confirm Unstake'}
            </S.ButtonAction>
          </div>
        </S.ActionDiv>
      </S.Content>
    </S.Modal>
  )
}

export const S = {
  Modal: styled(Modal)`
    width: 528px;
    background: ${colors.white};
    font-family: ${fonts.nunito};
    border: 1px solid ${colors.gray3};
    box-sizing: border-box;
    border-radius: 16px;
    padding: 0;
    .ant-modal-content {
      border-radius: 16px;
      width: 100%;
    }
    .ant-modal-body {
      padding: 0;
      > div {
        padding: 16px 24px;
      }
    }
    .ant-modal-header {
      border-radius: 16px 16px 0px 0px;
      > div {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: ${colors.gray2};
      }
    }
    .ant-modal-close-x {
      display: flex;
      align-items: center;
    }
  `,
  Tabs: styled(Tabs)`
    width: 100%;

    .ant-tabs-nav-list {
      width: 100%;
    }

    .ant-tabs-tab {
      width: 50%;
      height: 64px;
      justify-content: center;
      font-family: ${fonts.nunito};
      font-weight: 400;
      color: ${colors.gray9};
      margin-right: 0;
      border-bottom: 1px solid ${colors.gray3};

      &:nth-child(1) {
        border-right: 1px solid ${colors.gray3};
      }
    }

    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      font-family: ${fonts.nunito};
      font-weight: 400;
      color: ${colors.gray2};

      &:focus {
        font-family: ${fonts.nunito};
        font-weight: 400;
        color: ${colors.gray2};
      }
    }

    .ant-tabs-nav {
      margin: 0;
    }
  `,
  TabPane: styled(TabPane)`
    /* min-height: 400px; */
  `,
  Actions: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    border-bottom: 1px solid ${colors.gray3};
  `,
  Button: styled.button`
    width: 50%;
    height: 100%;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.gray9};
    &:first-child {
      border-right: 1px solid ${colors.gray3};
    }
    &.active {
      color: ${colors.gray2};
    }
  `,
  Content: styled.div`
    padding: 32px;
    .titleInfo {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 8px;
      span {
        font-weight: 400;
        color: ${colors.gray1};
        font-size: 12px;
        line-height: 16px;
      }
      span:first-child {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: ${colors.gray2};
      }
    }
    > div:nth-child(1) {
      background: ${colors.gray13};
      padding: 15px;
      border-radius: 8px;
    }
  `,
  InputNumber: styled(InputNumber)`
    border: none;
    box-shadow: none;
    min-width: 200px;
    margin-bottom: 5px;
    text-align: end;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.gray2};
    outline: none;
    box-shadow: none;
    text-align: start;
    background: ${colors.gray13};
    margin-left: 0;
    &:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }
    @media (max-width: ${viewport.sm}) {
      width: 35%;
    }
  `,
  Form: styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  FormGroup: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;
    border-radius: 8px;
    height: 56px;
    align-items: center;

    &.staked {
      height: 80px;
    }
    span {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: ${colors.gray2};
    }
    small {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: ${colors.gray1};
    }

    .valuesSection {
      display: flex;
      flex-direction: column;
      align-items: flex-end !important;
      div {
        display: flex;
        flex-direction: row;
        width: 150px;
        justify-content: space-between;
      }
      small:last-child {
        width: 100px;
        text-align: end;
      }
    }
  `,
  ButtonAction: styled(Button)`
    width: 100%;
    height: 48px;
    background: ${colors.blue1};
    color: ${colors.white};
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    &:hover {
      background: ${colors.blue2};
      color: ${colors.white};
    }
    &:focus {
      background: ${colors.blue2};
      color: ${colors.white};
    }
  `,
  ButtonMax: styled(Button)`
    width: 60px;
    height: 40px;
    margin-right: 10px;
    background: ${colors.blue1};
    border-radius: 18px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    padding: 0;
    span {
      color: ${colors.white};
      font-size: 14px;
      line-height: 24px;
    }
    &:hover {
      background: ${colors.blue2};
      color: ${colors.white};
    }
    &:focus {
      background: ${colors.blue2};
      color: ${colors.white};
    }
  `,
  InputDiv: styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    @media (max-width: ${viewport.sm}) {
      width: 65%;
      justify-content: flex-end;
    }
  `,
  ActionDiv: styled.div`
    margin-top: 23px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > div {
      width: 100%;
      display: flex;
    }

    a {
      margin-top: 18px;
      display: flex;
      align-items: center;
      color: ${colors.blue1};
      span {
        margin-right: 5px;
      }
      img {
        margin-bottom: 3px;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  `,
  DivTitleBox: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  CancelButton: styled(Button)`
    width: 100%;
    height: 48px;
    margin-right: 15px;
    border: solid 2px ${colors.blue1};
    background: ${colors.white};
    color: ${colors.blue1};
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    &:hover {
      background: ${colors.blue2};
      color: ${colors.white};
    }
    &:focus {
      background: ${colors.blue2};
      color: ${colors.white};
    }
  `
}
