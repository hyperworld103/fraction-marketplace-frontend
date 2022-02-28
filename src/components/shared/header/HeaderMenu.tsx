import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useFeatureToggle } from '../../../hooks/ConfigHook'

export const HeaderMenu: React.FC = () => {
  const location = useLocation()
  const featureToggle = useFeatureToggle()

  const walletMenu = () => (
    <S.Menu>
      <Menu.Item>
        <S.Link to='/wallet/fractionalize' className={location.pathname.includes('fractionalize') ? 'active' : ''}>
          Fractionalize
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
        <S.Link to='/wallet/portfolio' className={location.pathname.includes('portfolio') ? 'active' : ''}>
          Portfolio
        </S.Link>
      </Menu.Item>
      <Menu.Item>
        <S.Link to='/wallet/box' className={location.pathname.includes('wallet/box') ? 'active' : ''}>
          Boxes
        </S.Link>
      </Menu.Item>
    </S.Menu>
  )

  const createMenu = () => (
    <S.Menu>
      <Menu.Item>
        <S.Link to='/create/image' className={location.pathname.includes('create/image') ? 'active' : ''}>
          Image
        </S.Link>
      </Menu.Item>
      <Menu.Item>
        <S.Link to='/create/video' className={location.pathname.includes('create/video') ? 'active' : ''}>
          Video
        </S.Link>
      </Menu.Item>
      <Menu.Item>
        <S.Link to='/create/audio' className={location.pathname.includes('create/audio') ? 'active' : ''}>
          Audio
        </S.Link>
      </Menu.Item>
      <Menu.Item>
        <S.Link to='/create/box' className={location.pathname.includes('create/box') ? 'active' : ''}>
          Box
        </S.Link>
      </Menu.Item>
    </S.Menu>
  )

  const tokenMenu = () => (
    <S.Menu>
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
    </S.Menu>
  )
  return (
    <S.Nav>
      <S.Link to='/marketplace' className={`marketplace ${location.pathname.includes('marketplace') ? 'active' : ''}`}>
        Marketplace
      </S.Link>
      <Dropdown overlay={walletMenu} placement='bottomCenter'>
        <S.Button
          className={
            location.pathname.includes('fractionalize') ||
            location.pathname.includes('portfolio') ||
            location.pathname.includes('wallet/box')
              ? 'active'
              : ''
          }>
          Wallet
        </S.Button>
      </Dropdown>
      <Dropdown overlay={createMenu} placement='bottomCenter'>
        <S.Button className={location.pathname.includes('create') ? 'active' : ''}>Create</S.Button>
      </Dropdown>
      <Dropdown overlay={tokenMenu} placement='bottomCenter'>
        <S.Button className={location.pathname.includes('token') ? 'active' : ''}>Token</S.Button>
      </Dropdown>
    </S.Nav>
  )
}

const S = {
  Menu: styled(Menu)`
    background-color: ${props => props.theme.white};
    border: 1px solid ${props => props.theme.gray[0]};
    border-radius: ${props => props.theme.borderRadius.small};
    .ant-dropdown-menu-item:last-child {
      border-bottom: none;
    }
    .ant-dropdown-menu-item {
      padding: 16px 24px 16px 24px;
      border-bottom: 1px solid ${props => props.theme.gray[0]};
    }
    .ant-dropdown-menu-item:hover {
      background: transparent;
      a {
        color: ${props => props.theme.blue.main} !important;
      }
    }
  `,
  Nav: styled.nav`
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 40px;
    margin-left: auto;
    margin-right: 7rem;
    display: none;
    display: flex;
    flex-direction: row;
    @media (max-width: ${props => props.theme.viewport.desktop}) {
      display: none;
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
      color: ${props => props.theme.blue.main};
    }
    &:focus {
      outline: none;
      box-shadow: none;
      border: none;
    }
  `,
  Button: styled(Button)`
    font-family: ${props => props.theme.fonts.primary};
    cursor: pointer;
    font-size: 1.6rem;
    line-height: 2rem;
    font-weight: 400;
    color: ${props => props.theme.gray[4]};
    padding: 0;
    border: 0;
    margin: 0 1.6rem;
    cursor: default;
    box-shadow: none;
    background: ${props => props.theme.white};
    > span:hover {
      color: ${props => props.theme.blue.main};
      cursor: pointer;
    }
    &.ant-btn:focus {
      outline: none;
      box-shadow: none;
      border-color: transparent;
      color: ${props => props.theme.gray[4]};
    }

    &.active,
    :hover {
      color: ${props => props.theme.blue.main};
    }

    &.ant-btn:hover {
      outline: none;
      box-shadow: none;
      border-color: transparent;
      color: ${props => props.theme.blue.main};
      background: transparent;
    }
    &::after {
      display: none;
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
      color: ${props => props.theme.blue.main};
    }
  `
}
