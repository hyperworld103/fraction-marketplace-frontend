import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import menuIcon from '../../../../assets/menuIcon.svg'
import nftfyIcon from '../../../../assets/nftfy-icon.svg'
import nftfy from '../../../../assets/nftfy.svg'
import nftfy_dark from '../../../../assets/nftfy_dark.svg'
import { ThemeProviderEnum, themeVar } from '../../../graphql/variables/Shared'
import { accountVar, chainIdVar, wrongNetworkModalVar } from '../../../graphql/variables/WalletVariable'
import { isAllowedChain } from '../../../services/UtilService'
import { NetworkConnected } from '../../multi-wallet/NetworkConnected'
import { WalletButton } from '../../multi-wallet/WalletButton'
import WrongNetworkModal from '../WrongNetworkModal'
import { HeaderMenu } from './HeaderMenu'
import { HeaderMenuMobile } from './HeaderMenuMobile'

export type HeaderProps = {
  className?: string
}
export const Header: React.FC<HeaderProps> = ({ className }: HeaderProps) => {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const theme = useReactiveVar(themeVar)
  const rightChain = !!account && isAllowedChain(chainId)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  useEffect(() => {
    !account || rightChain ? wrongNetworkModalVar(false) : wrongNetworkModalVar(true)
  }, [account, rightChain])

  return (
    <S.FixedContainer>
      <S.Header className={className}>
        <S.LogoLink to='/'>
          <S.Logo src={theme === ThemeProviderEnum.dark ? nftfy_dark : nftfy} alt='CryptoTrades' />
          <S.LogoMobile src={nftfyIcon} alt='CryptoTrades' />
        </S.LogoLink>
        <S.HeaderMenu />
        <WalletButton />
        {account && <NetworkConnected />}
        <S.MenuButton src={menuIcon} alt='Menu' onClick={() => setOpenMobileMenu(!openMobileMenu)} />
        <HeaderMenuMobile open={openMobileMenu} onClose={() => setOpenMobileMenu(false)} />
      </S.Header>
      <WrongNetworkModal />
    </S.FixedContainer>
  )
}
const S = {
  FixedContainer: styled.div`
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 96px;
  `,
  Header: styled.header`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 96px;
    background: ${props => props.theme.white};
    padding: 0px 24px;
    border-bottom: 1px solid ${props => props.theme.gray[1]};
  `,
  HeaderMenu: styled(HeaderMenu)`
    margin-right: 5rem;
  `,
  LogoLink: styled(Link)`
    margin-right: auto;
  `,
  Logo: styled.img`
    width: 112px;
    height: 40px;
    margin-right: 24px;
    cursor: pointer;
    @media (max-width: ${props => props.theme.viewport.tablet}) {
      display: none;
    }
  `,
  LogoMobile: styled.img`
    width: 40px;
    height: 40px;
    margin-right: auto;
    display: none;

    @media (max-width: ${props => props.theme.viewport.tablet}) {
      display: flex;
    }
  `,
  ButtonConnectWallet: styled.button`
    padding: 0 24px;
    height: 40px;
    background: ${props => props.theme.gray[1]};
    border: none;
    font-style: normal;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 24px;
    color: ${props => props.theme.gray[2]};
    transition: background-color 0.5s;
    cursor: pointer;
    &:hover {
      background: ${props => props.theme.white};
    }
  `,
  MenuButton: styled.img`
    background: ${props => props.theme.white};
    width: 48px;
    height: 48px;
    margin-left: 24px;
    display: none;
    border-radius: ${props => props.theme.borderRadius.large};
    @media (max-width: ${props => props.theme.viewport.desktop}) {
      display: block;
    }
  `
}
