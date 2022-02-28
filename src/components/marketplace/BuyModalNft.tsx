import { useReactiveVar } from '@apollo/client'
import { Button, Input } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { getChainConfigById } from '../../config'
import { buyModalVar } from '../../graphql/variables/MarketplaceVariable'
import { clearTransaction, transactionLoadingVar, transactionVar } from '../../graphql/variables/TransactionVariable'
import { chainIdVar, connectWalletModalVar } from '../../graphql/variables/WalletVariable'
import { approveErc20Redeem, getAccountRedeemAmount, isApprovedErc20Redeem, redeemErc20 } from '../../services/NftfyService'
import { zeroXQuoteService } from '../../services/QuoteService'
import { safeIpfsUrl, units } from '../../services/UtilService'
import { getErc20Balance } from '../../services/WalletService'
import { colors, colorsV2, fonts, viewport } from '../../styles/variables'
import { MarketplaceERC20Item } from '../../types/MarketplaceTypes'

interface BuyModalNftProps {
  account: string | undefined
  erc20: MarketplaceERC20Item
}
export function BuyModalNft({ erc20, account }: BuyModalNftProps) {
  const chainId = useReactiveVar(chainIdVar)
  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const history = useHistory()

  const { name, symbol, exitPrice, id, decimals, paymentToken, totalSupply, target } = erc20
  const { networkTokenSymbol } = getChainConfigById(chainId)

  const [exitPriceDollar, setExitPriceDollar] = useState<string | undefined>(undefined)
  const [erc20Balance, setErc20Balance] = useState<string | undefined>(undefined)
  const [paymentTokenBalance, setPaymentTokenBalance] = useState<string | undefined>(undefined)
  const [participation, setParticipation] = useState<string | undefined>(undefined)
  const [redeemAmount, setRedeemAmount] = useState<string | undefined>(undefined)
  const [approved, setApproved] = useState(false)

  const erc20TokenAsset = (addressToImage: string, tokenSymbol: string, type: 'image' | 'jazzIcon') => {
    return (
      <S.TokenAsset>
        {type === 'image' ? (
          <img alt={symbol} src={safeIpfsUrl(addressToImage)} />
        ) : (
          <Jazzicon diameter={24} seed={jsNumberForAddress(addressToImage)} />
        )}
        <span>{tokenSymbol?.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol || networkTokenSymbol}</span>
      </S.TokenAsset>
    )
  }

  useEffect(() => {
    const checkApproved = async () => {
      if (paymentToken.symbol === null) {
        setApproved(true)
        return
      }

      if (account && chainId && !transactionLoading) {
        const isApproved = await isApprovedErc20Redeem(id, paymentToken.id, account, chainId)
        setApproved(isApproved !== '0')
      }
    }
    checkApproved()
  }, [account, chainId, id, paymentToken.id, paymentToken.symbol, transactionLoading])

  useEffect(() => {
    const getExitPriceDollar = async () => {
      const exitAmount = units(exitPrice || '1', paymentToken.decimals || 6)

      const quoteDollar = await zeroXQuoteService().quoteToStablecoin(
        paymentToken.id || '',
        exitAmount,
        paymentToken.decimals || 6,
        chainId
      )

      const exitPriceDollarValue = quoteDollar.priceDollar === '' ? '0' : quoteDollar.priceDollar

      setExitPriceDollar(exitPriceDollarValue)
    }

    getExitPriceDollar()
  }, [chainId, exitPrice, paymentToken.id, paymentToken.decimals])

  useEffect(() => {
    const getShareBalance = async () => {
      const balance = await getErc20Balance(id, decimals, chainId)
        setErc20Balance(balance.toString())
        setParticipation(
          new BigNumber(balance).div(totalSupply).multipliedBy(100).toNumber().toLocaleString('en-us', {
            maximumFractionDigits: 2
          })
        )
    }
    getShareBalance()
  }, [account, id, chainId, decimals, totalSupply])

  useEffect(() => {
    const getPaymentTokenBalance = async () => {
      const balance = await getErc20Balance(paymentToken.id, paymentToken.decimals, chainId)
        setPaymentTokenBalance(balance.toString())
    }
    getPaymentTokenBalance()
  }, [account, chainId, totalSupply, paymentToken.id, paymentToken.decimals])

  useEffect(() => {
    const getRedeemAmount = async () => {
      if (account) {
        const amount = await getAccountRedeemAmount(id, account, chainId)
        setRedeemAmount(amount)
      }
    }
    getRedeemAmount()
  }, [account, id, chainId])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'redeem' && transaction.confirmed) {
      buyModalVar(undefined)
      history.push(`/wallet/fractionalize/${target.collection.id}/${target.tokenId}`)
      clearTransaction()
    }
  }, [transaction, transactionLoading, history, target.collection.id, target.tokenId])

  const handleApprove = async () => {
    account && approveErc20Redeem(id, paymentToken.id, account, chainId)
  }

  const redeem = async () => {
    account && redeemErc20(id, account, chainId)
  }

  const openConnectWalletModal = () => {
    connectWalletModalVar(true)
  }

  const safeNftName = (erc20Name: string) => {
    return erc20Name.replace('Shares', '').replace('Fractions', '').replace('shares', '').replace('fractions', '')
  }

  return (
    <S.Content>
      <S.Header>
        <h4>Buy NFT</h4>
      </S.Header>
      <S.Details>
        <div>
          <h3>
            {safeNftName(name)}
            <small>{symbol}</small>
          </h3>
          <small>Reserve Price</small>
          <span>
            {`${Number(exitPrice).toLocaleString('en-us', { maximumFractionDigits: 2 })}`}
            <small>{paymentToken.symbol || networkTokenSymbol}</small>
          </span>
          <small>{`$${exitPriceDollar}`}</small>
        </div>
        <div>
          <img src={erc20.metadata?.image} alt={`${safeNftName(erc20.metadata?.name || name)} ${symbol}`} />
        </div>
      </S.Details>
      <div>
        <h4>Order Detail</h4>
      </div>
      {account && (
        <S.Participation>
          <div>
            <span>
              Pay Amount
              <small>{`Balance: ${Number(paymentTokenBalance).toLocaleString('en', { maximumFractionDigits: 4 })} ${
                paymentToken.symbol || networkTokenSymbol
              }`}</small>
            </span>
            <S.Input
              addonBefore={erc20TokenAsset(paymentToken.id, paymentToken.symbol, 'jazzIcon')}
              className='disabled'
              value={Number(redeemAmount).toLocaleString('en-us', { maximumFractionDigits: 2 })}
              disabled
            />
          </div>
          <div>
            <span>Participation</span>
            <S.Input
              addonBefore={erc20TokenAsset(id, symbol, 'jazzIcon')}
              className='disabled'
              value={Number(erc20Balance).toLocaleString('en-us', { maximumFractionDigits: 2 })}
              disabled
            />
            <small>{`${participation}%`}</small>
          </div>
          <div>
            <span>Total</span>
            <S.Input
              addonBefore={erc20TokenAsset(paymentToken.id, paymentToken.symbol, 'jazzIcon')}
              className='disabled'
              value={exitPrice}
              disabled
            />
            <small>{`$${exitPriceDollar}`}</small>
          </div>
        </S.Participation>
      )}
      {!account && (
        <S.Participation>
          <div>Your Participation</div>
          <div>-</div>
          <div>Your Balance</div>
          <div>-</div>
          <div>Pay Amount </div>
          <div>-</div>
        </S.Participation>
      )}
      <S.Actions>
        {!account && <S.ActionButton onClick={openConnectWalletModal}>Connect Wallet to Buy</S.ActionButton>}
        {account && paymentToken.symbol !== null && !approved && (
          <S.ActionButton onClick={handleApprove}>{`Approve ${paymentToken.symbol}`}</S.ActionButton>
        )}
        {account && approved && (
          <S.ActionButton onClick={redeem}>{participation && participation === '100' ? 'Redeem' : 'Buy NFT'}</S.ActionButton>
        )}
      </S.Actions>
    </S.Content>
  )
}

