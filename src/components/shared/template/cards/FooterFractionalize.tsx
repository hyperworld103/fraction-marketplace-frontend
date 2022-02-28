import React from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { colorsV2 } from '../../../../styles/variables'

export type FooterFractionalizeParams = {
  name: string
  loading?: boolean
}
export function FooterFractionalize({ name, loading }: FooterFractionalizeParams) {
  return (
    <S.ContainerFooterFractionalize>
      <Skeleton loading={!!loading} active paragraph={{ rows: 0 }}>
        <h2>{name}</h2>
      </Skeleton>
    </S.ContainerFooterFractionalize>
  )
}
const S = {
  ContainerFooterFractionalize: styled.div`
    height: 80px;
    display: flex;
    align-items: center;
    padding-left: 24px;

    h2 {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 33px;
      color: ${colorsV2.black};
    }

    .ant-skeleton-content .ant-skeleton-title {
      height: 28px;
    }
  `
}
