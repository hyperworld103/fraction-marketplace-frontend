import { useReactiveVar } from '@apollo/client'
import { Button, Tooltip } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import copyIcon from '../../../assets/icons/clip.svg'
import holdersLinkIcon from '../../../assets/icons/holders-link.svg'
import holdersIcon from '../../../assets/icons/holders.svg'
import impliedValuationIcon from '../../../assets/icons/implied-valuation.svg'
import emptyMessageIcon from '../../../assets/icons/invoice.svg'
import addToWalletIcon from '../../../assets/icons/metamask-icon.svg'
import nftPriceIcon from '../../../assets/icons/nft-price.svg'
import fractionReservePriceIcon from '../../../assets/icons/reserve-price.svg'
import supplyIcon from '../../../assets/icons/supply.svg'
import walletIcon from '../../../assets/icons/wallet-icon.svg'
import { getChainConfigById } from '../../../config'
import { chainConfig } from '../../../configV2'
import { buyModalLiquidityVar } from '../../../graphql/variables/MarketplaceVariable'
import { transactionLoadingVar } from '../../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../../graphql/variables/WalletVariable'
import { notifySuccess } from '../../../services/NotificationService'
import { PeerToPeerOrder, PeerToPeerTransaction, TheGraphPeerToPeerService } from '../../../services/PeerToPeerService'
import { coins, formatShortAddress, formatSymbol } from '../../../services/UtilService'
import { addErc20ToMetamask, getErc20Balance } from '../../../services/WalletService'
import { colorsV2, fonts, viewport, viewportV2 } from '../../../styles/variables'
import { MarketplaceERC20Item } from '../../../types/MarketplaceTypes'
import { peerToPeerTradeModalVar } from '../PeerToPeerTradeModal'
import { peerToPeerTradeModalSaveVar } from '../PeerToPeerTradeSaveModal'
import AddLiquidityModal, { LiquidityModalVar } from './AddLiquidityModal'

type TradeFractionsProps = {
  erc20: MarketplaceERC20Item
}

