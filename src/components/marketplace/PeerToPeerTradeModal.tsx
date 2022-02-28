import { makeVar, useReactiveVar } from '@apollo/client'
import { Button, Input, Modal } from 'antd'
import BigNumber from 'bignumber.js'
import fromExponential from 'from-exponential'
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
import { safeIpfsUrl, scale } from '../../services/UtilService'
import { getErc20Balance } from '../../services/WalletService'
import { colorsV2, fonts, viewport } from '../../styles/variables'
import { ERC20Asset, MarketplaceERC20Item } from '../../types/MarketplaceTypes'

interface PeerToPeerTradeModal {
  type: 'listings' | 'offers'
  erc20: MarketplaceERC20Item
  order: {
    id: string
    priceFraction: number
    amount: number
    total: number
  }
}

export const peerToPeerTradeModalVar = makeVar<PeerToPeerTradeModal | undefined>(undefined)

export const PeerToPeerTradeModal = () => {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const peerToPeerTradeData = useReactiveVar(peerToPeerTradeModalVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)

  const { ethAddress, networkTokenSymbol } = getChainConfigById(chainId)

  const [impliedValue, setImpliedValue] = useState<number>(0)
  const [amount, setAmount] = useState<string | undefined>(peerToPeerTradeData?.order?.amount.toString(10))
  const [priceFraction, setPriceFraction] = useState<string | undefined>(peerToPeerTradeData?.order?.priceFraction.toString(10))
  const [total, setTotal] = useState<string | undefined>(
    amount && priceFraction
      ? new BigNumber(amount)
          .multipliedBy(priceFraction)
          .toNumber()
          .toLocaleString('en', { maximumFractionDigits: peerToPeerTradeData?.erc20.paymentToken.decimals || 18 })
      : undefined
  )

  const [token, setToken] = useState<ERC20Asset | undefined>(undefined)
  const [balanceErc20Fractions, setBalanceErc20Fractions] = useState<BigNumber | undefined>(undefined)
  const [balanceErc20, setBalanceErc20] = useState<BigNumber | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [orderFee, setOrderFee] = useState<string>('')
  const [unlockedErc20, setUnlockedErc20] = useState<boolean>(false)
  const [unlockedErc20PaymentToken, setUnlockedErc20PaymentToken] = useState<boolean>(false)

  const handleUnlockErc20 = async (erc20Address: string) => {
    setLoading(true)
    if (erc20Address === '') {
      notifyError(code[5011])
      return
    }

    account && (await TheGraphPeerToPeerService(chainId).approveErc20(erc20Address, account))
    setLoading(false)
  }

  const handleClose = () => {
    setLoading(false)
    setAmount(undefined)
    setPriceFraction(undefined)
    setBalanceErc20Fractions(undefined)
    setBalanceErc20(undefined)
    setOrderFee('')
    setToken(undefined)
    setTotal(undefined)
    setImpliedValue(0)
    peerToPeerTradeModalVar(undefined)
  }

  const handleInputChange = (type: 'amount' | 'total', value: string) => {
    const formattedValue = value.replace(',', '.')

    if (type === 'amount') {
      setAmount(formattedValue)

      if (priceFraction && formattedValue.substr(-1) !== '.') {
        const newTotal = new BigNumber(formattedValue).multipliedBy(priceFraction).toNumber()
        setTotal(
          !Number.isNaN(newTotal)
            ? newTotal.toLocaleString('en', { maximumFractionDigits: peerToPeerTradeData?.erc20.paymentToken.decimals || 18 })
            : '0'
        )
      }
    }

    if (type === 'total') {
      setTotal(formattedValue)
      if (priceFraction && formattedValue.substr(-1) !== '.') {
        setAmount(
          new BigNumber(formattedValue)
            .dividedBy(priceFraction)
            .toNumber()
            .toLocaleString('en', { maximumFractionDigits: peerToPeerTradeData?.erc20.decimals || 6 })
        )
      }
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
        <span>{symbol?.length > 6 ? `${symbol.substr(0, 6)}...` : symbol || networkTokenSymbol}</span>
      </S.TokenAsset>
    )
  }

  const handleExecuteOrder = async () => {
    setLoading(true)

    const isPayableWithEth = peerToPeerTradeData?.erc20?.paymentToken.symbol === null && peerToPeerTradeData?.type === 'listings'

    const bookTokenDecimals =
      peerToPeerTradeData?.type === 'listings' ? peerToPeerTradeData?.erc20?.decimals : peerToPeerTradeData?.erc20?.paymentToken.decimals
    const bookAmount = peerToPeerTradeData?.type === 'listings' ? amount : `${total}`

    const estimatedExecAmount = await TheGraphPeerToPeerService(chainId).estimateOrderExecutionByBook(
      peerToPeerTradeData?.order?.id || '',
      bookAmount?.toString() || '0',
      bookTokenDecimals || 6
    )

    const payableAmount = isPayableWithEth ? estimatedExecAmount._execAmount : '0'

    peerToPeerTradeData?.type === 'listings'
      ? TheGraphPeerToPeerService(chainId).executeOrder(
          payableAmount || '0',
          peerToPeerTradeData?.order?.id || '',
          bookAmount?.toString() || '',
          estimatedExecAmount._execAmount || '',
          bookTokenDecimals || 0,
          account || '',
          'listings'
        )
      : TheGraphPeerToPeerService(chainId).executeOrder(
          payableAmount || '0',
          peerToPeerTradeData?.order?.id || '',
          bookAmount?.toString() || '',
          estimatedExecAmount._execAmount || '',
          bookTokenDecimals || 0,
          account || '',
          'buy'
        )

    handleClose()
  }

  const canExecuteOrder = (): boolean => {
    return !isInvalidAmount() && !isInvalidTotal()
  }

  const isInvalidAmount = (): boolean => {
    if (peerToPeerTradeData?.type === 'offers') {
      if (!amount) {
        return false
      }

      if (!balanceErc20Fractions) {
        return true
      }

      return new BigNumber(amount).isGreaterThan(balanceErc20Fractions)
    }

    return false
  }

  const isInvalidTotal = (): boolean => {
    if (peerToPeerTradeData?.type === 'listings') {
      if (!total) {
        return false
      }

      if (!balanceErc20) {
        return true
      }

      return new BigNumber(total).isGreaterThan(balanceErc20)
    }

    return false
  }

  const isUnlocked = (): boolean => {
    if (peerToPeerTradeData?.type === 'listings') {
      return unlockedErc20PaymentToken
    }

    return unlockedErc20
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

      return
    }

    const tokenAsset =
      (await marketplaceService(chainId, 2).getAsset(peerToPeerTradeData?.erc20?.paymentToken.id || '')) ||
      (await marketplaceService(chainId, 1).getAsset(peerToPeerTradeData?.erc20?.paymentToken.id || ''))
    peerToPeerTradeData?.erc20?.paymentToken && setToken(tokenAsset)
  }, [chainId, ethAddress, peerToPeerTradeData?.erc20?.paymentToken])

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
  }, [isApproved, peerToPeerTradeData?.erc20.paymentToken, transactionLoading])

  useEffect(() => {
    if (peerToPeerTradeData?.order) {
      setAmount(fromExponential(peerToPeerTradeData?.order.amount.toString(10)))
      setPriceFraction(fromExponential(peerToPeerTradeData?.order.priceFraction.toString(10)))
      setTotal(
        fromExponential(
          new BigNumber(peerToPeerTradeData?.order.amount).multipliedBy(peerToPeerTradeData?.order.priceFraction).toString(10)
        )
      )
      setImpliedValue(new BigNumber(priceFraction || '0').multipliedBy(peerToPeerTradeData?.erc20.totalSupply || '').toNumber())
    }
  }, [peerToPeerTradeData?.erc20.totalSupply, peerToPeerTradeData?.order, priceFraction])

  useEffect(() => {
    const getBalance = async () => {
      if (account && peerToPeerTradeData?.erc20.id) {
        const erc20BalanceFractions = await getErc20Balance(
          peerToPeerTradeData?.erc20.id,
          peerToPeerTradeData?.erc20.decimals,
          chainId
        )
        setBalanceErc20Fractions(erc20BalanceFractions)

        const erc20Balance = await getErc20Balance(
          peerToPeerTradeData?.erc20.paymentToken.id || '',
          peerToPeerTradeData?.erc20.paymentToken.decimals,
          chainId
        )
        setBalanceErc20(erc20Balance)
      }
    }

    account && peerToPeerTradeData?.erc20.id && getBalance()
  }, [
    account,
    chainId,
    peerToPeerTradeData?.erc20.id,
    peerToPeerTradeData?.erc20.decimals,
    peerToPeerTradeData?.erc20.paymentToken,
    peerToPeerTradeData?.erc20.paymentToken.decimals,
    transactionLoading
  ])

  useEffect(() => {
    const estimateOrderFee = async () => {
      const bookAmount = peerToPeerTradeData?.type === 'listings' ? amount : priceFraction

      try {
        if (!peerToPeerTradeData?.order?.id || !bookAmount) {
          return
        }

        const orderFeePercentage = await TheGraphPeerToPeerService(chainId).fee()

        setOrderFee(`${scale(new BigNumber(orderFeePercentage).multipliedBy(100), -18).toNumber().toLocaleString('en')}%`)
      } catch (err) {
        peerToPeerTradeData?.type === 'listings' ? setOrderFee('Invalid amount') : setOrderFee('Invalid price')
      }
    }

    estimateOrderFee()
  }, [amount, chainId, networkTokenSymbol, peerToPeerTradeData, priceFraction])

  return (
    <S.Modal centered visible={!!account && !!peerToPeerTradeData} onCancel={handleClose}>
      <S.Header>
        <h3>{`${peerToPeerTradeData?.type === 'listings' ? 'Buy Order Details' : 'Sell Order Details'}`}</h3>
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
          <div className={`${isInvalidAmount() ? 'error' : ''}`}>
            <span>
              <span>Amount</span>
              <small className={`${isInvalidAmount() ? 'error' : ''}`}>
                {`Balance: ${balanceErc20Fractions
                  ?.toNumber()
                  .toLocaleString('en', { maximumFractionDigits: peerToPeerTradeData?.erc20.decimals })}`}
              </small>
            </span>
            <div>
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
                  className='disabled'
                  disabled
                  addonBefore={erc20TokenAsset(token.imageUrl || token.id, token.symbol || networkTokenSymbol, 'jazzIcon')}
                  value={priceFraction}
                />
              )}
            </div>
          </div>
          <div>
            <span>
              <span>Total</span>
              <small className={`${isInvalidTotal() ? 'error' : ''}`}>
                {`Balance: ${balanceErc20
                  ?.toNumber()
                  .toLocaleString('en', { maximumFractionDigits: peerToPeerTradeData?.erc20.paymentToken.decimals })} ${
                  peerToPeerTradeData?.erc20.paymentToken.symbol || networkTokenSymbol
                }`}
              </small>
            </span>

            <div className={`${isInvalidTotal() ? 'error' : ''}`}>
              {token && (
                <S.Input
                  addonBefore={erc20TokenAsset(token.imageUrl || token.id, token.symbol || networkTokenSymbol, 'jazzIcon')}
                  onChange={event => handleInputChange('total', event.target.value)}
                  value={total}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <small>
            <span>Implied Valuation</span>
            <span>{`${impliedValue.toLocaleString('en', { maximumFractionDigits: 2 })} ${token?.symbol}`}</span>
          </small>
          <small>
            <span>Order Fee</span>
            <span>{orderFee}</span>
          </small>
        </div>
      </S.Content>
      <S.Footer>
        {!unlockedErc20 && peerToPeerTradeData?.type === 'offers' && peerToPeerTradeData?.erc20.id && (
          <Button disabled={!account} loading={loading} onClick={() => handleUnlockErc20(peerToPeerTradeData?.erc20.id || '')}>
            {`Unlock ${peerToPeerTradeData?.erc20.symbol}`}
          </Button>
        )}
        {!unlockedErc20PaymentToken && peerToPeerTradeData?.type === 'listings' && peerToPeerTradeData?.erc20.paymentToken && (
          <Button disabled={!account} loading={loading} onClick={() => handleUnlockErc20(peerToPeerTradeData?.erc20.paymentToken.id || '')}>
            {`Unlock ${peerToPeerTradeData?.erc20.paymentToken.symbol || networkTokenSymbol}`}
          </Button>
        )}
        {account && isUnlocked() && (
          <Button disabled={!canExecuteOrder()} loading={loading} onClick={handleExecuteOrder}>
            {`${peerToPeerTradeData?.type === 'listings' ? 'Buy' : 'Sell'}`}
          </Button>
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
    background: ${props=>props.theme.gray['0']};

    .ant-modal-body {
      background: ${props=>props.theme.gray['0']};
      padding: 0;
    }
    .ant-modal-content {
      background: ${props=>props.theme.gray['0']};
      margin: 0 auto;
      border-radius: 16px;
      max-width: 489px;
      width: 100%;
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

      &:nth-of-type(1) {
        display: flex;
        padding: 16px 24px;
        background-color: ${colorsV2.gray['0']};
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

      &:nth-of-type(2) {
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
        }
      }

      &:nth-of-type(3) {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 4px;

        > small {
          color: ${props=>props.theme.gray['4']};
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          display: flex;
          width: 100%;
          justify-content: space-between;

          &:nth-of-type(1) {
            border-bottom: 1px solid ${props=>props.theme.gray['1']};
            padding-bottom: 4px;
          }
        }
      }
    }
  `,
  Footer: styled.div`
    padding: 24px 32px 32px;
    > button {
      border-radius: 8px;
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      height: 40px;
      width: 100%;
      box-shadow: none;
      border: none;

      &:disabled {
        &:active,
        &:focus,
        &:hover {
          border-radius: 8px;
          background-color: ${colorsV2.blue.main};
          color: ${colorsV2.white};
          height: 40px;
          width: 100%;
          box-shadow: none;
          border: none;
          opacity: 0.25;
        }

        border-radius: 8px;
        background-color: ${colorsV2.blue.main};
        color: ${colorsV2.white};
        height: 40px;
        width: 100%;
        box-shadow: none;
        border: none;
        opacity: 0.25;
      }

      &:active,
      &:focus,
      &:hover {
        border-radius: 8px;
        background-color: ${colorsV2.blue.main};
        height: 40px;
        width: 100%;
        box-shadow: none;
        border: none;
        opacity: 0.65;

        > span {
          text-transform: capitalize;
          color: ${colorsV2.white};
          font-size: 16px;
          line-height: 20px;
        }
      }

      > span {
        text-transform: capitalize;
        color: ${colorsV2.white};
        font-size: 16px;
        line-height: 20px;
      }
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
      background-color: ${props=>props.theme.gray['0']};
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
      border-left: none;
      text-align: right;
      padding-right: 16px;
      height: 40px;

      &:disabled {
        border-radius: 8px;
        border: none;
        box-shadow: none;
        outline: none;
        background-color: ${props=>props.theme.gray['0']};
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
  `
}
