import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import BigNumber from 'bignumber.js'
import { now } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Web3 from 'web3'
import { getChainConfigById } from '../../../config'
import { metadataTabAuctionVar } from '../../../graphql/variables/AuctionVariables'
import { placeBidModalVar } from '../../../graphql/variables/PlaceBidVariables'
import { transactionLoadingVar, TransactionType, transactionVar } from '../../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../../graphql/variables/WalletVariable'
import { redeem } from '../../../services/AuctionService'
import { zeroXQuoteService } from '../../../services/QuoteService'
import { units } from '../../../services/UtilService'
import { colorsV2, viewportV2 } from '../../../styles/variables'
import { MarketplaceERC20Item, MarketplaceERC20ItemBid } from '../../../types/MarketplaceTypes'
import { CountdownDisplay } from '../../shared/CountdownDisplay'

type SetPriceProps = {
  erc20: MarketplaceERC20Item
}

export function Auction({ erc20 }: SetPriceProps) {
  const [priceDollar, setPriceDollar] = useState<string>('0')

  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)

  const history = useHistory()

  const { networkTokenSymbol } = getChainConfigById(chainId)

  useEffect(() => {
    const bidDollarQuotation = async () => {
      if (erc20.bids && erc20.bids.length > 0) {
        const value = await zeroXQuoteService().quoteToStablecoin(
          erc20.paymentToken.id,
          units(erc20.bids[0].reservePrice, erc20.paymentToken.decimals),
          erc20.paymentToken.decimals,
          chainId
        )
        setPriceDollar(Number(value.priceDollar.replaceAll(',', '')).toLocaleString('en'))
      }
    }
    bidDollarQuotation()
  }, [chainId, erc20.bids, erc20.paymentToken.decimals, erc20.paymentToken.id])

  const getMinimumBid = (bids: MarketplaceERC20ItemBid[] | undefined) => {
    if (bids && bids.length > 0) {
      const minimumBid = new BigNumber(bids[0].reservePrice).multipliedBy(1.1)
      return minimumBid
    }
    return 0
  }

  const sendRedeem = async () => {
    await redeem(Web3.utils.toChecksumAddress(erc20.id, chainId), account || '', chainId)
  }

  const goToTrade = () => {
    metadataTabAuctionVar('fraction')
    const detailsDivHeight = document.getElementById('details')?.scrollHeight || 0
    window.scrollTo(0, detailsDivHeight)
  }

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === TransactionType.redeem && transaction.confirmed) {
      history.push('/wallet/fractionalize')
    }
  }, [transaction, transactionLoading, history])

  return (
    <S.Container>
      <S.ContainerTime>
        <section>
          {erc20.cutoff && now() / 1000 > erc20.cutoff ? <h4>Sold for</h4> : <h4>Current Bid</h4>}
          <span>{`${erc20.bids?.length && erc20.bids[0].reservePrice} ${erc20.paymentToken.symbol || networkTokenSymbol}`}</span>
          <h3>{`$${priceDollar}`}</h3>
        </section>
        {erc20.cutoff && <CountdownDisplay cutoff={erc20.cutoff} />}
      </S.ContainerTime>

      {erc20.cutoff && now() / 1000 > erc20.cutoff ? (
        <>
          {erc20.bids && erc20.bids.length > 0 && erc20.bids[0].bidder === account ? (
            <>
              <h1 className='sold'>
                Congrats 🎉
                <br />
                You are the winner of this Auction and now you can redeem your NFT.
              </h1>
              <S.Button className='green' onClick={sendRedeem}>
                Redeem
              </S.Button>
            </>
          ) : (
            <section className='sold'>
              <h1>This NFT has been sold!</h1>
              <p>If you have any Fractions of it, please check your</p>
              <Link to='/wallet/portfolio'>Portfolio.</Link>
              <p>If you have any open order, please cancel it in the </p>
              <button type='button' onClick={() => goToTrade()}>
                Fraction Details.
              </button>
            </section>
          )}
        </>
      ) : (
        <>
          <section>
            <h1>
              You must bid at least:
              {` ${getMinimumBid(erc20.bids)} ${erc20.paymentToken.symbol || networkTokenSymbol}`}
            </h1>
            <a href='https://docs.nftfy.org/reserve-price-+-autcion/the-new-way-to-fractionalize-nfts' target='_blank' rel="noopener noreferrer">
              Learn how our auctions work.
            </a>
          </section>
          <S.Button onClick={() => placeBidModalVar(erc20)}>Place a bid</S.Button>
        </>
      )}
    </S.Container>
  )
}
const S = {
  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    h1 {
      &.sold {
        font-size: 32px;
        line-height: 44px;
        color: ${colorsV2.black};
      }
    }

    > section {
      display: flex;
      flex-direction: column;

      a {
        font-size: 14px;
        line-height: 19px;
        color: ${colorsV2.blue.main};
      }
      h1 {
        font-size: 18px;
        line-height: 25px;
        color: ${colorsV2.black};
        &.sold {
          font-size: 32px;
          line-height: 44px;
          color: ${colorsV2.black};
        }
      }
      h2 {
        font-size: 14px;
        line-height: 19px;
        color: ${colorsV2.blue.main};
      }
      &.sold {
        h1 {
          font-style: normal;
          font-weight: normal;
          font-size: 32px;
          line-height: 44px;
          color: ${colorsV2.black};
          margin-bottom: 18px;
        }
        p {
          font-size: 18px;
          line-height: 25px;
        }
        a {
          font-size: 18px;
          line-height: 25px;
          color: ${colorsV2.blue.main};
          text-decoration: underline;
          margin-bottom: 18px;
        }
        button {
          font-size: 18px;
          line-height: 25px;
          border: none;
          background: transparent;
          width: 135px;
          color: ${colorsV2.blue.main};
          padding: 0;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  `,
  ContainerTime: styled.div`
    background: #f6f6f6;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-wrap: wrap;

    @media (min-width: ${viewportV2.mobile}) and (max-width: ${viewportV2.tablet}) {
      gap: 18px;
      padding: 0px;
    }

    section {
      font-style: normal;
      font-weight: normal;
      h4 {
        font-size: 14px;
        line-height: 19px;
        color: ${colorsV2.gray[4]};
      }
      span {
        font-weight: 600;
        font-size: 40px;
        line-height: 55px;
        color: ${colorsV2.black};
      }
      h3 {
        font-size: 12px;
        line-height: 16px;
        color: ${colorsV2.gray[4]};
      }
    }

    > section:nth-child(2) {
      margin-left: auto;
      @media (min-width: ${viewportV2.mobile}) and (max-width: ${viewportV2.tablet}) {
        margin-left: 0;
      }
      > div {
        display: flex;
        gap: 24px;
      }
    }
  `,
  Button: styled(Button)`
    height: 48px;
    width: 100%;
    border-radius: 8px;
    outline: none;
    box-shadow: none;
    background-color: ${colorsV2.blue.main};
    color: ${colorsV2.white};
    border: none;

    &.green {
      background-color: ${colorsV2.green.main};
    }

    &:focus {
      outline: none;
      box-shadow: none;
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      border: none;
      &.green {
        background-color: ${colorsV2.green.main};
      }
    }
    &:disabled {
      &:active,
      &:focus,
      &:hover {
        box-shadow: none;
        border: none;
        color: ${colorsV2.white};
        border-radius: 8px;
        background-color: ${colorsV2.blue.main};
        opacity: 0.25;
        &.green {
          background-color: ${colorsV2.green.main};
        }
      }
      border-radius: 8px;
      background-color: ${colorsV2.blue.main};
      box-shadow: none;
      border: none;
      opacity: 0.25;
      color: ${colorsV2.white};
      &.green {
        background-color: ${colorsV2.green.main};
      }
    }
    &:active,
    &:hover {
      outline: none;
      box-shadow: none;
      border: none;
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      opacity: 0.65;
      &.green {
        background-color: ${colorsV2.green.main};
      }
    }
    > span {
      font-size: 18px;
      line-height: 25px;
      font-weight: 500;
    }
  `
}