export function TradeFractions({ erc20 }: TradeFractionsProps) {
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const { address } = useParams<{ address: string | undefined }>()
  const [participation, setParticipation] = useState<BigNumber>(new BigNumber(0))
  const { etherscanAddress, networkTokenSymbol, ethAddress } = getChainConfigById(chainId)
  const config = chainConfig(chainId)
  const [erc20Balance, setErc20Balance] = useState<string | undefined>(undefined)
  const [fractionExitPrice, setFractionExitPrice] = useState('')
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const [priceDollarShare, setPriceDollarShares] = useState('')
  const [pricePaymentTokenShare, setPricePaymentTokenShare] = useState('')
  const [impliedValuation, setImpliedValuation] = useState<number | undefined>(0)
  const [sellOrders, setSellOrders] = useState<PeerToPeerOrder[]>([])
  const [transactions, setTransactions] = useState<PeerToPeerTransaction[]>([])
  const [buyOrders, setBuyOrders] = useState<PeerToPeerOrder[]>([])
  const [erc20PaymentBalance, setErc20PaymentBalance] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getShareBalance = async () => {
      if (erc20?.id) {
        const balance = await getErc20Balance(erc20?.id, erc20?.decimals, chainId)
        setErc20Balance(balance.toString())
        setParticipation(new BigNumber(balance).div(new BigNumber(erc20?.totalSupply)).multipliedBy(100))
      }
    }
    getShareBalance()
  }, [account, address, chainId, erc20?.id, erc20?.decimals, transactionLoading, erc20?.totalSupply])

  useEffect(() => {
    const checkLiquidity = async () => {
      setFractionExitPrice(
        (Number(erc20?.exitPrice) / Number(erc20?.totalSupply)).toLocaleString('en-us', {
          maximumFractionDigits: erc20?.paymentToken.decimals
        })
      )

      if (!erc20 || !erc20.liquidity) {
        return
      }

      const fractionPrice = await TheGraphPeerToPeerService(chainId).getTokensPairMarketPrice(
        erc20.id,
        erc20.paymentToken.id || '',
        erc20.paymentToken.decimals
      )

      setPriceDollarShares(Number(erc20.liquidity.priceDollar.replaceAll(',', '')).toLocaleString('en', { maximumFractionDigits: 6 }))
      buyModalLiquidityVar(erc20.liquidity.hasLiquidity)
      setPricePaymentTokenShare(fractionPrice || '')
      setImpliedValuation(new BigNumber(fractionPrice || '0').multipliedBy(erc20.totalSupply || '').toNumber())
    }
    checkLiquidity()
  }, [chainId, erc20, transactionLoading, networkTokenSymbol])

  useEffect(() => {
    const obtainOrders = async (bookToken: string, execToken: string) => {
      const obtainedMarket = await TheGraphPeerToPeerService(chainId).getMarket(bookToken, execToken)

      const obtainedBuyOrders = obtainedMarket.buyOrders
      const obtainedSellOrders = obtainedMarket.sellOrders

      setTransactions(obtainedMarket.transactions)
      setBuyOrders(obtainedBuyOrders)
      setSellOrders(obtainedSellOrders)
    }

    erc20 && erc20.paymentToken && obtainOrders(erc20.id, erc20.paymentToken.id)
  }, [chainId, erc20, transactionLoading])

  useEffect(() => {
    const getPaymentTokenBalance = async () => {
      if (erc20?.paymentToken?.id && erc20?.paymentToken?.decimals) {
        const balance = await getErc20Balance(erc20?.paymentToken.id, erc20?.paymentToken.decimals, chainId)
        setErc20PaymentBalance(balance.toString())
      }
    }
    getPaymentTokenBalance()
  }, [account, address, chainId, erc20?.paymentToken.id, erc20?.paymentToken.decimals, transactionLoading])
  const isOrderOwner = (orderOwnerAddress: string) => {
    return account && orderOwnerAddress === account
  }

  const copyAddress = () => {
    notifySuccess('Address copied!')
  }

  const updateOrder = (type: 'buy' | 'sell', order: PeerToPeerOrder) => {
    const peerToPeerOrder = {
      id: order.orderId,
      priceFraction: Number(order.price),
      amount: Number(order.bookAmount)
    }

    erc20 && peerToPeerTradeModalSaveVar({ type, erc20, order: peerToPeerOrder })
  }

  const tradeOrder = (type: 'listings' | 'offers', order: PeerToPeerOrder) => {
    const peerToPeerOrder = {
      id: order.orderId,
      priceFraction: Number(order.price),
      amount: Number(order.bookAmount),
      total: Number(order.execAmount)
    }

    erc20 && peerToPeerTradeModalVar({ type, erc20, order: peerToPeerOrder })
  }

  const createOrder = (type: 'buy' | 'sell') => {
    if (erc20) {
      const erc20Item = erc20?.paymentToken.id === null ? { ...erc20, paymentToken: { ...erc20.paymentToken, id: ethAddress } } : erc20
      peerToPeerTradeModalSaveVar({ type, erc20: erc20Item })
    }
  }

  const formatAddress = (addressToFormat: string) => {
    return addressToFormat.length > 15 ? `${addressToFormat.substr(0, 9)}...${addressToFormat.substr(-6)}` : addressToFormat
  }

  return (
    <S.SectionTrade>
      <article>
        <S.ItemDetailsInfo>
          <h3>
            <span>{erc20?.name}</span>
            <small>{erc20?.symbol}</small>
          </h3>
          <div>
            {erc20?.id && (
              <span>
                <S.CopyToClipboard onCopy={copyAddress} text={erc20?.id}>
                  <Tooltip placement='bottom' title='Click to copy ERC20 address'>
                    <small>{formatShortAddress(erc20?.id)}</small>

                    <img src={copyIcon} alt='Copy ERC20 address' />
                  </Tooltip>
                </S.CopyToClipboard>
                <button type='button' onClick={() => addErc20ToMetamask(erc20?.id, erc20?.decimals, erc20?.symbol, '', chainId)}>
                  <Tooltip placement='bottom' title='Add to wallet'>
                    <img src={addToWalletIcon} alt='Add to wallet' />
                  </Tooltip>
                </button>
              </span>
            )}
          </div>
        </S.ItemDetailsInfo>
        <div className='swap'>
          <S.AMMContent>
            <h1>AMM Place</h1>
            <div>
              <S.SuccessButton target='_blank' href={`https://app.1inch.io/#/1/swap/${config?.networkTokenSymbol}/${erc20.id}/`}>
                Swap
              </S.SuccessButton>
              <S.DefaultButton onClick={() => LiquidityModalVar(true)}>Add Liquidity</S.DefaultButton>
            </div>
          </S.AMMContent>
          <S.WalletBalance>
            <img src={walletIcon} alt='Wallet balance' />
            <div>
              <h5>Balance</h5>
              <span>
                <small>{erc20?.symbol}</small>

                {erc20?.decimals && (
                  <span>
                    {Number(erc20Balance || coins('0', erc20?.decimals)).toLocaleString('en', {
                      maximumFractionDigits: erc20.decimals
                    })}
                  </span>
                )}
              </span>
            </div>
            <div>
              <h5>Participation</h5>
              <span>
                {erc20Balance &&
                  erc20?.totalSupply &&
                  `${participation.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 }) || '0'}%`}

                {(!erc20Balance || !erc20?.totalSupply) && `0%`}
              </span>
            </div>
          </S.WalletBalance>
        </div>
      </article>
      <article>
        <S.Info>
          <div>
            <small>Fraction Price</small>
            {erc20?.decimals && (
              <h4>
                <span>{pricePaymentTokenShare || coins('0', erc20?.decimals)}</span>
                <small>{erc20.paymentToken?.symbol || networkTokenSymbol}</small>
              </h4>
            )}
            <small>{`$${priceDollarShare || '0.00'}`}</small>
            {!priceDollarShare && participation.toNumber() < 99.9 && <Button onClick={() => createOrder('buy')}>Place first bid</Button>}
            {!priceDollarShare && participation.toNumber() > 99.9 && <Button onClick={() => createOrder('sell')}>Place first offer</Button>}
          </div>
          <div>
            <img src={impliedValuationIcon} alt='test' />
            <span>
              <span>Implied Valuation</span>
              <strong>
                {`${impliedValuation?.toLocaleString('en', { maximumFractionDigits: erc20.paymentToken.decimals }) || 0} ${
                  erc20.paymentToken.symbol || networkTokenSymbol
                }`}
              </strong>
            </span>
          </div>
          <div>
            <img src={supplyIcon} alt='test' />
            <span>
              <span>Supply</span>
              <strong>{`${Number(erc20?.totalSupply).toLocaleString('en', { maximumFractionDigits: 2 })}`}</strong>
            </span>
          </div>
          <div>
            <img src={nftPriceIcon} alt='test' />
            <span>
              <span>NFT Price</span>
              <strong>
                {`${new BigNumber(erc20?.exitPrice)
                  .toNumber()
                  .toLocaleString('en', { maximumFractionDigits: erc20.paymentToken.decimals })} ${
                  erc20?.paymentToken.symbol || networkTokenSymbol
                }`}
              </strong>
            </span>
          </div>
          <div>
            <img src={fractionReservePriceIcon} alt='test' />
            <span>
              <span>Fraction Reserve Price</span>
              <strong>{`${fractionExitPrice} ${erc20?.paymentToken.symbol || networkTokenSymbol}`}</strong>
            </span>
          </div>
          <div>
            <img src={holdersIcon} alt='test' />
            <span>
              <span>Holders</span>
              <a rel="noopener noreferrer" target='_blank' href={`${etherscanAddress}/address/${erc20.id}`}>
                <span>{`${Number(erc20?.holdersCount).toLocaleString('en')}`}</span>
                <img src={holdersLinkIcon} alt='Open link icon' />
              </a>
            </span>
          </div>
        </S.Info>
      </article>
      <article>
        <S.OrdersList>
          <div>
            <h3>Sell Orders</h3>
            <S.PrimaryButton disabled={!account || !erc20Balance || erc20Balance === '0'} onClick={() => createOrder('sell')}>
              Sell Fractions
            </S.PrimaryButton>
          </div>
          <S.OrdersTable className={`${sellOrders.length > 3 ? 'scrollable-y' : ''}`}>
            <thead>
              <tr>
                <th>Price</th>
                <th>Amount</th>
                <th>Total</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {sellOrders.map(order => (
                <tr key={order.orderId}>
                  <td>{`${order.price} ${erc20?.paymentToken.symbol || networkTokenSymbol}`}</td>
                  <td>{`${order.bookAmount} ${formatSymbol(erc20?.symbol || '')}`}</td>
                  <td>{`${order.execAmount} ${formatSymbol(erc20?.paymentToken.symbol || networkTokenSymbol)}`}</td>
                  <td>
                    {isOrderOwner(order.owner) ? (
                      <S.PrimaryButton disabled={!account} onClick={() => updateOrder('sell', order)}>
                        Update
                      </S.PrimaryButton>
                    ) : (
                      <S.DefaultButton
                        disabled={!account || !erc20PaymentBalance || erc20PaymentBalance === '0'}
                        onClick={() => tradeOrder('listings', order)}>
                        Buy
                      </S.DefaultButton>
                    )}
                  </td>
                </tr>
              ))}
              {sellOrders.length === 0 && (
                <tr>
                  <td className='empty'>
                    <S.EmptyMessage>
                      <img src={emptyMessageIcon} alt='No Sell Orders available.' />
                      <span>No Sell Orders available.</span>
                    </S.EmptyMessage>
                  </td>
                </tr>
              )}
            </tbody>
          </S.OrdersTable>
        </S.OrdersList>
        <S.OrdersList>
          <div>
            <h3>Buy Orders</h3>
            <S.PrimaryButton disabled={!account || !erc20PaymentBalance || erc20PaymentBalance === '0'} onClick={() => createOrder('buy')}>
              Buy Fractions
            </S.PrimaryButton>
          </div>
          <S.OrdersTable className={`${buyOrders.length > 3 ? 'scrollable-y' : ''}`}>
            <thead>
              <tr>
                <th>Price</th>
                <th>Amount</th>
                <th>Total</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {buyOrders.map(order => (
                <tr key={order.orderId}>
                  <td>{`${order.price} ${erc20?.paymentToken.symbol || networkTokenSymbol}`}</td>
                  <td>{`${order.bookAmount} ${formatSymbol(erc20?.symbol || '')}`}</td>
                  <td>{`${order.execAmount} ${formatSymbol(erc20?.paymentToken.symbol || networkTokenSymbol)}`}</td>
                  <td>
                    {isOrderOwner(order.owner) ? (
                      <S.PrimaryButton disabled={!account} onClick={() => updateOrder('buy', order)}>
                        Update
                      </S.PrimaryButton>
                    ) : (
                      <S.DefaultButton
                        disabled={!account || !erc20Balance || erc20Balance === '0'}
                        onClick={() => tradeOrder('offers', order)}>
                        Sell
                      </S.DefaultButton>
                    )}
                  </td>
                </tr>
              ))}
              {buyOrders.length === 0 && (
                <tr>
                  <td className='empty'>
                    <S.EmptyMessage>
                      <img src={emptyMessageIcon} alt='No Buy Orders available.' />
                      <span>No Buy Orders available.</span>
                    </S.EmptyMessage>
                  </td>
                </tr>
              )}
            </tbody>
          </S.OrdersTable>
        </S.OrdersList>
      </article>
      <article>
        <h3>Trading History</h3>
        <S.OrdersList>
          <S.TransactionsTable className={`${transactions.length > 3 ? 'scrollable-y' : ''}`}>
            <thead>
              <tr>
                <th className='desktop'>Tx Hash</th>
                <th className='desktop'>Age</th>
                <th className='desktop'>Address</th>
                <th className='desktop'>For</th>
                <th className='desktop'>Tx Fee</th>
                <th className='mobile'>Tx Hash/Age</th>
                <th className='mobile'>Address/For</th>
                <th className='mobile'>Tx Fee</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td className='empty'>
                    <S.EmptyMessage>
                      <img src={emptyMessageIcon} alt='No transactions available.' />
                      <span>No transactions available.</span>
                    </S.EmptyMessage>
                  </td>
                </tr>
              )}
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className='desktop'>{formatAddress(transaction.orderId)}</td>
                  <td className='desktop'>{transaction.age}</td>
                  <td className='desktop'>{formatAddress(transaction.taker)}</td>
                  <td className='desktop'>
                    {`${transaction.quoteAmount} 
                          ${
                            transaction.side === 'BUY'
                              ? formatSymbol(erc20?.paymentToken.symbol || networkTokenSymbol)
                              : formatSymbol(erc20?.symbol || '')
                          }`}
                  </td>
                  <td className='desktop'>
                    {`${transaction.baseFeeAmount === null ? transaction.quoteFeeAmount : transaction.baseFeeAmount} ${
                      transaction.side === 'BUY'
                        ? formatSymbol(erc20?.symbol || '')
                        : formatSymbol(erc20?.paymentToken.symbol || networkTokenSymbol)
                    }`}
                  </td>
                  <td className='mobile'>
                    <span>{formatAddress(transaction.orderId)}</span>
                    <br />
                    <span>{transaction.age}</span>
                  </td>
                  <td className='mobile'>
                    <span>{formatAddress(transaction.taker)}</span>
                    <br />
                    <span>{`${transaction.quoteAmount} ${erc20?.paymentToken.symbol || networkTokenSymbol}`}</span>
                  </td>
                  <td className='mobile'>
                    {`${transaction.baseFeeAmount === null ? transaction.quoteFeeAmount : transaction.baseFeeAmount} ${
                      transaction.side === 'BUY'
                        ? formatSymbol(erc20?.symbol || '')
                        : formatSymbol(erc20?.paymentToken.symbol || networkTokenSymbol)
                    }`}
                  </td>
                </tr>
              ))}
            </tbody>
          </S.TransactionsTable>
        </S.OrdersList>
      </article>
      <AddLiquidityModal address={erc20?.id} addressTokenSymbol={config?.networkTokenSymbol} chainId={chainId} />
    </S.SectionTrade>
  )
}
const S = {
  SectionTrade: styled.section`
    display: flex;
    width: 100%;
    flex-direction: column;
    > article {
      &:nth-child(1) {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 48px;
        .swap {
          width: auto;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        @media (max-width: ${viewport.md}) {
          justify-content: center;
          flex-direction: column;
          gap: 32px;
          .swap {
            flex-direction: column;
            justify-content: center;
          }
        }
      }
      &:nth-child(2) {
        display: grid;
        margin-bottom: 24px;
      }
      &:nth-child(3) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        margin-bottom: 32px;
        @media (max-width: ${viewport.md}) {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      }
      &:nth-child(4) {
        > h3 {
          margin-bottom: 6px;
          color: ${colorsV2.black};
          font-size: 20px;
          font-weight: 500;
          line-height: 26px;
          @media (max-width: ${viewport.md}) {
            margin-bottom: 12px;
          }
        }
      }
    }
  `,
  AMMContent: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.gray[0]};
    padding: 16px;
    border-radius: 8px;
    justify-content: flex-start;
    margin-right: 16px;
    h1 {
      width: 100px;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: ${props => props.theme.black};
      margin-right: 35px;
    }
    div {
      display: flex;
      flex-direction: row;
      button:nth-child(2) {
        width: 124px;
        height: 40px;
        margin-left: 16px;
      }
    }
    @media (max-width: ${props => props.theme.viewport.tablet}) {
      width: 100%;
      max-width: 320px;
      flex-direction: column;
      justify-content: center;
      margin-right: 0px;
      margin-bottom: 16px;
      h1 {
        margin-right: 0px;
        margin-bottom: 16px;
      }
      div {
        justify-content: center;
        align-items: center;
        button,
        a {
          max-width: 100px;
          margin-left: 0px;
          height: 32px !important;
          span {
            font-size: 12px !important;
          }
        }
      }
    }
  `,
  ItemDetailsInfo: styled.div`
    > h3 {
      color: ${colorsV2.gray['4']};
      font-size: 32px;
      line-height: 42px;
      font-weight: 500;
      > small {
        margin-left: 10px;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: ${colorsV2.gray['3']};
      }
    }
    > div {
      > span {
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${colorsV2.gray['3']};
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        button {
          text-decoration: none;
          color: ${colorsV2.gray['3']};
          background: none;
          border: none;
          outline: none;
          cursor: pointer;
          height: 16px;
          width: 16px;
          > img {
            height: 16px;
            width: 16px;
          }
        }
      }
    }
  `,
  WalletBalance: styled.div`
    background-color: ${colorsV2.gray['0']};
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 320px;

    > img {
      height: 32px;
      width: 32px;
    }

    > div {
      > h5 {
        color: ${colorsV2.gray['3']};
        font-size: 12px;
        line-height: 18px;
        font-weight: 400;
      }
      > span {
        color: ${colorsV2.gray['4']};
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        > small {
          font-size: 10px;
          line-height: 13px;
          margin-right: 4px;
        }
      }
      &:nth-of-type(1) {
        margin-left: 24px;
      }
      &:nth-of-type(2) {
        margin-left: 48px;
      }
    }
  `,
  Info: styled.div`
    background-color: ${colorsV2.gray['0']};
    border: 1px solid ${colorsV2.gray['1']};
    border-radius: 8px;
    padding: 28px 24px;
    display: flex;
    gap: 18px;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;

    @media (max-width: ${viewportV2.tablet}) {
      flex-direction: column;
      align-items: flex-start;
    }

    > div {
      display: flex;

      &:first-child {
        flex-direction: column;
        margin-right: 24px;

        > small {
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          color: ${colorsV2.gray['4']};
        }

        > button {
          border: none;
          background-color: transparent;
          padding: 0;
          cursor: pointer;
          height: fit-content;
          width: fit-content;

          > span {
            color: ${colorsV2.blue.main};
            transition: color 250ms ease-in;
            font-size: 16px;
            line-height: 20px;
            font-weight: 400;

            &:focus {
              color: ${colorsV2.blue.main};
            }

            &:hover,
            &:active {
              color: ${colorsV2.blue.lighter};
            }
          }
        }

        > h4 {
          font-size: 24px;
          line-height: 32px;
          font-weight: 600;
          color: ${colorsV2.black};

          > small {
            margin-left: 6px;
            font-size: 14px;
          }
        }
      }

      &:not(:first-child) {
        gap: 10px;
        border-left: 1px solid ${colorsV2.gray['2']};
        padding-left: 18px;
        align-items: center;

        @media (max-width: ${viewportV2.tablet}) {
          border-left: none;
          padding: 0;
        }

        > img {
          width: 20px;
          height: 20px;
        }

        > span {
          font-size: 14px;
          line-height: 20px;
          color: ${colorsV2.black};
          display: flex;
          flex-direction: column;
          height: 38px;

          > strong {
            font-weight: 600;
          }

          > a {
            color: ${colorsV2.blue.main};
            font-weight: 600;
            display: flex;
            align-items: center;

            > img {
              width: 14px;
              height: 14px;
              margin-left: 4px;
              margin-bottom: 3px;
            }

            &:focus {
              color: ${colorsV2.blue.main};
            }

            &:visited {
              color: ${colorsV2.blue.dark};
            }

            &:hover,
            &:active {
              color: ${colorsV2.blue.light};
            }
          }
        }
      }
    }
  `,
  FractionPrice: styled.div`
    background-color: ${colorsV2.gray['0']};
    border-radius: 8px;
    padding: 32px 24px;
    color: ${colorsV2.gray['4']};
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    > h4 {
      color: ${colorsV2.black};
      font-size: 32px;
      line-height: 42px;
      font-weight: 500;
    }
    > button {
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      padding: 0;
      &:focus {
        border: none;
        background: none;
        > span {
          color: ${colorsV2.blue.light};
          font-size: 16px;
          line-height: 20px;
          font-weight: 400;
        }
      }
      &:hover,
      &:active {
        border: none;
        background: none;
        > span {
          color: ${colorsV2.blue.lighter};
          font-size: 16px;
          line-height: 20px;
          font-weight: 400;
        }
      }
      > span {
        color: ${colorsV2.blue.light};
        font-size: 16px;
        line-height: 20px;
        font-weight: 400;
      }
    }
  `,
  OrdersList: styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 16px 20px;
    border: 1px solid ${colorsV2.gray['1']};
    border-radius: 8px;
    @media (max-width: ${viewport.sm}) {
      padding: 16px;
    }
    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-bottom: 18px;
      @media (max-width: ${viewport.sm}) {
        flex-direction: column;
        gap: 12px;
      }
      > h3 {
        font-size: 20px;
        line-height: 26px;
        font-weight: 500;
      }
      > button {
        width: 192px;
        height: 32px;
        @media (max-width: ${viewport.sm}) {
          width: 100%;
        }
        > span {
          font-size: 14px;
          line-height: 18px;
          font-weight: 400;
        }
      }
    }
  `,
  OrdersTable: styled.table`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    &.scrollable-y {
      > tbody {
        overflow-y: scroll;
        height: 238px;
        > tr {
          > td {
            &:last-child {
              text-align: center;
            }
          }
        }
      }
    }
    > thead {
      display: flex;
      > tr {
        display: flex;
        width: 100%;
        > th {
          font-size: 12px;
          line-height: 16px;
          color: ${colorsV2.gray['3']};
          font-weight: 400;
          width: 25%;
        }
      }
    }
    > tbody {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      > tr {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        @media (max-width: ${viewport.sm}) {
          gap: 8px;
        }
        > td {
          color: ${colorsV2.black};
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          padding: 20px 0;
          border-top: 1px solid ${colorsV2.gray['1']};
          border-bottom: 1px solid ${colorsV2.gray['1']};
          width: 25%;
          word-break: break-all;
          @media (max-width: ${viewport.sm}) {
            font-size: 12px;
          }
          &.empty {
            width: 100%;
            height: 100%;
            border-bottom: none;
            padding: 34px 0 18px 0;
            text-align: center;
          }
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
            > button {
              width: 96px;
              height: 32px;
              > span {
                font-size: 14px;
                line-height: 18px;
                font-weight: 400;
              }
              @media (max-width: ${viewport.sm}) {
                width: 100%;
                height: 24px;
                > span {
                  font-size: 10px !important;
                  line-height: 13px !important;
                }
              }
            }
          }
        }
      }
    }
  `,
  TransactionsTable: styled.table`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    &.scrollable-y {
      > thead {
        > tr {
          > th {
            &:last-child {
              text-align: center;
            }
          }
        }
      }
      > tbody {
        overflow-y: scroll;
        height: 238px;
        > tr {
          > td {
            &:last-child {
              text-align: center;
            }
          }
        }
      }
    }
    > thead {
      display: flex;
      > tr {
        display: flex;
        width: 100%;
        gap: 8px;
        > th {
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
          }
          font-size: 12px;
          line-height: 16px;
          color: ${colorsV2.gray['3']};
          font-weight: 400;
          &.desktop {
            display: block;
            width: 25%;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            &:not(:nth-child(2)) {
              width: 40%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
          @media (max-width: ${viewport.sm}) {
            font-size: 10px;
            line-height: 13px;
          }
          &.desktop {
            display: block;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
        }
      }
    }
    > tbody {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      > tr {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        > td {
          color: ${colorsV2.black};
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          padding: 20px 0;
          word-break: break-all;
          @media (max-width: ${viewport.sm}) {
            font-size: 10px;
            line-height: 13px;
          }
          &.desktop {
            display: block;
            width: 25%;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            &:not(:nth-child(2)) {
              width: 40%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
          &.empty {
            width: 100%;
            height: 100%;
            border-bottom: none;
            padding: 34px 0 18px 0;
          }
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
          }
        }
      }
    }
  `,
  CopyToClipboard: styled(CopyToClipboard)`
    font-size: 12px;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 500;
    display: flex;
    align-items: center;
    cursor: pointer;
    h6 {
      color: ${colorsV2.gray['3']};
      font-size: 14px;
      line-height: 18px;
    }
    img {
      margin-left: 8px;
      width: 12px;
      height: 12px;
    }
    &:hover {
      opacity: 0.8;
    }
    @media (max-width: ${viewport.sm}) {
      h6 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `,
  EmptyMessage: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${colorsV2.gray['2']};
    > img {
      width: 32px;
      height: 32px;
    }
  `,
  PrimaryButton: styled(Button)`
    border-radius: 8px;
    background-color: ${colorsV2.blue.main};
    color: ${colorsV2.white};
    outline: none;
    box-shadow: none;
    border: none;
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
  DefaultButton: styled(Button)`
    border-radius: 8px;
    background-color: ${colorsV2.white};
    color: ${colorsV2.gray['3']};
    outline: none;
    box-shadow: none;
    border: 1px solid ${colorsV2.gray['1']};
    &:focus {
      background-color: ${colorsV2.white};
      color: ${colorsV2.gray['3']};
      outline: none;
      box-shadow: none;
      border: 1px solid ${colorsV2.gray['1']};
    }
    &:disabled {
      &:active,
      &:focus,
      &:hover {
        background-color: ${colorsV2.white};
        color: ${colorsV2.gray['3']};
        outline: none;
        box-shadow: none;
        border: 1px solid ${colorsV2.gray['1']};
        opacity: 0.65;
      }
      background-color: ${colorsV2.white};
      color: ${colorsV2.gray['3']};
      outline: none;
      box-shadow: none;
      border: 1px solid ${colorsV2.gray['1']};
      opacity: 0.65;
    }
    &:active,
    &:hover {
      background-color: ${colorsV2.white};
      color: ${colorsV2.gray['3']};
      outline: none;
      box-shadow: none;
      border: 1px solid ${colorsV2.gray['1']};
      opacity: 0.45;
    }
    > span {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
    }
  `,
  SuccessButton: styled(Button)`
    width: 124px;
    height: 40px;
    background: ${props => props.theme.green.main};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-radius: 8px;
    border: none;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    color: ${props => props.theme.white};

    &:hover,
    &:focus,
    &:active {
      background: ${props => props.theme.green.light};
      color: ${props => props.theme.white};
    }
  `
}
