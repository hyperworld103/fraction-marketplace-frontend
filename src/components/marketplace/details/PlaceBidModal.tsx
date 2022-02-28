import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Form, Modal, Skeleton } from 'antd'
import BigNumber from 'bignumber.js'
import fromExponential from 'from-exponential'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import iconParticipation from '../../../assets/placeBid/iconParticipation.svg'
import { getChainConfigById } from '../../../config'
import { placeBidModalVar } from '../../../graphql/variables/PlaceBidVariables'
import { clearTransaction, transactionLoadingVar, transactionVar } from '../../../graphql/variables/TransactionVariable'
import { approveErc20, bid, isApprovedErc20 } from '../../../services/AuctionService'
import { zeroXQuoteService } from '../../../services/QuoteService'
import { units } from '../../../services/UtilService'
import { colorsV2, fonts, viewportV2 } from '../../../styles/variables'
import { MarketplaceERC20Item } from '../../../types/MarketplaceTypes'

type PlaceBidModalProps = {
  erc20: MarketplaceERC20Item
  firstBid: boolean
  participationInErc20: string
  erc20PaymentBalance: string
  exitPriceDollar: string
  account: string
  chainId: number
}
export const PlaceBidModal = ({
  firstBid,
  erc20,
  participationInErc20,
  erc20PaymentBalance,
  exitPriceDollar,
  account,
  chainId
}: PlaceBidModalProps) => {
  const [minValueBid, setMinValueBid] = useState<string>(`0`)
  const [bidAmount, setBidAmount] = useState<string>('')
  const [bidAmountDollar, setBidAmountDollar] = useState<string>('0')
  const [payAmount, setPayAmount] = useState<string>('')
  const [payAmountDollar, setPayAmountDollar] = useState<string>('0')
  const [isApproved, setIsApproved] = useState<boolean>(erc20.paymentToken.symbol === null)
  const [isValidBid, setIsValidBid] = useState<boolean>(false)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const transaction = useReactiveVar(transactionVar)
  const placeBidModal = useReactiveVar(placeBidModalVar)

  const { networkTokenSymbol } = getChainConfigById(chainId)

  const auctionDuration = (erc20.minimumDuration || 1) / (60 * 60 * 24)

  const approve = async () => {
    approveErc20(erc20.paymentToken.id, erc20.id, account, chainId)
  }

  const handleSubmit = async () => {
    if (erc20.paymentToken) {
      const value = fromExponential(
        new BigNumber(units(bidAmount, erc20.paymentToken.decimals)).dividedBy(units(erc20.totalSupply, erc20.decimals)).toString()
      )

      await bid(erc20.id, erc20.paymentToken?.decimals || 18, account, value, erc20.paymentToken.symbol === null, chainId)
    }
  }

  const handleClose = () => {
    placeBidModalVar(undefined)
  }

  const calculatePayAmount = useCallback(
    (amount: string) => {
      const participationAmount = new BigNumber(amount).multipliedBy(`0.${participationInErc20}`)

      return fromExponential(new BigNumber(amount).minus(participationAmount).toNumber().toString(10))
    },
    [participationInErc20]
  )

  const quoteToDollar = useCallback(
    async (erc20Address: string, erc20Amount: string, erc20Decimals: number): Promise<string> => {
      const quotation = await zeroXQuoteService().quoteToStablecoin(erc20Address, erc20Amount, erc20Decimals, chainId)

      return quotation.hasLiquidity ? quotation.priceDollar : '0'
    },
    [chainId]
  )

  const checkDollarQuotation = useCallback(
    async (amount: string, calculatedPayAmount: string) => {
      if (amount === '' || calculatedPayAmount === '') {
        setBidAmountDollar('0.00')
        setPayAmountDollar('0.00')
        return
      }

      setIsCalculating(true)
      if (amount.substr(-1) !== '.') {
        setBidAmountDollar(
          await quoteToDollar(erc20.paymentToken.id, units(amount, erc20.paymentToken.decimals), erc20.paymentToken.decimals)
        )
      }

      if (calculatedPayAmount.substr(-1) !== '.') {
        setPayAmountDollar(
          await quoteToDollar(erc20.paymentToken.id, units(calculatedPayAmount, erc20.paymentToken.decimals), erc20.paymentToken.decimals)
        )
      }

      setIsCalculating(false)
    },
    [erc20.paymentToken.decimals, erc20.paymentToken.id, quoteToDollar]
  )

  const getValueBid = async (e: ChangeEvent<HTMLInputElement>) => {
    let amount = e.target.value.replace(',', '.')

    if (!amount) {
      setBidAmount('')
      setAmountValuesAndCheckQuotation('')
    }

    if (amount.match(/^\d+([.]\d{0,18})?$/g)) {
      if (amount.substr(-1) === '.') {
        setBidAmount(amount)
        return
      }

      if (Number(amount) > Number(erc20PaymentBalance)) {
        amount = erc20PaymentBalance
      }
      setBidAmount(amount)
      setAmountValuesAndCheckQuotation(amount)
    }
  }

  const setAmountValuesAndCheckQuotation = useCallback(
    (amount: string) => {
      if (amount === '') {
        setPayAmount('')
        setIsValidBid(false)
        checkDollarQuotation('', '')
        return
      }

      const amountPerFractionMod = new BigNumber(units(amount, erc20.paymentToken.decimals)).mod(units(erc20.totalSupply, erc20.decimals))
      const calculatedPayAmount = calculatePayAmount(amount)
      if (amountPerFractionMod.isGreaterThan(0)) {
        setPayAmount(calculatedPayAmount)
        setIsValidBid(new BigNumber(amount).isGreaterThanOrEqualTo(new BigNumber(minValueBid)))
        checkDollarQuotation(amount, calculatedPayAmount)
        return
      }

      setPayAmount(calculatedPayAmount)
      setIsValidBid(new BigNumber(amount).isGreaterThanOrEqualTo(new BigNumber(minValueBid)))
      checkDollarQuotation(amount, calculatedPayAmount)
    },
    [calculatePayAmount, checkDollarQuotation, erc20.decimals, erc20.paymentToken.decimals, erc20.totalSupply, minValueBid]
  )

  useEffect(() => {
    if (erc20.bids && erc20.bids.length > 0) {
      const amount = new BigNumber(erc20.bids[0].reservePrice).multipliedBy(1.1).toString()
      setMinValueBid(amount)
      setBidAmount(amount)
      setAmountValuesAndCheckQuotation(amount)
    } else {
      setMinValueBid(erc20.exitPrice)
      setBidAmount(erc20.exitPrice)
      setAmountValuesAndCheckQuotation(erc20.exitPrice)
    }
  }, [erc20.bids, erc20.exitPrice, setAmountValuesAndCheckQuotation])

  useEffect(() => {
    const checkApproved = async () => {
      if (erc20.paymentToken.symbol === null) {
        return
      }

      const result = await isApprovedErc20(erc20.paymentToken.id, erc20.id, account, chainId)
      setIsApproved(result > 0)
    }
    if (!transactionLoading) {
      checkApproved()
    }
  }, [account, chainId, erc20.id, erc20.paymentToken.id, transactionLoading, erc20.paymentToken.symbol])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'bid' && transaction.confirmed) {
      handleClose()
      clearTransaction()
    }
  }, [transaction, transactionLoading])

  return (
    <S.Modal visible={!!placeBidModal} onCancel={handleClose} footer={null} destroyOnClose>
      <header>Place a Bid</header>
      <S.Content>
        <S.NftContent>
          <aside>
            <h3>
              {erc20.metadata?.name}
              <small>{erc20.symbol}</small>
            </h3>
            <div>
              <span>Reserve Price</span>
              <h2>
                {erc20.exitPrice}
                <small>{erc20.paymentToken.symbol || networkTokenSymbol}</small>
              </h2>
              <span>{`$${exitPriceDollar}`}</span>
            </div>
          </aside>
          <aside>
            <img src={erc20.metadata?.imageFull} alt={erc20.name} />
          </aside>
        </S.NftContent>
        {firstBid && (
          <p>
            {`Once you place your bid to meet the NFT reserve price, it will start a ${
              new BigNumber(auctionDuration).isGreaterThan(1) ? `${auctionDuration}-day` : `${auctionDuration * 24}-hour`
            } auction for this NFT.`}
          </p>
        )}
        <S.Form onFinish={handleSubmit}>
          <h1>Place a bid</h1>
          <span>
            You must bid at least:
            {` ${new BigNumber(minValueBid).toNumber().toLocaleString('en', { maximumFractionDigits: erc20.paymentToken.decimals })} ${
              erc20.paymentToken.symbol || networkTokenSymbol
            }`}
          </span>
          <S.FormControlValueBid>
            <span>Bid Value</span>
            <aside className={`${bidAmount && !isValidBid && !isCalculating ? 'error' : ''}`}>
              <div>
                <img src={iconParticipation} alt={erc20.paymentToken.symbol || networkTokenSymbol} />
                <span>{erc20.paymentToken.symbol || networkTokenSymbol}</span>
              </div>
              <input onChange={e => getValueBid(e)} value={bidAmount} type='text' />
            </aside>
            <section>
              <small className='error'>
                {bidAmount &&
                  !isValidBid &&
                  !isCalculating &&
                  `The bid must be of at least ${minValueBid} ${erc20.paymentToken.symbol || networkTokenSymbol}`}
              </small>
              {isCalculating && <Skeleton active paragraph={{ rows: 0, width: '150' }} />}
              {!isCalculating && <small>{`$${bidAmountDollar}`}</small>}
            </section>
          </S.FormControlValueBid>
          <S.FormControl>
            <span>Participation</span>
            <aside>
              <div>
                <img src={iconParticipation} alt={erc20.symbol} />
                <span>{erc20.symbol}</span>
              </div>
              <input type='number' value={participationInErc20} disabled />
            </aside>
            <small>{`${Number(participationInErc20).toLocaleString('en-us', { maximumFractionDigits: 2 }) || '0'}%`}</small>
          </S.FormControl>
          <S.FormControl>
            <section>
              <span>Pay Amount</span>
              <small>
                {`Balance: ${Number(erc20PaymentBalance).toLocaleString('en', { maximumFractionDigits: 8 })} ${
                  erc20.paymentToken.symbol || networkTokenSymbol
                }`}
              </small>
            </section>
            <aside>
              <div>
                {/* <img src={iconEth} alt='ETH' /> */}
                <img src={iconParticipation} alt={erc20.paymentToken.symbol || networkTokenSymbol} />
                <span>{erc20.paymentToken.symbol || networkTokenSymbol}</span>
              </div>
              <input
                type='text'
                value={Number(payAmount).toLocaleString('en', { maximumFractionDigits: erc20.paymentToken.decimals })}
                disabled
              />
            </aside>
            {isCalculating && <Skeleton active paragraph={{ rows: 0, width: '150' }} />}
            {!isCalculating && <small>{`$${payAmountDollar}`}</small>}
          </S.FormControl>
          <S.FormAction>
            {!isApproved && (
              <S.ButtonPlace loading={transactionLoading} onClick={approve}>
                Unlock
              </S.ButtonPlace>
            )}
            {isApproved && (
              <S.ButtonPlace loading={isCalculating || transactionLoading} disabled={!isValidBid} htmlType='submit'>
                Place a Bid
              </S.ButtonPlace>
            )}
            <a href='https://docs.nftfy.org/reserve-price-+-autcion/the-new-way-to-fractionalize-nfts' target='_blank' rel="noopener noreferrer">
              Learn how our auctions work
            </a>
          </S.FormAction>
        </S.Form>
      </S.Content>
    </S.Modal>
  )
}
const S = {
  Modal: styled(Modal)`
    width: 100%;
    max-width: 480px;
    box-sizing: border-box;
    border-radius: 8px;

    * {
      font-family: ${fonts.nunito};
    }
    .ant-modal-content {
      border-radius: 8px;
    }
    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-close {
      display: none;
    }

    .ant-skeleton-title {
      width: 40px !important;
      margin-top: 4px !important;
      margin-left: auto;
    }

    .ant-skeleton-paragraph {
      margin: 0 !important;
      margin-left: auto;
    }

    header {
      height: 66px;
      font-size: 24px;
      line-height: 33px;
      color: ${colorsV2.gray[4]};
      font-weight: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${colorsV2.gray[0]};
      border-radius: 8px 8px 0px 0px;
    }
    @media (min-width: ${viewportV2.mobile}) and (max-width: ${viewportV2.tablet}) {
      max-width: 360px;
    }
    @media (max-width: ${viewportV2.mobile}) {
      max-width: 320px;
    }
  `,
  Content: styled.main`
    padding: 26px 40px;

    p {
      margin: 26px 0;
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: ${colorsV2.gray[5]};
    }
  `,
  NftContent: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    aside {
      &:first-child {
        font-family: ${fonts.nunito};
        text-align: left;
        > h3 {
          font-size: 24px;
          font-weight: 600;
          line-height: 33px;
          color: ${colorsV2.black};
          margin-bottom: 10px;
          small {
            font-size: 12px;
            line-height: 16px;
            color: ${colorsV2.gray[3]};
            margin-left: 7px;
          }
        }
        div {
          span {
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            color: ${colorsV2.gray[3]};
          }
          h2 {
            font-weight: 600;
            font-size: 24px;
            line-height: 33px;
            color: ${colorsV2.black};
            small {
              font-size: 14px;
              line-height: 16px;
              margin-left: 5px;
            }
          }
        }
      }
      &:last-child {
        img {
          width: 104px;
          height: 104px;
          border-radius: 8px;
          -webkit-user-drag: none;
          object-fit: cover;
        }
      }
    }
  `,
  Form: styled(Form)`
    h1 {
      margin-top: 32px;
      font-weight: 600;
      font-size: 24px;
      line-height: 33px;
      color: ${colorsV2.black};
    }
    span {
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: ${colorsV2.black};
    }
  `,
  FormControlValueBid: styled.div`
    margin-top: 33px;

    .error {
      color: ${colorsV2.red.main};

      > div,
      > input {
        border-color: ${colorsV2.red.main};
      }
    }

    section {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    span {
      font-weight: normal;
      font-size: 18px;
      line-height: 25px;
      color: ${colorsV2.black};
    }

    aside {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      > div {
        width: 145px;
        height: 40px;
        padding: 9px 16px;
        box-sizing: border-box;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border: 1px solid ${colorsV2.gray[1]};
        border-right: 0px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;

        span {
          font-weight: normal;
          font-size: 14px;
          line-height: 19px;
          color: ${colorsV2.gray[4]};
        }

        img {
          width: 24px;
          height: 24px;
        }
      }
      input {
        width: 70%;
        height: 40px;
        border: 1px solid ${colorsV2.gray[1]};
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        padding-right: 16px;
        outline: none;
        text-align: right;
        font-size: 14px;
        line-height: 19px;
        color: ${colorsV2.gray[4]};
      }
    }
    small {
      margin-top: 4px;
      float: right;
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      color: ${colorsV2.gray[3]};
    }
  `,
  FormControl: styled.div`
    section {
      margin-top: 9px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      small {
        margin-top: 4px;
        float: right;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: ${colorsV2.gray[3]};
      }
    }
    span {
      font-weight: normal;
      font-size: 18px;
      line-height: 25px;
      color: ${colorsV2.black};
    }
    aside {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      > div {
        width: 145px;
        height: 40px;
        padding: 9px 16px;
        box-sizing: border-box;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border: 1px solid ${colorsV2.gray[1]};
        background-color: ${colorsV2.gray[0]};
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        img {
          width: 24px;
          height: 24px;
        }
        span {
          font-weight: normal;
          font-size: 14px;
          line-height: 19px;
          color: ${colorsV2.gray[4]};
        }
      }
      input {
        width: 70%;
        height: 40px;
        border: 1px solid ${colorsV2.gray[1]};
        background-color: ${colorsV2.gray[0]};
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border: none;
        padding-right: 16px;
        outline: none;
        text-align: right;
        font-size: 14px;
        line-height: 19px;
        color: ${colorsV2.gray[4]};
      }
    }
    small {
      margin-top: 4px;
      float: right;
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      color: ${colorsV2.gray[3]};
    }
  `,
  FormAction: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    a {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: ${colorsV2.blue.main};
      text-align: center;
      margin: 12px 0;
      transition: color 250ms ease-in;

      &:hover {
        color: ${colorsV2.blue.lighter};
      }
    }
  `,
  ButtonPlace: styled(Button)`
    margin-top: 26px;
    border: none;
    width: 100%;
    height: 40px;
    background-color: ${colorsV2.blue.main};
    border-radius: 8px;

    &:disabled {
      background-color: ${colorsV2.blue.lighter};
      span {
        color: ${colorsV2.white};
      }

      &:hover,
      &:focus,
      &:active {
        background-color: ${colorsV2.blue.lighter};
        span {
          color: ${colorsV2.white};
        }
      }
    }

    &:hover,
    &:focus,
    &:active {
      background-color: ${colorsV2.blue.dark};
      span {
        color: ${colorsV2.white};
      }
    }
    span {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: ${colorsV2.white};
    }
  `
}
