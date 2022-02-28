import { makeVar, useReactiveVar } from '@apollo/client'
import { Button, Input, Modal, Popconfirm } from 'antd'
import BigNumber from 'bignumber.js'
import fromExponential from 'from-exponential'
import { noop } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'
import supplyIcon from '../../assets/icons/money-coin.png'
import reservePriceIcon from '../../assets/icons/reserve-price.png'
import ethImage from '../../assets/tokens/ETH.png'
import { getChainConfigById } from '../../config'
import { transactionLoadingVar } from '../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { code } from '../../messages'
import { marketplaceService } from '../../services/MarketplaceService'
import { notifyError } from '../../services/NotificationService'
import { TheGraphPeerToPeerService } from '../../services/PeerToPeerService'
import { zeroXQuoteService } from '../../services/QuoteService'
import { safeIpfsUrl, scale, units } from '../../services/UtilService'
import { getErc20Balance } from '../../services/WalletService'
import { colorsV2, fonts, viewport } from '../../styles/variables'
import { ERC20Asset, MarketplaceERC20Item } from '../../types/MarketplaceTypes'

interface PeerToPeerTradeSaveModal {
  type: 'buy' | 'sell'
  erc20: MarketplaceERC20Item
  order?: {
    id?: string
    priceFraction: number
    amount: number
  }
}

export const peerToPeerTradeModalSaveVar = makeVar<PeerToPeerTradeSaveModal | undefined>(undefined)

