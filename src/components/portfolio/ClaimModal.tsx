import { useReactiveVar } from '@apollo/client'
import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getChainConfigById } from '../../config'
import { claimModalVar } from '../../graphql/variables/PortfolioVariable'
import { transactionLoadingVar, transactionVar } from '../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { claimErc20, getAccountClaimAmount } from '../../services/NftfyService'
import { notifySuccess } from '../../services/NotificationService'
import { zeroXQuoteService } from '../../services/QuoteService'
import { safeFractionsName, units } from '../../services/UtilService'
import { getErc20Balance } from '../../services/WalletService'
import { colors, fonts, viewport } from '../../styles/variables'

export interface ClaimModalProps {
  className?: string
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ className }: ClaimModalProps) => {
  const chainId = useReactiveVar(chainIdVar)
  const claimModal = useReactiveVar(claimModalVar)
  const erc20Share = claimModal

  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)

  const [erc20Balance, setErc20Balance] = useState<string | undefined>(undefined)
  const [vaultBalance, setVaultBalance] = useState<string | undefined>(undefined)

  const [loading, setLoading] = useState(false)
  const [vaultBalanceDollar, setVaultBalanceDollar] = useState<string | undefined>(undefined)

  const { networkTokenSymbol } = getChainConfigById(chainId)

  useEffect(() => {
    const getShareBalance = async () => {
      if (erc20Share) {
        const balance = await getErc20Balance(erc20Share.id, erc20Share.decimals, chainId)
        setErc20Balance(balance.toString())
      }
    }
    getShareBalance()
  }, [chainId, erc20Share])

  useEffect(() => {
    const getVaultBalance = async () => {
      if (erc20Share) {
        const balance = await getAccountClaimAmount(erc20Share.id, chainId)
        setVaultBalance(balance.toString())
      }
    }
    getVaultBalance()
  }, [chainId, erc20Share])

  useEffect(() => {
    const getVaultBalancePriceDollar = async () => {
      const { ethAddress } = getChainConfigById(chainId)

      if (erc20Share && vaultBalance) {
        const quoteDollar = await zeroXQuoteService().quoteToStablecoin(
          erc20Share.paymentToken.symbol === null ? ethAddress : erc20Share.paymentToken.id,
          units(vaultBalance, 18),
          18,
          chainId
        )

        setVaultBalanceDollar(quoteDollar.priceDollar === '' ? '0' : quoteDollar.priceDollar)
      }
    }

    getVaultBalancePriceDollar()
  }, [chainId, erc20Share, vaultBalance])

  const handleCancel = () => {
    claimModalVar(undefined)
  }

  const claim = async () => {
    setLoading(true)
    if (erc20Share) {
      claimErc20(erc20Share.id, chainId)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'portfolioClaim' && transaction.confirmed) {
      handleCancel()
      setLoading(false)
      notifySuccess('Successful Claimmed')
      window.location.reload()
    }
  }, [transaction, transactionLoading])

  return (
    <S.ClaimModal onCancel={handleCancel} className={className} visible={!!claimModal} footer={null} destroyOnClose>
      {!!erc20Share && (
        <S.NftContent>
          <S.Header>
            <div>
              <h3>
                {safeFractionsName(erc20Share.name)}
                <small>{erc20Share.symbol}</small>
              </h3>
            </div>
            <div>
              <img src={erc20Share.metadata?.image} alt={`${erc20Share.target.collection?.name}`} />
            </div>
          </S.Header>
          <S.NftDetails>
            <div>Fractions Balance</div>
            <div>{Number(erc20Balance).toLocaleString('en-us', { maximumFractionDigits: 2 })}</div>
            <div>Claim Amount</div>
            <div>
              <div>
                {`${Number(vaultBalance).toLocaleString('en', { maximumFractionDigits: 6 })} ${
                  erc20Share.paymentToken.symbol || networkTokenSymbol
                }`}
              </div>
              <div>{vaultBalanceDollar && `$${vaultBalanceDollar}`}</div>
            </div>
          </S.NftDetails>
          <S.NftPay>
            <S.ActionButton loading={loading} onClick={claim}>
              Claim
            </S.ActionButton>
          </S.NftPay>
        </S.NftContent>
      )}
    </S.ClaimModal>
  )
}
export const S = {
  ClaimModal: styled(Modal)`
    border-radius: 8px;

    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-content {
      border-radius: 16px;
      max-width: 440px;
      background-color: ${props=>props.theme.gray['0']};
      color: ${props=>props.theme.gray['4']};
    }
    .ant-modal-close-x {
      display: none;
    }
    .ant-modal-footer {
      display: none;
    }
  `,
  NftContent: styled.div`
    padding: 24px 32px;

    @media (max-width: ${viewport.sm}) {
      padding: 32px 16px;
    }
  `,
  Header: styled.div`
    display: flex;
    flex-direction: row;

    div {
      &:nth-child(1) {
        flex: 1;
        display: flex;
        align-items: center;

        h3 {
          font-family: ${fonts.nunito};
          font-size: 24px;
          font-weight: 400;
          line-height: 24px;
          color: ${props=>props.theme.gray['4']};

          small {
            color: ${props=>props.theme.gray['4']};
            font-size: 12px;
            margin-left: 8px;
          }
        }
      }

      img {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        display: flex;
      }
    }
  `,
  NftDetails: styled.div`
    display: grid;
    grid-template-columns: 2fr 1.4fr;
    grid-template-rows: 32px 32px;

    border: 1px solid ${props=>props.theme.gray['4']};
    border-radius: 8px;
    padding: 16px;
    padding-bottom: 32px;
    margin-bottom: 32px;

    margin-top: 32px;

    div {
      font-family: ${fonts.nunito};
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      color: ${props=>props.theme.gray['4']};
      text-align: end;
    }

    > div:nth-child(4) {
      > div:nth-child(2) {
        color: ${props=>props.theme.gray['3']};
        font-size: 12px;
        line-height: 16px;
        position: absolute;
        margin-top: 38px;
      }
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    > div:nth-child(1),
    > div:nth-child(3) {
      justify-content: flex-start;
    }
  `,
  NftPay: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  `,
  TokenButton: styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;
    padding: 8px;

    img:nth-child(1) {
      margin-right: 8px;
    }

    span {
      margin-right: 8px;
      font-family: ${fonts.nunito};
      font-weight: 400;
      color: ${props=>props.theme.gray['4']};
    }

    img:nth-child(3) {
      width: 16px;
      height: 16px;
    }

    &.noDropdown {
      cursor: default;
      img:nth-child(3) {
        display: none;
      }
    }
  `,
  ActionButton: styled(Button)`
    height: 40px;
    padding: 0 64px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: ${fonts.nunito};
    width: 100%;

    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    color: ${colors.white};
    background-color: ${colors.blue1};
    border: 1px solid ${colors.blue1};

    &:hover,
    &:focus {
      font-family: ${fonts.nunito};
      color: ${colors.white};
      background-color: ${colors.blue2};
      border: 1px solid ${colors.blue2};
    }

    @media (max-width: ${viewport.sm}) {
      width: 100%;
    }
  `
}
