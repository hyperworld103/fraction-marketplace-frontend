import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FractionalizeDetailsCardsLoading } from '../components/fractionalize/FractionalizeDetailsCardsLoading'
import { FractionalizeERC721 } from '../components/fractionalize/FractionalizeERC721'
import { SelectPaymentTokenModal } from '../components/shared/SelectPaymentTokenModal'
import { paymentTokenVar, selectPaymentTokenModalVar } from '../graphql/variables/FractionalizeVariables'
import { chainIdVar } from '../graphql/variables/WalletVariable'
import { AssetERC20 } from '../types/WalletTypes'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { useWalletNft } from '../hooks/WalletHooks'

export default function FractionalizeDetailsPage() {
  const { itemId } = useParams<{ itemId: string }>()
  const isVisible = useReactiveVar(selectPaymentTokenModalVar)
  const chainId = useReactiveVar(chainIdVar)
  const { erc721 } = useWalletNft(itemId)
  if (!erc721) {
    return (
      <DefaultPageTemplate>
        <FractionalizeDetailsCardsLoading />
      </DefaultPageTemplate>
    )
  }

  return (
    <DefaultPageTemplate>
      <FractionalizeERC721 chainId={chainId} erc721={erc721} itemId={itemId} />
      <SelectPaymentTokenModal
        location='fractionalize'
        visible={!!isVisible}
        onCancel={() => selectPaymentTokenModalVar(false)}
        onSelect={(erc20: AssetERC20) => {
          paymentTokenVar(erc20)
          selectPaymentTokenModalVar(false)
        }}
      />
    </DefaultPageTemplate>
  )
}
