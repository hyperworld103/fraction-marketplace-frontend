import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Dropdown, Menu } from 'antd'
import styled from 'styled-components'
import filterIcon from '../../assets/filterIcon.svg'
import { MarketplaceFilter, marketplaceFiltersVar } from '../../graphql/variables/MarketplaceVariable'
import { colorsV2, fonts, viewportMargin, viewportV2 } from '../../styles/variables'

export const FilterMarketPlace = () => {
  const marketplaceFilter = useReactiveVar(marketplaceFiltersVar)

  const menu = (
    <Menu>
      <Menu.Item key='1' onClick={() => marketplaceFiltersVar(MarketplaceFilter.all)}>
        All
      </Menu.Item>
      <Menu.Item key='2' onClick={() => marketplaceFiltersVar(MarketplaceFilter.liveAuction)}>
        Live Auction
      </Menu.Item>
      <Menu.Item key='3' onClick={() => marketplaceFiltersVar(MarketplaceFilter.sold)}>
        Sold
      </Menu.Item>
      <Menu.Item key='4' onClick={() => marketplaceFiltersVar(MarketplaceFilter.boxes)}>
        Boxes
      </Menu.Item>
    </Menu>
  )

  return (
    <S.Content>
      <li>
        <S.ButtonFilter
          className={marketplaceFilter === MarketplaceFilter.all ? 'active' : ''}
          onClick={() => marketplaceFiltersVar(MarketplaceFilter.all)}>
          All
        </S.ButtonFilter>
      </li>
      <li>
        <S.ButtonFilter
          className={marketplaceFilter === MarketplaceFilter.liveAuction ? 'active' : ''}
          onClick={() => marketplaceFiltersVar(MarketplaceFilter.liveAuction)}>
          Live Auction
        </S.ButtonFilter>
      </li>
      <li>
        <S.ButtonFilter
          className={marketplaceFilter === MarketplaceFilter.boxes ? 'active' : ''}
          onClick={() => marketplaceFiltersVar(MarketplaceFilter.boxes)}>
          Boxes
        </S.ButtonFilter>
      </li>
      <li>
        <S.ButtonFilter
          className={marketplaceFilter === MarketplaceFilter.sold ? 'active' : ''}
          onClick={() => marketplaceFiltersVar(MarketplaceFilter.sold)}>
          Sold
        </S.ButtonFilter>
      </li>
      <S.DropDownMobile overlay={menu}>
        <Button>
          Filter
          <img src={filterIcon} alt='wallet token' />
        </Button>
      </S.DropDownMobile>
    </S.Content>
  )
}
const S = {
  Content: styled.ul`
    font-family: ${fonts.nunito};
    display: flex;
    flex-direction: row;
    align-items: center;
    li {
      padding-right: 10px;
    }
    @media (max-width: ${viewportV2.tablet}) {
      li {
        display: none;
      }
    }
  `,
  DropDownMobile: styled(Dropdown)`
    width: 120px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid transparent;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 1.6rem;
    color: ${colorsV2.gray[3]};
    white-space: nowrap;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.5s;

    background-color: ${colorsV2.white};
    font-weight: 400;
    font-family: ${fonts.nunito};
    height: 40px;
    color: ${colorsV2.gray[3]};
    box-shadow: none;
    border: 1px solid ${colorsV2.gray[1]};

    transition: none;
    display: none;

    &:hover,
    &.ant-dropdown-open {
      border: 1px solid ${colorsV2.blue.main};
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};

      img {
        filter: brightness(0) invert(1);
      }
    }

    &:focus {
      border: 1px solid ${colorsV2.white};
      color: ${colorsV2.white};
      outline: none;
    }

    @media (max-width: ${viewportV2.tablet}) {
      display: flex;
    }

    @media (min-width: ${viewportV2.tablet}) {
      margin-bottom: ${viewportMargin.base};
    }

    @media (min-width: ${viewportV2.desktop}) {
      margin-bottom: ${viewportMargin.tablet};
    }
  `,
  ButtonFilter: styled(Button)`
    background: ${colorsV2.white};
    height: 40px;
    border-radius: 8px;
    border: 1px solid ${colorsV2.gray[1]};
    transition: background-color 0s ease;
    span {
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      color: ${colorsV2.gray[3]};
      font-family: ${fonts.nunito} !important;
    }

    &:hover,
    &:active,
    &:focus,
    &.active {
      border: 1px solid ${colorsV2.white};
      background: ${colorsV2.blue.main};
      span {
        color: ${colorsV2.white};
      }
    }
  `
}
