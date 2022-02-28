import { useReactiveVar } from '@apollo/client'
import 'antd/dist/antd.css'
import React, { ReactElement, useEffect } from 'react'
import 'react-multi-carousel/lib/styles.css'
import { HashRouter as Router } from 'react-router-dom'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { ThemeProvider } from 'styled-components'
import { ThemeProviderEnum, themeVar } from '../graphql/variables/Shared'
import { MultiWalletProvider } from '../graphql/variables/WalletVariable'
import Routes from '../routes/Routes'
import { multiWalletService } from '../services/MultiWalletService'
// import '../styles/fonts.css'
// import '../styles/reset.css'
import { darkTheme, lightTheme, Theme } from '../styles/theme'
import { ConnectWalletModal } from './multi-wallet/ConnectWalletModal'
import { ModalTransaction } from './transaction/TransactionModal'

export default function App(): ReactElement<Theme> {
  const theme = useReactiveVar(themeVar)

  // useEffect(() => {
  //   const autoConnect = async () => {
  //     const provider = window.localStorage.getItem('provider') as MultiWalletProvider | undefined
  //     const chainId = Number(window.localStorage.getItem('chainId')) as number | undefined
  //     if (provider && chainId) {
  //       await multiWalletService(provider, chainId).connect()
  //     }
  //   }

  //   autoConnect()
  // }, [])

  return (
    <ThemeProvider theme={theme === ThemeProviderEnum.dark ? darkTheme : lightTheme}>
      <Router>
        <Routes />
        <ConnectWalletModal />
        <ModalTransaction />
      </Router>
    </ThemeProvider>
  )
}
