import { Dropdown, Menu } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import filterIcon from '../../../assets/filterIcon.svg'
import { sortingDirectionMarketplaceItemsVar, sortingFieldMarketplaceItemsVar } from '../../../graphql/variables/MarketplaceVariable'
import { colorsV2, fonts } from '../../../styles/variables'

export interface SortDropdownFilterProps {
  className?: string
}
interface MenuClickEventHandler {
  key: React.Key
  keyPath: React.Key[]
  item: React.ReactInstance
  domEvent: React.MouseEvent<HTMLElement>
}

export const SortDropdownFilter: React.FC<SortDropdownFilterProps> = ({ className }: SortDropdownFilterProps) => {
  const [sort, setSort] = useState<string>('recentlyAdded')

  const handleClick = (info: MenuClickEventHandler) => {
    const orderingParts = info.key.toString().split('-')

    sortingFieldMarketplaceItemsVar(orderingParts[0] as 'timestamp' | 'liquidity' | 'name')
    sortingDirectionMarketplaceItemsVar(orderingParts[1] as 'asc' | 'desc')
    setSort(info.key.toString())
  }

  const SortMenuItems = (
    <Menu onClick={()=>handleClick}>
      <Menu.Item key='timestamp-desc'>
        <span className={sort === 'timestamp-desc' ? 'active' : ''}>Recently Added</span>
      </Menu.Item>
      <Menu.Item key='timestamp-asc'>
        <span className={sort === 'timestamp-asc' ? 'active' : ''}>Old Added</span>
      </Menu.Item>
      <Menu.Item key='name-asc'>
        <span className={sort === 'name-asc' ? 'active' : ''}>Order A-Z</span>
      </Menu.Item>
      <Menu.Item key='name-desc'>
        <span className={sort === 'name-desc' ? 'active' : ''}>Order Z-A</span>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={SortMenuItems} trigger={['click']} className={className}>
      <S.SortButton type='button'>
        Sort by
        <img src={filterIcon} alt='wallet token' />
      </S.SortButton>
    </Dropdown>
  )
}

const S = {
  SortButton: styled.button`
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
      border: 1px solid ${colorsV2.gray[1]};
      outline: none;
    }
  `
}