export const PeerToPeerTradeSaveModal = () => {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const peerToPeerTradeData = useReactiveVar(peerToPeerTradeModalSaveVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const { ethAddress, networkTokenSymbol } = getChainConfigById(chainId)

  const [amount, setAmount] = useState<string | undefined>(peerToPeerTradeData?.order?.amount.toString(10))
  const [priceFraction, setPriceFraction] = useState<string | undefined>(peerToPeerTradeData?.order?.priceFraction.toString(10))
  const [total, setTotal] = useState<number | undefined>(
    peerToPeerTradeData?.order && priceFraction ? peerToPeerTradeData?.order?.amount * peerToPeerTradeData?.order?.priceFraction : undefined
  )
  const [impliedValue, setImpliedValue] = useState<number>(0)
  const [totalInDollar, setTotalInDollar] = useState<number>(0)
  const [token, setToken] = useState<ERC20Asset | undefined>(undefined)
  const [isValidInDollar, setIsValidInDollar] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [balance, setBalance] = useState<BigNumber | undefined>(undefined)
  const [balancePaymentToken, setBalancePaymentToken] = useState<BigNumber | undefined>(undefined)
  const [unlockedErc20, setUnlockedErc20] = useState<boolean>(false)
  const [unlockedErc20PaymentToken, setUnlockedErc20PaymentToken] = useState<boolean>(false)

  const handleClose = () => {
    setLoading(false)
    setBalance(undefined)
    setAmount(undefined)
    setPriceFraction(undefined)
    setImpliedValue(0)
    setToken(undefined)
    setTotal(undefined)
    setTotalInDollar(0)
    setIsValidInDollar(false)
    peerToPeerTradeModalSaveVar(undefined)
  }

  const handleInputChange = (type: 'amount' | 'priceFraction', value: string) => {
    let formattedValue = value.replace(',', '.')

    if (!formattedValue.match(/^\d+([.]\d{0,18})?$/g)) {
      return
    }

    if (type === 'amount') {
      if (Number(formattedValue) > Number(peerToPeerTradeData?.erc20.totalSupply)) {
        formattedValue = peerToPeerTradeData?.erc20.totalSupply || '0'
      }
      setAmount(formattedValue)
    }

    if (type === 'priceFraction') {
      setPriceFraction(formattedValue)
      setImpliedValue(new BigNumber(formattedValue).multipliedBy(peerToPeerTradeData?.erc20.totalSupply || '').toNumber())
    }
  }

  const erc20TokenAsset = (addressToImage: string, symbol: string, type: 'image' | 'jazzIcon') => {
    return (
      <S.TokenAsset>
        {type === 'image' ? (
          <img alt={symbol} src={safeIpfsUrl(addressToImage)} />
        ) : (
          <Jazzicon diameter={24} seed={jsNumberForAddress(addressToImage)} />
        )}
        <span>{symbol.length > 5 ? `${symbol.substr(0, 5)}...` : symbol}</span>
      </S.TokenAsset>
    )
  }

  const isInvalidAmount = (): boolean => {
    if (peerToPeerTradeData?.type === 'sell') {
      if (!amount) {
        return false
      }

      if (!balance) {
        return true
      }

      return new BigNumber(amount).comparedTo(balance) > 0
    }

    return false
  }

  const isInvalidTotal = (): boolean => {
    if (peerToPeerTradeData?.type === 'buy') {
      if (!priceFraction) {
        return false
      }

      if (!balancePaymentToken) {
        return true
      }

      return new BigNumber(total || 0).comparedTo(balancePaymentToken || 0) > 0
    }

    return false
  }

  const isUnlocked = (): boolean => {
    if (peerToPeerTradeData?.type === 'buy') {
      return unlockedErc20PaymentToken
    }

    return unlockedErc20
  }

  const handleUnlockErc20 = async (erc20Address: string) => {
    setLoading(true)
    if (erc20Address === '') {
      notifyError(code[5011])
      return
    }

    account && TheGraphPeerToPeerService(chainId).approveErc20(erc20Address, account)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    peerToPeerTradeData?.order?.id && account && TheGraphPeerToPeerService(chainId).cancelOrder(peerToPeerTradeData?.order?.id, account)

    handleClose()
  }

  const handleSave = async () => {
    setLoading(true)

    const baseToken = peerToPeerTradeData?.erc20?.id
    const baseTokenDecimals = peerToPeerTradeData?.erc20?.decimals
    const baseAmount = amount

    const quoteToken = peerToPeerTradeData?.erc20?.paymentToken.id
    const quoteTokenDecimals = peerToPeerTradeData?.erc20?.paymentToken.decimals
    const quoteAmount = `${total}`

    const isPayableWithEth = peerToPeerTradeData?.erc20?.paymentToken.symbol === null

    const payableAmount = peerToPeerTradeData?.type === 'sell' ? '0' : units(quoteAmount || '', quoteTokenDecimals || 18)

    if (peerToPeerTradeData?.order?.id) {
      const isGreaterThanOlder =
        peerToPeerTradeData?.type === 'sell'
          ? new BigNumber(baseAmount || '0').isGreaterThan(peerToPeerTradeData.order.priceFraction)
          : new BigNumber(quoteAmount || '0').isGreaterThan(
              new BigNumber(peerToPeerTradeData.order.amount).multipliedBy(peerToPeerTradeData.order.priceFraction)
            )

      peerToPeerTradeData?.type === 'sell'
        ? TheGraphPeerToPeerService(chainId).updateOrder(
            isPayableWithEth && isGreaterThanOlder ? payableAmount : '0',
            peerToPeerTradeData?.order?.id || '',
            baseAmount?.toString() || '',
            quoteAmount?.toString() || '',
            baseTokenDecimals || 0,
            quoteTokenDecimals || 0,
            account || '',
            'Sell'
          )
        : TheGraphPeerToPeerService(chainId).updateOrder(
            isPayableWithEth && isGreaterThanOlder ? payableAmount : '0',
            peerToPeerTradeData?.order?.id || '',
            quoteAmount?.toString() || '',
            baseAmount?.toString() || '',
            quoteTokenDecimals || 0,
            baseTokenDecimals || 0,
            account || '',
            'Buy'
          )

      handleClose()
      return
    }

    peerToPeerTradeData?.type === 'sell'
      ? TheGraphPeerToPeerService(chainId).createOrder(
          isPayableWithEth ? payableAmount : '0',
          baseToken || '',
          quoteToken || '',
          baseAmount?.toString() || '',
          quoteAmount?.toString() || '',
          baseTokenDecimals || 0,
          quoteTokenDecimals || 0,
          account || '',
          'Sell'
        )
      : TheGraphPeerToPeerService(chainId).createOrder(
          isPayableWithEth ? payableAmount : '0',
          quoteToken || '',
          baseToken || '',
          quoteAmount?.toString() || '',
          baseAmount?.toString() || '',
          quoteTokenDecimals || 0,
          baseTokenDecimals || 0,
          account || '',
          'Buy'
        )

    handleClose()
  }

  const getTokenAsset = useCallback(async () => {
    if (peerToPeerTradeData?.erc20?.paymentToken.symbol === null) {
      setToken({
        id: ethAddress,
        address: ethAddress,
        symbol: 'ETH',
        decimals: 18,
        imageUrl: ethImage,
        locked: false,
        name: 'Ethereum'
      })
      peerToPeerTradeData?.order?.amount && setAmount(peerToPeerTradeData?.order?.amount.toString(10))
      peerToPeerTradeData?.order?.priceFraction && setPriceFraction(peerToPeerTradeData?.order?.priceFraction.toString(10))
      setImpliedValue(
        new BigNumber(fromExponential(peerToPeerTradeData?.order?.priceFraction.toString(10) || '0'))
          .multipliedBy(peerToPeerTradeData?.erc20.totalSupply || '')
          .toNumber()
      )

      return
    }

    peerToPeerTradeData?.order?.amount && setAmount(peerToPeerTradeData?.order?.amount.toString(10))
    peerToPeerTradeData?.order?.priceFraction && setPriceFraction(peerToPeerTradeData?.order?.priceFraction.toString(10))
    setImpliedValue(
      new BigNumber(fromExponential(peerToPeerTradeData?.order?.priceFraction.toString(10) || '0'))
        .multipliedBy(peerToPeerTradeData?.erc20.totalSupply || '')
        .toNumber()
    )

    const tokenAsset = {
        id: peerToPeerTradeData?.erc20.paymentToken.id,
        name: peerToPeerTradeData?.erc20.paymentToken.name,
        symbol: peerToPeerTradeData?.erc20.paymentToken.symbol,
        decimals: peerToPeerTradeData?.erc20.paymentToken.decimals,
        address: peerToPeerTradeData?.erc20.paymentToken.id,
        imageUrl: ''
    }

    peerToPeerTradeData?.erc20?.paymentToken && setToken(tokenAsset)
  }, [chainId, ethAddress, peerToPeerTradeData])

  useEffect(() => {
    peerToPeerTradeData && getTokenAsset()
  }, [getTokenAsset, peerToPeerTradeData])

  const isApproved = useCallback(
    async (erc20Address: string): Promise<boolean> => {
      if (!account) {
        return false
      }

      const approvedAmount = await TheGraphPeerToPeerService(chainId).isApprovedErc20(erc20Address, account)

      return approvedAmount > 0
    },
    [chainId, account]
  )

  useEffect(() => {
    const checkErc20Unlocked = async () => {
      peerToPeerTradeData?.erc20.id && setUnlockedErc20(await isApproved(peerToPeerTradeData?.erc20.id))
    }

    checkErc20Unlocked()
  }, [isApproved, peerToPeerTradeData?.erc20.id, transactionLoading])

  useEffect(() => {
    const checkErc20PaymentTokenUnlocked = async () => {
      if (peerToPeerTradeData?.erc20.paymentToken.symbol === null) {
        setUnlockedErc20PaymentToken(true)
        return
      }

      peerToPeerTradeData?.erc20.paymentToken && setUnlockedErc20PaymentToken(await isApproved(peerToPeerTradeData?.erc20.paymentToken.id))
    }

    checkErc20PaymentTokenUnlocked()
  }, [isApproved, peerToPeerTradeData?.erc20.paymentToken.id, transactionLoading, peerToPeerTradeData?.erc20.paymentToken])

  useEffect(() => {
    const handleTotal = async () => {
      if (!priceFraction) {
        setImpliedValue(0)
      }

      if (!amount || !priceFraction) {
        setTotal(0)
        setTotalInDollar(1)
        setIsValidInDollar(false)
        return
      }

      const newTotal = amount && priceFraction ? new BigNumber(amount).multipliedBy(priceFraction).toNumber() : 0

      if (Number.isNaN(newTotal) || Number.isNaN(priceFraction)) {
        return
      }

      const newTotalUnits = scale(
        new BigNumber(Number(amount)).multipliedBy(Number(priceFraction)),
        peerToPeerTradeData?.erc20.paymentToken.decimals || 18
      )
      const quoteNewTotalDollar = await zeroXQuoteService().quoteToStablecoin(
        peerToPeerTradeData?.erc20?.paymentToken.id || '',
        newTotalUnits.toString(10),
        peerToPeerTradeData?.erc20.paymentToken.decimals || 18,
        chainId
      )

      const totalDollar = 1 //quoteNewTotalDollar.priceDollar === '' ? 0 : Number(quoteNewTotalDollar.priceDollar.replaceAll(',', ''))

      setTotal(newTotal)
      setImpliedValue(new BigNumber(priceFraction).multipliedBy(peerToPeerTradeData?.erc20.totalSupply || '').toNumber())
      setTotalInDollar(totalDollar)
      setIsValidInDollar(totalDollar >= 1)
    }

    handleTotal()
  }, [amount, chainId, peerToPeerTradeData?.erc20.paymentToken, priceFraction, peerToPeerTradeData?.erc20.totalSupply])

  useEffect(() => {
    const getBalance = async () => {
      if (account && peerToPeerTradeData?.erc20.id) {
        const erc20Balance = await getErc20Balance(peerToPeerTradeData?.erc20.id, peerToPeerTradeData?.erc20.decimals, chainId)
        setBalance(erc20Balance)

        const erc20PaymentTokenBalance = await getErc20Balance(
          peerToPeerTradeData?.erc20.paymentToken.id || '',
          peerToPeerTradeData?.erc20.paymentToken.decimals,
          chainId
        )
        setBalancePaymentToken(erc20PaymentTokenBalance)
      }
    }

    account && peerToPeerTradeData?.erc20.id && getBalance()
  }, [
    account,
    chainId,
    peerToPeerTradeData?.erc20.id,
    peerToPeerTradeData?.erc20.decimals,
    peerToPeerTradeData?.erc20.paymentToken.id,
    peerToPeerTradeData?.erc20.paymentToken.decimals,
    transactionLoading
  ])

  return (
    <S.Modal centered visible={!!account && !!peerToPeerTradeData} onCancel={handleClose}>
      <S.Header>
        <h3>{`${peerToPeerTradeData?.order ? `Update ${peerToPeerTradeData?.type}` : `${peerToPeerTradeData?.type}`} order details`}</h3>
      </S.Header>
      <S.Content>
        <div>
          <div>
            <img alt='Supply icon' src={supplyIcon} />
            <span>
              <small>Supply</small>
              <span>{Number(fromExponential(peerToPeerTradeData?.erc20.totalSupply || '0')).toLocaleString('en')}</span>
            </span>
          </div>
          <div>
            <img alt='Fraction price reserve icon' src={reservePriceIcon} />
            <span>
              <small>Fraction Reserve Price</small>
              <span>
                {`${new BigNumber(peerToPeerTradeData?.erc20.exitPrice || '0')
                  .dividedBy(peerToPeerTradeData?.erc20.totalSupply || '0')
                  .toNumber()
                  .toLocaleString('en', { maximumFractionDigits: peerToPeerTradeData?.erc20.paymentToken.decimals })} ${
                  peerToPeerTradeData?.erc20.paymentToken.symbol || networkTokenSymbol
                }`}
              </span>
            </span>
          </div>
        </div>
        <div>
          <div>
            <span>Amount</span>
            <div className={`${!isInvalidAmount() ? '' : 'error'}`}>
              {peerToPeerTradeData?.type === 'sell' && (
                <small>
                  {`Balance: ${balance?.toNumber().toLocaleString('en', { maximumFractionDigits: 4 })} ${
                    peerToPeerTradeData?.erc20.paymentToken.symbol || networkTokenSymbol
                  }`}
                </small>
              )}

              {peerToPeerTradeData?.erc20 && (
                <S.Input
                  onChange={event => handleInputChange('amount', event.target.value)}
                  addonBefore={erc20TokenAsset(peerToPeerTradeData?.erc20.id, peerToPeerTradeData?.erc20.symbol, 'jazzIcon')}
                  value={amount}
                />
              )}
            </div>
          </div>
          <div>
            <span>Price per Fraction</span>
            <div>
              {token && (
                <S.Input
                  onChange={event => handleInputChange('priceFraction', event.target.value)}
                  addonBefore={erc20TokenAsset(token.imageUrl || token.id, token.symbol || networkTokenSymbol, 'jazzIcon')}
                  value={priceFraction}
                />
              )}
            </div>
          </div>
          <div>
            <span>
              <span>Total</span>
              {peerToPeerTradeData?.type === 'buy' && (
                <small>
                  {`Balance: ${balancePaymentToken?.toNumber().toLocaleString('en', {
                    maximumFractionDigits: 4
                  })} ${peerToPeerTradeData?.erc20.paymentToken.symbol || networkTokenSymbol}`}
                </small>
              )}
            </span>
            <div className={`${totalInDollar < 1 || isInvalidTotal() ? 'error' : ''}`}>
              {token && (
                <S.Input
                  className='disabled'
                  addonBefore={erc20TokenAsset(token.imageUrl || token.address, token.symbol || networkTokenSymbol, 'jazzIcon')}
                  disabled
                  value={total}
                />
              )}
              <small>
                {`$${
                  !amount || !priceFraction
                    ? '0.00'
                    : totalInDollar.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }`}
              </small>
              {!isValidInDollar && <small>The total in dollar should be equal or greater than $1</small>}
            </div>
            <small>
              <span>Implied Valuation</span>
              <span>{`${impliedValue.toLocaleString('en', { maximumFractionDigits: 2 })} ${token?.symbol}`}</span>
            </small>
          </div>
        </div>
      </S.Content>
      <S.Footer>
        {!unlockedErc20 && peerToPeerTradeData?.erc20.id && peerToPeerTradeData?.type === 'sell' && (
          <S.PrimaryButton disabled={!account} loading={loading} onClick={() => handleUnlockErc20(peerToPeerTradeData?.erc20.id)}>
            {`Unlock ${peerToPeerTradeData?.erc20.symbol}`}
          </S.PrimaryButton>
        )}
        {!unlockedErc20PaymentToken && peerToPeerTradeData?.type === 'buy' && peerToPeerTradeData?.erc20.paymentToken && (
          <S.PrimaryButton
            disabled={!account}
            loading={loading}
            onClick={() => handleUnlockErc20(peerToPeerTradeData?.erc20.paymentToken.id || '')}>
            {`Unlock ${peerToPeerTradeData?.erc20.paymentToken.symbol || networkTokenSymbol}`}
          </S.PrimaryButton>
        )}
        {account && isUnlocked() && (
          <S.PrimaryButton
            className={`${peerToPeerTradeData?.order ? 'update' : ''}`}
            disabled={isInvalidAmount() || !amount || !isValidInDollar}
            loading={loading}
            onClick={handleSave}>
            {`${peerToPeerTradeData?.order ? 'Update' : `Create`} order`}
          </S.PrimaryButton>
        )}
        {account && isUnlocked() && peerToPeerTradeData?.order && (
          <Popconfirm
            title='Are you sure you want to delete this order?'
            okText='Delete'
            cancelText='Cancel'
            onConfirm={handleDelete}
            onCancel={() => noop()}>
            <S.DeleteButton>Delete Order</S.DeleteButton>
          </Popconfirm>
        )}
      </S.Footer>
    </S.Modal>
  )
}

const S = {
  Modal: styled(Modal)`
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-style: ${fonts.nunito};
    width: 100% !important;

    .ant-modal-body {
      padding: 0;
      background-color: ${props=>props.theme.white};
    }

    .ant-modal-content {
      border-radius: 16px;
      max-width: 489px;
      width: 100%;
      margin: 0 auto;
    }

    .ant-modal-close-x {
      display: none;
    }

    .ant-modal-footer {
      display: none;
    }
  `,
  Header: styled.div`
    background-color: ${props=>props.theme.gray['0']};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    margin-bottom: 24px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;

    > h3 {
      font-family: ${fonts.nunito};
      font-size: 24px;
      font-weight: 500;
      text-transform: capitalize;
      text-align: center;
      line-height: 32px;
      color: ${props=>props.theme.gray['4']};
    }
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 26px;
    padding: 0 32px;

    > div {
      width: 100%;

      &:first-child {
        display: flex;
        padding: 16px 24px;
        background-color: ${props=>props.theme.gray['0']};
        justify-content: space-between;
        width: 100%;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        color: ${props=>props.theme.gray['3']};

        @media (max-width: ${viewport.sm}) {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        > div {
          display: flex;
          align-items: center;
          gap: 12px;

          > img {
            width: 20px;
            height: 20px;
          }

          > span {
            display: flex;
            flex-direction: column;
            gap: 2px;

            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            color: ${props=>props.theme.black};

            > small {
              color: ${props=>props.theme.gray['3']};
              font-size: 12px;
              line-height: 16px;
              font-weight: 400;
            }
          }
        }
      }

      &:last-child {
        display: flex;
        flex-direction: column;
        gap: 24px;

        > div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 4px;

          > span {
            color: ${props=>props.theme.black};
            font-weight: 500;
            font-size: 18px;
            line-height: 24px;
            flex: 1;
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: flex-end;

            > small {
              font-size: 12px;
              line-height: 16px;
              font-weight: 400;
              color: ${props=>props.theme.gray['3']};
            }

            &.error {
              > small {
                color: ${props=>props.theme.red.light};
              }
            }
          }

          > div {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: flex-end;
            flex: 3;
            gap: 04px;

            > small {
              color: ${props=>props.theme.gray['3']};
              font-size: 12px;
              line-height: 16px;
              font-weight: 400;
            }

            &.error {
              color: ${props=>props.theme.red.light};

              .ant-input-group-addon,
              .ant-input {
                border-color: ${props=>props.theme.red.light};
              }

              > small {
                color: ${props=>props.theme.red.light};
              }
            }
          }

          > small {
            margin-top: 24px;
            color: ${props=>props.theme.gray['4']};
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
            display: flex;
            width: 100%;
            justify-content: space-between;
            border-bottom: 1px solid ${props=>props.theme.gray['1']};
            padding-bottom: 4px;
          }
        }
      }
    }
  `,
  Footer: styled.div`
    padding: 24px 32px 32px;
    display: flex;
    gap: 8px;

    @media (max-width: ${viewport.sm}) {
      flex-direction: column;
    }

    > button {
      height: 40px;
      width: 100%;
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
      background-color: ${props=>props.theme.gray['1']};
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
          background-color: ${props=>props.theme.gray['0']};
        }
      }
    }

    .ant-input-group-addon {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border-right: 1px solid ${props=>props.theme.gray['0']};
      background-color: ${props=>props.theme.white};
      color: ${props=>props.theme.gray['4']};
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
      background-color: ${props=>props.theme.white};
      color: ${props=>props.theme.gray['4']};
      border-left: none;
      text-align: right;
      padding-right: 16px;
      height: 40px;

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
      border-color: ${props=>props.theme.gray['1']};
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
  `,
  PrimaryButton: styled(Button)`
    border-radius: 8px;
    background-color: ${colorsV2.blue.main};
    text-transform: capitalize;
    color: ${colorsV2.white};
    outline: none;
    box-shadow: none;
    border: none;

    &.update {
      background-color: ${colorsV2.green.main};

      &:focus {
        background-color: ${colorsV2.green.main};
      }

      &:active,
      &:hover {
        background-color: ${colorsV2.green.light};
      }

      &:disabled {
        &:active,
        &:focus,
        &:hover {
          background-color: ${colorsV2.green.lighter};
        }

        background-color: ${colorsV2.green.lighter};
      }
    }

    &:focus {
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      outline: none;
      box-shadow: none;
      border: none;
    }

    &:disabled {
      &:active,
      &:focus,
      &:hover {
        color: ${colorsV2.white};
        border-radius: 8px;
        background-color: ${colorsV2.blue.main};
        box-shadow: none;
        border: none;
        opacity: 0.25;
      }

      border-radius: 8px;
      background-color: ${colorsV2.blue.main};
      box-shadow: none;
      border: none;
      opacity: 0.25;
      color: ${colorsV2.white};
    }

    &:active,
    &:hover {
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      outline: none;
      box-shadow: none;
      border: none;
      opacity: 0.65;
    }

    > span {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
    }
  `,
  DeleteButton: styled(Button)`
    border-radius: 8px;
    background-color: ${colorsV2.red.main};
    text-transform: capitalize;
    color: ${colorsV2.white};
    outline: none;
    box-shadow: none;
    border: 1px solid ${props=>props.theme.gray['1']};

    &:focus {
      background-color: ${colorsV2.red.light};
      color: ${colorsV2.white};
      outline: none;
      box-shadow: none;
      border: 1px solid ${props=>props.theme.gray['1']};
    }

    &:disabled {
      &:active,
      &:focus,
      &:hover {
        background-color: ${colorsV2.red.lighter};
        color: ${colorsV2.white};
        outline: none;
        box-shadow: none;
        border: 1px solid ${props=>props.theme.gray['1']};
        opacity: 0.65;
      }

      background-color: ${colorsV2.red.lighter};
      color: ${colorsV2.white};
      outline: none;
      box-shadow: none;
      border: 1px solid ${props=>props.theme.gray['1']};
      opacity: 0.65;
    }

    &:active,
    &:hover {
      background-color: ${colorsV2.red.light};
      color: ${colorsV2.white};
      outline: none;
      box-shadow: none;
      border: 1px solid ${props=>props.theme.gray['1']};
      opacity: 0.45;
    }

    > span {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
    }
  `
}
