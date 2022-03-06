import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { getChainConfigById } from '../../../config'
import { getFeatureToggleByChainId } from '../../../featureToggle'
import { metadataTabAuctionVar } from '../../../graphql/variables/AuctionVariables'
import { buyModalVar } from '../../../graphql/variables/MarketplaceVariable'
import { placeBidModalVar } from '../../../graphql/variables/PlaceBidVariables'
import { clearTransaction, transactionLoadingVar, transactionVar } from '../../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../../graphql/variables/WalletVariable'
import { isOwner as checkIsAuctionOwner } from '../../../services/AuctionService'
import { redeemErc20 } from '../../../services/NftfyService'
import { zeroXQuoteService } from '../../../services/QuoteService'
import { units } from '../../../services/UtilService'
import { getErc20Balance } from '../../../services/WalletService'
import { colorsV2, viewport } from '../../../styles/variables'
import { MarketplaceERC20Item } from '../../../types/MarketplaceTypes'
import { peerToPeerTradeModalSaveVar } from '../PeerToPeerTradeSaveModal'
import { updateListingModalVar } from './UpdateListingModal'

type SetPriceProps = {
  erc20: MarketplaceERC20Item
}
export function SetPrice({ erc20 }: SetPriceProps) {
  const history = useHistory()
  const [metadataTab, setMetadataTab] = useState<'details' | 'description'>('details')
  const [exitPriceDollar, setExitPriceDollar] = useState<string | undefined>(undefined)
  const [isAuctionOwner, setIsAuctionOwner] = useState<boolean>(false)
  const [isFractionsOwner, setFractionsIsOwner] = useState<boolean | undefined>(false)
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const transaction = useReactiveVar(transactionVar)

  const { etherscanAddress, networkTokenSymbol, ethAddress } = getChainConfigById(chainId)
  const featureToggle = getFeatureToggleByChainId(chainId)

  useEffect(() => {
    const handleIsAuctionOwner = async () => {
      if (account) {
        setIsAuctionOwner(await checkIsAuctionOwner(erc20.id, account, chainId))
      }
    }

    handleIsAuctionOwner()
  }, [account, chainId, erc20.id])

  useEffect(() => {
    const getShareBalance = async () => {
      if (erc20?.id) {
        const balance = await getErc20Balance(erc20?.id, erc20?.decimals, chainId)
        setFractionsIsOwner(Number(balance.toString()) === Number(erc20.totalSupply))
      }
    }
    getShareBalance()
  }, [account, chainId, erc20?.id, erc20?.decimals, transactionLoading, erc20.totalSupply])

  useEffect(() => {
    const getExitPriceDollar = async () => {
      const exitAmount = units(erc20?.exitPrice || '1', erc20?.paymentToken.decimals || 6)

      const quoteDollar = await zeroXQuoteService().quoteToStablecoin(
        erc20?.paymentToken.id || '',
        exitAmount,
        erc20?.paymentToken.decimals || 6,
        chainId
      )

      const exitPriceDollarValue = quoteDollar.priceDollar === '' ? '0' : quoteDollar.priceDollar

      setExitPriceDollar(Number(exitPriceDollarValue.replaceAll(',', '')).toLocaleString('en', { maximumFractionDigits: 2 }))
    }
    featureToggle?.marketplaceDetails.priceQuotation && getExitPriceDollar()
  }, [chainId, erc20, featureToggle?.marketplaceDetails.priceQuotation, transactionLoading, networkTokenSymbol])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'redeem' && transaction.confirmed) {
      history.push('/wallet/fractionalize')
      clearTransaction()
    }
  }, [history, transaction, transactionLoading])

  const buyNftModal = () => {
    erc20 &&
      buyModalVar({
        type: 'nft',
        item: erc20
      })
  }

  const placeBid = () => {
    erc20 && placeBidModalVar(erc20)
  }

  const updateListing = () => {
    erc20 && updateListingModalVar(erc20)
  }

  const goToTrade = () => {
    metadataTabAuctionVar('fraction')
    const detailsDivHeight = document.getElementById('details')?.scrollHeight || 0
    window.scrollTo(0, detailsDivHeight)
  }

  const goToSellOrderModal = () => {
    if (erc20) {
      const erc20Item = erc20?.paymentToken.id === null ? { ...erc20, paymentToken: { ...erc20.paymentToken, id: ethAddress } } : erc20
      peerToPeerTradeModalSaveVar({ type: 'sell', erc20: erc20Item })
    }
  }

  const sellFractions = () => {
    if (erc20) {
      const erc20Item = erc20?.paymentToken.id === null ? { ...erc20, paymentToken: { ...erc20.paymentToken, id: ethAddress } } : erc20
      peerToPeerTradeModalSaveVar({ type: 'sell', erc20: erc20Item })
    }
  }

  const redeemNft = () => {
    console.log(account, erc20.id, chainId);
    redeemErc20(erc20.id, account || '', chainId)
  }

  return (
    <S.DetailItem>
      <section>
        <h4>Reserve Price</h4>
        <h3>
          <span>
            {`${new BigNumber(erc20?.exitPrice.replaceAll(',', ''))
              .toNumber()
              .toLocaleString('en', { maximumFractionDigits: erc20.paymentToken.decimals })} ${
              erc20?.paymentToken.symbol || networkTokenSymbol
            }`}
          </span>
        </h3>
        {exitPriceDollar && <small>{`$${exitPriceDollar}`}</small>}
      </section>
      <div>
        {erc20.type === 'SET_PRICE' && !isFractionsOwner && (
          <S.PrimaryButton className='primary' onClick={buyNftModal}>
            Buy NFT
          </S.PrimaryButton>
        )}
        {erc20.type === 'SET_PRICE' && isFractionsOwner && (
          <S.PrimaryButton className='green' onClick={redeemNft}>
            Redeem
          </S.PrimaryButton>
        )}
        {erc20.type === 'AUCTION' && !isAuctionOwner && (
          <S.PrimaryButton className='primary' onClick={placeBid}>
            Place a bid
          </S.PrimaryButton>
        )}
        {erc20.type === 'AUCTION' && isAuctionOwner && (
          <S.PrimaryButton className='primary' onClick={updateListing}>
            Edit
          </S.PrimaryButton>
        )}
        {isAuctionOwner && (
          <S.PrimaryButton className='default' onClick={() => sellFractions()}>
            Sell Fractions
          </S.PrimaryButton>
        )}
        {isFractionsOwner && (
          <S.PrimaryButton className='default' onClick={() => goToSellOrderModal()}>
            Sell Fractions
          </S.PrimaryButton>
        )}
        {!isAuctionOwner && !isFractionsOwner && (
          <S.PrimaryButton className='default' onClick={() => goToTrade()}>
            Trade Fractions
          </S.PrimaryButton>
        )}
      </div>
      <S.MetadataContainer>
        <ul>
          <li>
            <button type='button' className={`${metadataTab === 'details' ? 'active' : ''}`} onClick={() => setMetadataTab('details')}>
              Details
            </button>
          </li>
          <li>
            <button
              type='button'
              className={`${metadataTab === 'description' ? 'active' : ''}`}
              onClick={() => setMetadataTab('description')}>
              Description
            </button>
          </li>
        </ul>
        {metadataTab === 'details' && (
          <div>
            <div>
              <Jazzicon diameter={32} seed={jsNumberForAddress(erc20?.id)} />
              <span>
                Creator
                <span>{erc20?.metadata?.author || '-'}</span>
              </span>
            </div>
            <h4>{`Edition: 1/${erc20?.metadata?.totalSupply || 1}`}</h4>
            <div>
              <span>{`Token ID: ${erc20?.target.tokenId}`}</span>
              <a rel='noreferrer' target='_blank' href={`https://opensea.io/assets/${erc20.target.collection.id}/${erc20.target.tokenId}`}>
                View on open sea
              </a>
              <a rel='noreferrer' target='_blank' href={`${etherscanAddress}/address/${erc20.target.collection.id}`}>
                View on etherscan
              </a>
            </div>
          </div>
        )}
        {metadataTab === 'description' && (
          <div>
            <p>{erc20.metadata?.description}</p>
          </div>
        )}
      </S.MetadataContainer>
    </S.DetailItem>
  )
}
const S = {
  DetailItem: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    section {
      > h4 {
        font-size: 14px;
        line-height: 18px;
        color: ${colorsV2.gray['4']};
      }
      > h3 {
        font-size: 40px;
        font-weight: 600;
        line-height: 54px;
        color: ${colorsV2.black};
      }
      > small {
        color: ${colorsV2.gray['4']};
      }
    }
    div {
      display: flex;
      gap: 16px;
    }
  `,
  PrimaryButton: styled(Button)`
    width: 138px;
    height: 40px;
    @media (max-width: ${viewport.sm}) {
      width: 100%;
    }
    border-radius: 8px;
    outline: none;
    box-shadow: none;
    &.primary {
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      border: none;
    }

    &.default {
      background-color: ${colorsV2.white};
      color: ${colorsV2.gray['3']};
      border: 1px solid ${colorsV2.gray['1']};
    }

    &.green {
      background-color: ${colorsV2.green.main};
      color: ${colorsV2.white};
      border: none;
    }

    &:focus {
      outline: none;
      box-shadow: none;
      &.primary {
        background-color: ${colorsV2.blue.main};
        color: ${colorsV2.white};
        border: none;
      }

      &.default {
        background-color: ${colorsV2.white};
        color: ${colorsV2.gray['3']};
        border: 1px solid ${colorsV2.gray['1']};
      }

      &.green {
        background-color: ${colorsV2.green.main};
        color: ${colorsV2.white};
        border: none;
      }
    }
    &:disabled {
      &:active,
      &:focus,
      &:hover {
        box-shadow: none;
        border: none;
        &.primary {
          color: ${colorsV2.white};
          border-radius: 8px;
          background-color: ${colorsV2.blue.main};
          opacity: 0.25;
        }

        &.default {
          background-color: ${colorsV2.white};
          color: ${colorsV2.gray['3']};
          border: 1px solid ${colorsV2.gray['1']};
          opacity: 0.45;
        }

        &.green {
          background-color: ${colorsV2.green.main};
          color: ${colorsV2.white};
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
      border: none;
      &.primary {
        background-color: ${colorsV2.blue.main};
        color: ${colorsV2.white};
        opacity: 0.65;
      }

      &.default {
        background-color: ${colorsV2.white};
        color: ${colorsV2.gray['3']};
        border: 1px solid ${colorsV2.gray['1']};
        opacity: 0.45;
      }

      &.green {
        background-color: ${colorsV2.green.main};
        color: ${colorsV2.white};
        border: none;
        opacity: 0.65;
      }
    }
    > span {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
    }
  `,
  MetadataContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    > ul {
      display: flex;
      gap: 18px;

      > li {
        > button {
          padding: 0;
          cursor: pointer;
          border: none;
          background: none;
          color: ${colorsV2.gray['3']};
          font-size: 14px;
          line-height: 18px;
          font-weight: 600;
          transition: 250ms color ease-in;

          &:focus {
            color: ${colorsV2.gray['3']};
          }

          &:hover {
            color: ${colorsV2.gray['2']};
          }

          &.active {
            color: ${colorsV2.blue.main};

            &:focus {
              color: ${colorsV2.blue.main};
            }

            &:hover {
              color: ${colorsV2.blue.light};
            }
          }
        }
      }
    }

    > div {
      border-radius: 8px;
      background-color: ${colorsV2.white};
      border: 1px solid ${colorsV2.gray['1']};
      height: 204px;
      width: 100%;
      overflow-y: auto;
      padding: 16px 24px;

      font-size: 14px;
      line-height: 18px;
      font-weight: 400;

      display: flex;
      flex-direction: column;
      gap: 24px;

      > div {
        display: flex;
        align-items: center;
        gap: 2px;

        &:nth-of-type(1) {
          gap: 8px;
          > span {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            font-weight: 400;
            color: ${colorsV2.black};
            justify-content: center;
          }
        }

        &:nth-of-type(2) {
          flex-direction: column;
          align-items: flex-start;
          > a {
            color: ${colorsV2.blue.main};

            &:focus {
              color: ${colorsV2.blue.main};
            }

            &:hover {
              color: ${colorsV2.blue.light};
            }

            &:visited {
              color: ${colorsV2.blue.darker};
            }
          }

          > span {
            color: ${colorsV2.gray['4']};
          }
        }
      }

      > h4 {
        font-weight: 600;
        font-size: 20px;
        line-height: 27px;
        color: ${colorsV2.black};
      }

      > p {
        margin: 0;
        font-size: 12px;
        white-space: break-spaces;
        word-break: break-word;
      }
    }
  `
}
