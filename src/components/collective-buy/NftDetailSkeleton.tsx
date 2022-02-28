import React from 'react'
import { Skeleton, Spin } from 'antd'
import styled from 'styled-components'

export const NftDetailSkeleton = () => {
  return (
    <S.Body>
      <Spin indicator={<Skeleton.Avatar active size={64} shape='circle' />} />
    </S.Body>
  )
}
const S = {
  Body: styled.div`
    display: flex;
    gap: 24px;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 522px;
    .ant-skeleton {
      width: 100%;
      height: 60px;
    }

    @media (max-width: ${props => props.theme.viewport.desktop}) {
      min-height: 30vh;
    }
  `
}