const S = {
  Header: styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: ${colorsV2.gray['0']};
    height: 64px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    > h4 {
      color: ${colorsV2.gray['4']};
      font-weight: 400;
      font-size: 24px;
      line-height: 32px;
    }
  `,
  Content: styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 24px;
    justify-content: center;

    > div {
      padding: 0 32px;

      &:last-child {
        margin-bottom: 40px;
      }
    }

    > h4 {
      font-size: 24px;
      line-height: 32px;
      font-weight: 500;
      color: ${colorsV2.black};
    }
  `,
  Details: styled.div`
    display: flex;
    flex-direction: row;

    div {
      &:nth-child(1) {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;

        > h3 {
          font-family: ${fonts.nunito};
          font-size: 24px;
          font-weight: 600;
          line-height: 24px;
          color: ${colorsV2.black};

          small {
            color: ${colorsV2.gray['3']};
            font-size: 12px;
            margin-left: 6px;
            font-weight: 400;
          }
        }

        > small {
          color: ${colorsV2.gray['3']};
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
        }

        > span {
          color: ${colorsV2.black};
          font-size: 24px;
          line-height: 32px;
          font-weight: 600;

          > small {
            margin-left: 6px;
            font-size: 12px;
            line-height: 16px;
            font-weight: 400;
          }
        }
      }

      img {
        width: 104px;
        height: 104px;
        border-radius: 8px;
        display: flex;
        object-fit: cover;
      }
    }
  `,
  Participation: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 24px;

    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;

      > span {
        font-size: 18px;
        line-height: 24px;
        color: ${colorsV2.black};
        display: flex;
        justify-content: space-between;
        width: 100%;

        > small {
          color: ${colorsV2.gray['3']};
          font-size: 12px;
          line-height: 16px;
        }
      }

      > small {
        color: ${colorsV2.gray['3']};
        font-size: 12px;
        line-height: 16px;
        align-self: flex-end;
      }
    }
  `,
  NftExitPrice: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 48px;
    margin-top: 16px;
    margin-bottom: 16px;

    > div:nth-child(1) {
      display: flex;
      flex: 100px 0 0;

      font-family: ${fonts.nunito};
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
      color: ${colors.gray1};
    }

    > div:nth-child(2) {
      flex: 1;

      > div {
        display: flex;
        justify-content: flex-end;
      }

      > div:nth-child(1) {
        font-family: ${fonts.nunito};
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;
        color: ${colors.gray2};
      }

      > div:nth-child(2) {
        font-family: ${fonts.nunito};
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;
        color: ${colors.gray1};
      }
    }
  `,
  Actions: styled.div`
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
      color: ${colors.gray2};
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
  `,
  TokenInput: styled(Input)`
    border: none;
    outline: none;
    box-shadow: none;
    text-align: end;
    padding: 0;

    width: 100%;
    height: 100%;

    font-family: ${fonts.nunito};
    font-size: 16px;
    line-height: 24px;
    color: ${colors.gray2};
    font-weight: 400;

    &:hover,
    &:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }
  `,
  Input: styled(Input)`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    height: 40px;
    box-shadow: none;
    outline: none;

    &:active,
    &:focus,
    &:hover {
      box-shadow: none;
      outline: none;
      border-color: #e7e7e7 !important;
    }

    &:disabled {
      border-radius: 8px;
      border: none;
      box-shadow: none;
      outline: none;
      background-color: ${colorsV2.gray['0']};
      text-align: right;
      padding-right: 16px;
      height: 40px;
    }

    &.disabled {
      > span {
        > span,
        > input {
          border: none;
          box-shadow: none;
          outline: none;
          background-color: ${colorsV2.gray['0']};
        }
      }
    }

    .ant-input-group-addon {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border-right: 1px solid ${colorsV2.gray['0']};
      background-color: ${colorsV2.white};
      padding-left: 16px;
      height: 40px;

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
      background-color: ${colorsV2.white};
      border-left: none;
      text-align: right;
      padding-right: 16px;
      height: 40px;

      &:disabled {
        border-radius: 8px;
        border: none;
        box-shadow: none;
        outline: none;
        background-color: ${colorsV2.gray['0']};
        text-align: right;
        padding-right: 16px;
        height: 40px;
      }

      &:active,
      &:focus,
      &:hover {
        box-shadow: none;
        outline: none;
      }
    }

    .ant-input-group-addon {
      width: 145px;
      > span {
        justify-content: flex-start;
      }
    }

    .ant-input-group-addon,
    .ant-input {
      border-color: ${colorsV2.gray['1']};
    }
  `,
  TokenAsset: styled.span`
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;

    > span {
      font-size: 16px;
      line-height: 20px;
    }
  `
}
