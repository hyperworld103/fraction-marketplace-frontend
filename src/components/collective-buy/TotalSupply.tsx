import React from 'react'
import { getChainConfigById } from '../../config'
import { CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'

interface TotalSupplyProps {
  item: CollectiveBuyMarketplaceItem
  chainId: number
}

export const TotalSupply = ({ chainId, item }: TotalSupplyProps) => {
  const { networkTokenSymbol } = getChainConfigById(chainId)

  return (
    <section>
      <h4>Total Supply</h4>
      <div>
        <span>{`${item.fractionsCount}`}</span>
        <small>{`${item?.symbol || item?.erc721?.symbol}`}</small>
      </div>
      <h3>{`New Reserve Price: ${item.reservePrice} ${item?.paymentToken.symbol || networkTokenSymbol}`}</h3>
    </section>
  )
}
