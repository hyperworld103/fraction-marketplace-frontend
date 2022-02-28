import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ClaimModal } from '../components/portfolio/ClaimModal'
import { PortfolioList } from '../components/portfolio/PortfolioList'
import { accountVar, chainIdVar, WalletProvider } from '../graphql/variables/WalletVariable'
import { walletService } from '../services/WalletService'
import { WalletERC20Share } from '../types/WalletTypes'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function PortfolioPage() {
  const [erc20share, setErc20share] = useState<WalletERC20Share[]>([])
  const [loading, setLoading] = useState(true)
  const chainId = useReactiveVar(chainIdVar)

  useEffect(() => {
    const getErc20shares = async () => {
      setLoading(true)
      setErc20share([])
      const nfts = await walletService(WalletProvider.api).getERC20Shares(chainId)
      setErc20share(nfts)
      setLoading(false)
    }
    getErc20shares()
  }, [chainId])

  return (
    <DefaultPageTemplate>
      <PortfolioList erc20share={erc20share} loading={!!loading} />
      <ClaimModal />
    </DefaultPageTemplate>
  )
}
