import { useReactiveVar } from '@apollo/client'
import { Button, Input } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'
import Web3 from 'web3'
import { getChainConfigById } from '../../config'
import { transactionLoadingVar, TransactionType, transactionVar } from '../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { collectiveBuyService } from '../../services/CollectiveBuyService'
import { safeIpfsUrl } from '../../services/UtilService'
import { getErc20Balance } from '../../services/WalletService'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'

export type JoinGroupProps = {
  item: CollectiveBuyMarketplaceItem
  pathImage: string
  typeImage: 'image' | 'jazzIcon'
  className?: string
}

export default function JoinGroup({ pathImage, typeImage, className, item }: JoinGroupProps) {
  const [amount, setAmount] = useState<string | undefined>()
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [balanceErc20, setBalanceErc20] = useState<BigNumber | undefined>(undefined)

  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const transaction = useReactiveVar(transactionVar)

  const { networkTokenSymbol } = getChainConfigById(chainId)

  const handleUnlock = async () => {
    if (account && item.paymentToken.symbol !== null) {
      await collectiveBuyService().approveOnErc20(Web3.utils.toChecksumAddress(item.paymentToken.id), account, chainId)
    }
  }

  const handleJoin = async () => {
    const isNetworkSymbol = item.paymentToken.symbol === null
    account && (await collectiveBuyService().join(isNetworkSymbol, item.id, amount || '0', item.paymentToken.decimals, account, chainId))
  }

  const erc20TokenAsset = (addressToImage: string, type: 'image' | 'jazzIcon') => {
    return (
      <S.TokenAsset>
        {type === 'image' ? (
          <img alt={item.paymentToken.symbol} src={safeIpfsUrl(addressToImage)} />
        ) : (
          <Jazzicon diameter={24} seed={jsNumberForAddress(addressToImage)} />
        )}
        <span>
          {item.paymentToken.symbol?.length > 6
            ? `${item.paymentToken.symbol.substr(0, 6)}...`
            : item.paymentToken.symbol || networkTokenSymbol}
        </span>
      </S.TokenAsset>
    )
  }

  const canJoin = () => {
    if (!account) {
      return false
    }

    if (!balanceErc20 || balanceErc20.isEqualTo(0)) {
      return false
    }

    return true
  }

  useEffect(() => {
    const checkIsApproved = async () => {
      if (item.paymentToken.symbol === null) {
        setIsApproved(true)
        return
      }

      if (!transactionLoading) {
        account &&
          setIsApproved(await collectiveBuyService().approvedOnErc20(Web3.utils.toChecksumAddress(item.paymentToken.id), account, chainId))
      }
    }

    checkIsApproved()
  }, [account, chainId, item.paymentToken.id, item.paymentToken.symbol, transactionLoading])

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        const erc20Balance = await getErc20Balance(
          item.paymentToken.id,
          item.paymentToken.decimals,
          chainId,
          item.paymentToken.symbol || networkTokenSymbol
        )
        setBalanceErc20(erc20Balance)
      }
    }

    account && getBalance()
  }, [account, chainId, item.paymentToken.decimals, item.paymentToken.id, item.paymentToken.symbol, networkTokenSymbol])

  useEffect(() => {
    const handleJoinSuccessful = async () => {
      if (!transactionLoading && transaction && transaction.confirmed && transaction.type === TransactionType.collectiveBuyJoinGroup) {
        setAmount(undefined)
      }
    }

    handleJoinSuccessful()
  }, [transactionLoading, transaction])

  return (
    <S.Content className={className}>
      <div>
        <S.Input
          type='number'
          onChange={e => setAmount(e.target.value)}
          value={amount}
          addonBefore={erc20TokenAsset(pathImage, typeImage)}
        />
        {!isApproved && (
          <S.TokenButton disabled={!account} onClick={handleUnlock}>
            Unlock
          </S.TokenButton>
        )}
        {isApproved && (
          <S.TokenButton disabled={!canJoin()} onClick={handleJoin}>
            Join
          </S.TokenButton>
        )}
      </div>
      <small>{`Balance: ${balanceErc20?.toNumber().toLocaleString('en', { maximumFractionDigits: 4 })} ${
        item.paymentToken.symbol || networkTokenSymbol
      }`}</small>
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    > div {
      display: flex;
      gap: 8px;
      flex-direction: row;
      align-items: center;
    }
  `,
  TokenButton: styled(Button)`
    border-radius: 8px;
    background-color: ${props => props.theme.blue.main};
    color: ${props => props.theme.white};
    border: none;
    outline: none;
    box-shadow: none;
    transition: background-color 250ms ease-in;
    width: 93px;
    font-weight: 600;
    height: 48px;

    > span {
      font-size: 20px;
      line-height: 28px;
    }

    &:active,
    &:focus {
      background-color: ${props => props.theme.blue.main};
      color: ${props => props.theme.white};
      border: none;
      outline: none;
      box-shadow: none;
    }

    &:hover {
      background-color: ${props => props.theme.blue.light};
      color: ${props => props.theme.white};
      border: none;
      outline: none;
      box-shadow: none;
    }

    &:disabled {
      background-color: ${props => props.theme.blue.lighter};
      color: ${props => props.theme.white};
      border: none;
      outline: none;
      box-shadow: none;

      &:hover {
        background-color: ${props => props.theme.blue.lighter};
        color: ${props => props.theme.white};
        border: none;
        outline: none;
        box-shadow: none;
      }
    }
  `,
  TokenAsset: styled.span`
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;

    > span {
      font-size: 14px;
      line-height: 18px;
    }
  `,
  Input: styled(Input)`
    input {
      height: 48px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 18px;
      color: ${props => props.theme.black};
    }

    .ant-input-group-addon {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border-right: none;
      background-color: ${props => props.theme.white};
      color: ${props => props.theme.black};
      padding: 0 12px;
      height: 48px;
      display: flex;
      align-items: center;

      > span {
        > img {
          height: 24px;
          width: 24px;
        }
      }
    }

    .ant-input {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      border-left: none;
      background-color: ${props => props.theme.white};
      padding-right: 12px;
      height: 48px;
      text-align: right;

      &:disabled {
        border-radius: 8px;
        border: none;
        box-shadow: none;
        outline: none;
        background-color: ${props => props.theme.gray['0']};
        padding-right: 12px;
        height: 48px;
      }

      &:active,
      &:focus,
      &:hover {
        box-shadow: none;
        outline: none;
      }
    }

    .ant-input-group {
      display: flex;
    }

    .ant-input-group-addon {
      width: 145px;

      > span {
        justify-content: flex-start;
        align-items: center;
      }
    }

    .ant-input-group-addon,
    .ant-input {
      border-color: ${props => props.theme.gray['1']};
    }
  `
}
