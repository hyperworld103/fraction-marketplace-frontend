import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'
import external from '../../../assets/icons/external-link-blue.svg'
import { getChainConfigById } from '../../../config'
import { metadataTabAuctionVar } from '../../../graphql/variables/AuctionVariables'
import { chainIdVar } from '../../../graphql/variables/WalletVariable'
import { zeroXQuoteService } from '../../../services/QuoteService'
import { formatShortAddress, units } from '../../../services/UtilService'
import { colorsV2, viewportV2 } from '../../../styles/variables'
import { MarketplaceERC20Item } from '../../../types/MarketplaceTypes'
import { TradeFractions } from './TradeFractions'

type AuctionDetailProps = {
  erc20: MarketplaceERC20Item
}

export function AuctionDetail({ erc20 }: AuctionDetailProps) {
  const [priceDollar, setPriceDollar] = useState<string>('0')
  const chainId = useReactiveVar(chainIdVar)
  const metadataTabAuction = useReactiveVar(metadataTabAuctionVar)
  const { etherscanAddress, networkTokenSymbol } = getChainConfigById(chainId)
  const [metadataTab, setMetadataTab] = useState<'details' | 'fraction'>(metadataTabAuction)
  useEffect(() => {
    setMetadataTab(metadataTabAuction)
  }, [metadataTabAuction])

  useEffect(() => {
    const bidDollarQuotation = async () => {
      if (erc20.bids && erc20.bids.length > 0) {
        const value = await zeroXQuoteService().quoteToStablecoin(
          erc20.paymentToken.id,
          units(erc20.bids[0].reservePrice, erc20.paymentToken.decimals),
          erc20.paymentToken.decimals,
          chainId
        )
        setPriceDollar(value.priceDollar)
      }
    }
    bidDollarQuotation()
  }, [chainId, erc20.bids, erc20.paymentToken.decimals, erc20.paymentToken.id])

  const formatDate = (date: number) => {
    return moment.unix(date).format('lll').toString()
  }

  return (
    <S.Container>
      <nav>
        <S.Button
          className={`${metadataTab === 'details' ? 'active' : ''}`}
          onClick={() => {
            metadataTabAuctionVar('details')
          }}>
          NFT Details
        </S.Button>
        <S.Button
          className={`${metadataTab === 'fraction' ? 'active' : ''}`}
          onClick={() => {
            metadataTabAuctionVar('fraction')
          }}>
          Fraction Details
        </S.Button>
      </nav>
      {metadataTab === 'details' && (
        <div>
          <section>
            <h1>Description</h1>

            <S.ContainerCreator>
              <Jazzicon diameter={32} seed={jsNumberForAddress(erc20?.id)} />
              <div>
                <h2>Creator</h2>
                <span>{erc20?.metadata?.author || '-'}</span>
              </div>
            </S.ContainerCreator>

            <h2>{`Edition: 1/${erc20?.metadata?.totalSupply || 1}`}</h2>

            <S.ContainerInfos>
              <span>{`Token ID: ${erc20.target.tokenId}`}</span>
              <a rel="noopener noreferrer" target='_blank' href={`https://opensea.io/assets/${erc20.target.collection.id}/${erc20.target.tokenId}`}>
                <span>View on open sea</span>
                <img src={external} alt='redirect' />
              </a>
              <a rel="noopener noreferrer" target='_blank' href={`${etherscanAddress}/address/${erc20.target.collection.id}`}>
                <span>View on etherscan</span>
                <img src={external} alt='redirect' />
              </a>
            </S.ContainerInfos>
            <p>{erc20.metadata?.description}</p>
          </section>
          <section>
            <h1>Activity</h1>
            <div>
              {erc20.bids?.map(bid => (
                <article key={bid.id}>
                  <div>
                    <Jazzicon diameter={32} seed={jsNumberForAddress(erc20?.id)} />
                    <div>
                      <h2>{`Bid by: ${formatShortAddress(bid.bidder)}`}</h2>
                      <span>{formatDate(bid.timestamp)}</span>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2>{`${bid.reservePrice} ${erc20.paymentToken.symbol || networkTokenSymbol}`}</h2>
                      <span>{`$${priceDollar}`}</span>
                    </div>
                    <a rel="noopener noreferrer" target='_blank' href={`${etherscanAddress}/tx/${bid.txId}`}>
                      <img src={external} alt='redirect' />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
      {metadataTab === 'fraction' && <TradeFractions erc20={erc20} />}
    </S.Container>
  )
}
const S = {
  Container: styled.div`
    margin: 32px 0;
    padding: 0px 64px;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: ${viewportV2.desktopXl};
    gap: 63px;
    @media (max-width: ${props => props.theme.viewport.tablet}) {
      padding: 0px ${props => props.theme.margin.small};
    }

    nav {
      display: flex;
      gap: 20px;
      @media (max-width: ${viewportV2.tablet}) {
        justify-content: center;
      }
    }

    > div {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      @media (max-width: ${viewportV2.tablet}) {
        grid-template-columns: 1fr;
        max-width: 80%;
        margin: 0 auto;
        gap: 32px;
      }

      > section {
        width: 100%;
        h1 {
          font-style: normal;
          font-weight: normal;
          font-size: 32px;
          line-height: 44px;
          color: ${colorsV2.black};
          margin-bottom: 28px;
        }
      }

      > section:first-child {
        display: flex;
        flex-direction: column;

        > h2 {
          font-weight: 600;
          font-size: 20px;
          line-height: 27px;
          color: ${colorsV2.black};
          margin-bottom: 24px;
        }

        p {
          margin: 0;
          font-size: 12px;
          white-space: break-spaces;
          word-break: break-word;
        }
      }
      > section:last-child {
        > div {
          display: flex;
          flex-direction: column;
          gap: 8px;
          article {
            width: 100%;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            @media (min-width: ${viewportV2.base}) and (max-width: ${viewportV2.tablet}) {
              flex-direction: column;
              gap: 16px;
            }

            border: 1px solid ${colorsV2.gray['1']};
            box-sizing: border-box;
            border-radius: 8px;

            > div {
              display: flex;
              align-items: center;
              gap: 14px;

              h2 {
                font-style: normal;
                font-weight: 600;
                font-size: 20px;
                line-height: 27px;
                color: ${colorsV2.black};
              }
              span {
                font-style: normal;
                font-weight: 600;
                font-size: 14px;
                line-height: 19px;
                color: ${colorsV2.gray[3]};
              }
              > div {
                display: flex;
                flex-direction: column;
              }
            }

            > div:first-child {
              > div {
                align-items: baseline;
              }
            }
            > div:last-child {
              img {
                width: 20px;
                height: 20px;
              }
              > div {
                align-items: flex-end;
              }
            }
          }
        }
      }
    }
  `,
  Button: styled(Button)`
    height: 48px;
    padding: 7px 22px;
    border-radius: 8px;
    outline: none;
    box-shadow: none;

    background-color: ${colorsV2.white};
    color: ${colorsV2.gray[3]};
    border: 1px solid ${colorsV2.gray[1]};

    &.active {
      background-color: ${colorsV2.gray[0]};
      color: ${colorsV2.gray[4]};
      border: none;
    }

    &:focus {
      outline: none;
      box-shadow: none;
      background-color: ${colorsV2.white};
      color: ${colorsV2.gray[3]};
      border: 1px solid ${colorsV2.gray[1]};

      &.active {
        background-color: ${colorsV2.gray[0]};
        color: ${colorsV2.gray[4]};
        border: none;
      }
    }
    &:disabled {
      &:active,
      &:focus,
      &:hover {
        box-shadow: none;
        border: none;
        background-color: ${colorsV2.white};
        color: ${colorsV2.gray[3]};
        border: 1px solid ${colorsV2.gray[1]};
        opacity: 0.25;

        &.active {
          background-color: ${colorsV2.gray[0]};
          color: ${colorsV2.gray[4]};
          border: none;
        }
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
      outline: none;
      box-shadow: none;
      background-color: ${colorsV2.white};
      color: ${colorsV2.gray[3]};
      border: 1px solid ${colorsV2.gray[1]};
      opacity: 0.65;

      &.active {
        background-color: ${colorsV2.gray[0]};
        color: ${colorsV2.gray[4]};
        border: none;
        opacity: 0.65;
      }
    }
    > span {
      font-weight: 600;
      font-size: 20px;
      line-height: 27px;
    }
  `,
  ContainerCreator: styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 24px;
    > div {
      display: flex;
      flex-direction: column;

      h2 {
        font-size: 12px;
        line-height: 16px;
        ${colorsV2.gray[4]}
      }

      span {
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: ${colorsV2.black};
      }
    }
  `,
  ContainerInfos: styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    span {
      font-size: 14px;
      line-height: 19px;
      ${colorsV2.gray[4]}
    }
    a {
      text-decoration: none;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 14px;
      line-height: 19px;
    }
  `
}
