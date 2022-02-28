import { Skeleton } from 'antd'
import React from 'react'
import styled from 'styled-components'

export function ListingContainerSkeleton() {
  return (
    <S.Content>
      <Skeleton active />
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    padding: 20px 40px;

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      padding: 40px 80px;
    }
  `
}
