import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getChainConfigById } from '../../config'
import { useFeatureToggle } from '../../hooks/ConfigHook'
import { zeroXQuoteService } from '../../services/QuoteService'
import { units } from '../../services/UtilService'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'

interface ReservePriceProps {
  item: CollectiveBuyMarketplaceItem
  chainId: number
  hasEnded: boolean
  isRedeemed: boolean
}

export const ReservePrice = ({ chainId, item, hasEnded, isRedeemed }: ReservePriceProps) => {
  const [exitPriceDollar, setExitPriceDollar] = useState<string | undefined>(undefined)

  const featureToggle = useFeatureToggle()
  const { networkTokenSymbol } = getChainConfigById(chainId)

  useEffect(() => {
    const getExitPriceDollar = async () => {
      const exitAmount = units(item?.reservePrice || '1', item?.paymentToken.decimals || 6)

      const quoteDollar = await zeroXQuoteService().quoteToStablecoin(
        item?.paymentToken.id || '',
        exitAmount,
        item?.paymentToken.decimals || 6,
        chainId
      )
      const exitPriceDollarValue = quoteDollar.priceDollar === '' ? '0' : quoteDollar.priceDollar

      setExitPriceDollar(Number(exitPriceDollarValue.replaceAll(',', '')).toLocaleString('en', { maximumFractionDigits: 2 }))
    }
    featureToggle?.marketplaceDetails.priceQuotation && getExitPriceDollar()
  }, [chainId, featureToggle?.marketplaceDetails.priceQuotation, item?.paymentToken.decimals, item?.paymentToken.id, item?.reservePrice])

  if (isRedeemed) {
    return (
      <S.Section>
        <h3>This item has been redeemed</h3>
      </S.Section>
    )
  }

  return (
    <S.Section>
      <h4>{hasEnded ? 'Sold For' : 'Reserve Price'}</h4>
      <div>
        <span>{`${item.reservePrice}`}</span>
        <small>{`${item?.paymentToken.symbol || networkTokenSymbol}`}</small>
      </div>
      <h5>{`$${exitPriceDollar}`}</h5>
    </S.Section>
  )
}

const S = {
  Section: styled.section`
    > div {
      display: flex;
      gap: 8px;
      align-items: baseline;
      small {
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 25px;
      }
    }

    font-style: normal;
    font-weight: normal;
    h3 {
      font-size: 18px !important;
      line-height: 24px !important;
      color: ${props => props.theme.gray[4]};
    }
    h4 {
      font-size: 14px;
      line-height: 19px;
      color: ${props => props.theme.gray[4]};
    }
    span {
      font-weight: 600;
      font-size: 40px;
      line-height: 55px;
      color: ${props => props.theme.black};
    }
    h5 {
      font-size: 12px;
      line-height: 16px;
      color: ${props => props.theme.gray[4]};
    }
  `
}
