import { Pagination } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { colors, fonts } from '../../../styles/variables'

export interface PaginationButtonProps {
  className?: string
  defaultCurrent: number
  total: number
  limit: number
  onChange: (pageNumber: number, pageSizeNumber: number) => void
}
export const PaginationButton: React.FC<PaginationButtonProps> = ({
  className,
  total,
  limit,
  defaultCurrent,
  onChange
}: PaginationButtonProps) => {
  return (
    <S.Pagination
      className={className}
      size='small'
      total={total}
      pageSize={limit}
      defaultCurrent={defaultCurrent}
      defaultPageSize={12}
      onChange={(page, pageSize) => onChange(page, pageSize || 12)}
    />
  )
}

export const S = {
  Pagination: styled(Pagination)`
    height: 32px;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${colors.gray2};

    li {
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px;
      margin: 0px 8px !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    li:first-child {
      display: none;
    }
    li:last-child {
      display: none;
    }

    li.ant-pagination-item.ant-pagination-item-active {
      background: ${colors.white1};
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
      border: 1px solid ${colors.white1};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ant-pagination-item a,
    .ant-pagination-item-active a {
      color: ${colors.gray2};
      &:hover,
      &:link,
      &:focus {
        color: ${colors.gray2};
      }

      &:hover {
        color: ${colors.gray1};
      }
    }
  `
}
