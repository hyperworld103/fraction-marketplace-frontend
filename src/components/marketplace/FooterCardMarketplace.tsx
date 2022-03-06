import React from 'react'
import { Skeleton } from 'antd'
import { now } from 'lodash'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
// import iconRedeem from '../../assets/nft-card/iconRedeem.svg'
import startImage from '../../assets/nft-card/star.svg'
import iconRedeem from '../../assets/Redeem.svg';
// import startImage from '../../assets/'
import { getChainConfigById } from '../../config'
import { getFeatureToggleByChainId } from '../../featureToggle'
import { setMarketplaceItemLiquidity } from '../../services/MarketplaceService'
import { colorsV2, fonts, viewportV2 } from '../../styles/variables'
import { MarketplaceERC20Item } from '../../types/MarketplaceTypes'

interface FooterCardMarketplaceProps {
  erc20Item: MarketplaceERC20Item
  chainId: number
}

export const FooterCardMarketplace = ({ erc20Item, chainId }: FooterCardMarketplaceProps): JSX.Element => {
  const [isLoadingLiquidity, setIsLoadingLiquidity] = useState<boolean>(false)
  const [nftItem, setNftItem] = useState<MarketplaceERC20Item>(erc20Item)

  const { networkTokenSymbol } = getChainConfigById(chainId)
  const featureToggle = getFeatureToggleByChainId(chainId)

  useEffect(() => {
    // const setERC20Liquidity = async () => {
    //   setIsLoadingLiquidity(true)
    //   setNftItem(await setMarketplaceItemLiquidity(erc20Item, chainId))
    //   setIsLoadingLiquidity(false)
    // }

   // setERC20Liquidity()
  }, [chainId, erc20Item])

  const handleDollarFractionPrice = () => {
    const quotation = Number(nftItem.liquidity?.priceDollar.replaceAll(',', '')).toLocaleString('en-us', {
      maximumFractionDigits: 2
    })

    if (quotation === '0') {
      return `< $0.01`
    }

    return `$${quotation}`
  }

  return (
    <S.Content>
      <h1>{`${nftItem?.metadata?.name}`}</h1>
      <div>
        <span>{nftItem.type === 'SET_PRICE' ? 'Reserve Price' : 'Current Price'}</span>
        <span>
          {`${Number(nftItem.exitPrice.replaceAll(',', '')).toLocaleString('en-us', {
            maximumFractionDigits: nftItem.paymentToken.decimals
          })} `}
          <small>
            {nftItem.paymentToken.symbol === null ? networkTokenSymbol.toUpperCase() : nftItem.paymentToken.symbol.toUpperCase()}
          </small>
        </span>
      </div>
      <div>
        {(!nftItem.cutoff || (nftItem.cutoff && now() / 1000 <= nftItem.cutoff)) && (
          <>
            {featureToggle?.marketplace.fractionPrice && (!nftItem.bids || (nftItem.bids && nftItem.bids?.length === 0)) && (
              <span>
                Fraction Price:
                {!isLoadingLiquidity && nftItem.liquidity?.hasLiquidity && (
                  <strong className='isFractionalized'>{handleDollarFractionPrice()}</strong>
                )}
                {!isLoadingLiquidity && !nftItem.liquidity?.hasLiquidity && !isLoadingLiquidity && <strong>Make the first offer</strong>}
                {isLoadingLiquidity && (
                  <S.LoadingLiquidity>
                    <Skeleton className='full-width-skeleton' loading active paragraph={{ rows: 0 }} />
                  </S.LoadingLiquidity>
                )}
              </span>
            )}
            {nftItem.bids && nftItem.bids?.length > 0 && (
              <S.TagLiveAction>
                <img src={startImage} alt='star' />
                <span>Live Auction</span>
              </S.TagLiveAction>
            )}
          </>
        )}
        {nftItem.cutoff && now() / 1000 > nftItem.cutoff && (
          <S.Tag>
            <span>Ended</span>
            <S.TagRedeem>
              <img src={iconRedeem} alt='Redeem' />
              <span>Sold</span>
            </S.TagRedeem>
          </S.Tag>
        )}
      </div>
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    padding: 16px 24px 24px 24px;
    h1 {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: normal;
      color: ${props=>props.theme.black};
      margin-bottom: 14px;
      width: 220px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    > div:nth-of-type(1) {
      display: flex;
      flex-direction: column;
      > span:nth-of-type(1) {
        font-family: ${fonts.nunito};
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
        color: ${props=>props.theme.black};
      }
      > span:nth-of-type(2) {
        font-family: ${fonts.nunito};
        font-weight: 600;
        font-size: 24px;
        line-height: 33px;
        color: ${props=>props.theme.black};
        margin-bottom: 10px;
        small {
          font-size: 13px;
          padding-left: 4px;
          font-weight: 600;
          color: ${props=>props.theme.black};
        }
      }
    }
    > div:nth-of-type(2) {
      .ant-skeleton-content {
        .ant-skeleton-title {
          width: 100% !important;
          margin: 0 !important;
        }
        .ant-skeleton-paragraph {
          display: none !important;
        }
        ul {
          display: none;
        }
      }

      > span {
        display: flex;
        flex-direction: column;
        color: ${props=>props.theme.black};
        font-size: 14px;
        line-height: 25px;
        height: 50px;
        font-family: ${fonts.nunito};
        .isFractionalized {
          color: ${props=>props.theme.black};
          font-size: 18px;
        }
        strong {
          color: ${colorsV2.blue.main};
          font-size: 18px;
        }
      }
      @media (max-width: ${viewportV2.desktop}) {
        span {
          font-size: 15px;
        }
      }
    }
  `,
  TagLiveAction: styled.aside`
    max-width: 142px;
    height: 32px;
    padding: 6px 14px;
    background: ${props=>props.theme.black};
    border-radius: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 14px;
    > img {
      width: 20px;
      height: 20px;
      margin-right: 7px;
    }
    > span {
      padding-top: 1px;
      font-family: ${fonts.nunito}, sans-serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: ${props=>props.theme.white};
    }
  `,
  Tag: styled.div`
    > span {
      font-size: 14px;
      line-height: 19px;
      color: ${props=>props.theme.black};
    }
  `,
  TagRedeem: styled.aside`
    max-width: 128px;
    height: 40px;
    padding: 6px 12px;
    background: ${colorsV2.green.main};
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      width: 20px;
      height: 20px;
      margin-right: 15px;
    }
    > span {
      padding-top: 1px;
      font-family: ${fonts.nunito}, sans-serif;
      font-weight: normal;
      font-size: 20px;
      line-height: 27px;
      color: ${props=>props.theme.white};
    }
  `,
  LoadingLiquidity: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
    width: 60px;
  `
}
