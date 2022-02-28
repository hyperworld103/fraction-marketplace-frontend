import { Drawer, Menu } from 'antd'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useFeatureToggle } from '../../../hooks/ConfigHook'
import { colorsV2 } from '../../../styles/variables'

export interface HeaderMenuMobileProps {
  open: boolean
  onClose: () => void
}

export const HeaderMenuMobile = ({ open, onClose }: HeaderMenuMobileProps) => {
  const location = useLocation()
  const featureToggle = useFeatureToggle()

  return (
    <S.Drawer placement='right' closable visible={open} style={{ position: 'absolute' }} onClose={onClose}>
      <Menu>
        <S.Link to='/marketplace' className={location.pathname.includes('marketplace') ? 'active' : ''}>
          Marketplace
        </S.Link>
        <S.Group key='wallet' title='Wallet'>
          <Menu.Item>
            <S.Link to='/wallet/fractionalize' className={location.pathname.includes('fractionalize') ? 'active' : ''}>
              Fractionalize
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/wallet/portfolio' className={location.pathname.includes('portfolio') ? 'active' : ''}>
              Portfolio
            </S.Link>
          </Menu.Item>
          {featureToggle?.page.wallet && (
            <Menu.Item>
              <S.Link to='/wallet/collective-buy' className={location.pathname.includes('collective-buy') ? 'active' : ''}>
                Collective Buy
              </S.Link>
            </Menu.Item>
          )}
          <Menu.Item>
            <S.Link to='/wallet/box' className={location.pathname.includes('wallet/box') ? 'active' : ''}>
              Box
            </S.Link>
          </Menu.Item>
        </S.Group>
        <S.Group key='create' title='Create'>
          <Menu.Item>
            <S.Link to='/create/image' className={location.pathname.includes('create/image') ? 'active' : ''} onClick={onClose}>
              Image
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/create/video' className={location.pathname.includes('create/video') ? 'active' : ''} onClick={onClose}>
              Video
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/create/audio' className={location.pathname.includes('create/audio') ? 'active' : ''} onClick={onClose}>
              Audio
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/create/box' className={location.pathname.includes('create/box') ? 'active' : ''}>
              Box
            </S.Link>
          </Menu.Item>
        </S.Group>

        <S.Group key='token' title='Token'>
          <Menu.Item>
            <S.Link to='/token/transparency' className={location.pathname.includes('transparency') ? 'active' : ''}>
              Transparency
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/token/bridge' className={location.pathname.includes('bridge') ? 'active' : ''}>
              Bridge
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/token/buy' className={location.pathname.includes('buy') ? 'active' : ''}>
              Buy
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/token/farm' className={location.pathname.includes('farm') ? 'active' : ''}>
              Farm
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.Link to='/token/claim' className={location.pathname.includes('claim') ? 'active' : ''}>
              Claim
            </S.Link>
          </Menu.Item>
          <Menu.Item>
            <S.A href='https://docs.nftfy.org/' target='_blank'>
              Docs
            </S.A>
          </Menu.Item>
        </S.Group>
      </Menu>
    </S.Drawer>
  )
}

const S = {
  Drawer: styled(Drawer)`
    box-shadow: none;

    ul > a {
      margin: 0;
      margin-left: 0.5rem;
      display: flex;
    }

    .ant-drawer-body {
      padding-top: 6rem;
    }
  `,
  Group: styled(Menu.ItemGroup)`
    > div {
      height: 3rem;
      line-height: 2rem;
      padding: 0;
      margin-top: 2rem;
      margin-bottom: 0rem;
      padding-left: 0.5rem;
      color: ${props => props.theme.gray[2]};
    }

    > ul {
      box-shadow: none !important;
      border: none !important;

      > li {
        height: 2rem !important;
        line-height: 2rem !important;
        background-color: ${props => props.theme.white};
        color: ${props => props.theme.gray[4]};
        padding: 0 16px 0 0 !important;
        box-shadow: none !important;
      }
    }
  `,
  Link: styled(Link)`
    font-family: ${props => props.theme.fonts.primary};
    font-size: 1.6rem;
    line-height: 2rem;
    font-weight: 400;
    color: ${props => props.theme.gray[4]};
    padding: 0;
    border: 0;
    margin: 0 1.6rem;

    &.active,
    &:hover {
      color: ${colorsV2.blue.main} !important;
    }
    &:focus {
      outline: none;
      box-shadow: none;
      border: none;
    }
  `,
  A: styled.a`
    font-family: ${props => props.theme.fonts.primary};
    font-size: 1.6rem;
    line-height: 2rem;
    font-weight: 400;
    color: ${props => props.theme.gray[4]};
    padding: 0;
    border: 0;
    margin: 0 1.6rem;

    &.active,
    &:hover {
      color: ${colorsV2.blue.main};
    }
  `
}
