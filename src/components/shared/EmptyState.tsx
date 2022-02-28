import { Empty } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { viewportMargin, viewportV2 } from '../../styles/variables'

export default function EmptyState() {
  return (
    <S.Container>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    margin: 0 auto 24px;
    div {
      &.ant-empty-normal {
        margin: 0 auto 32px;
      }
      &.ant-empty-description {
        color: ${props=>props.theme.black};
      }
    }
    @media (min-width: ${viewportV2.tablet}) {
      margin-bottom: ${viewportMargin.tablet};
    }

    @media (min-width: ${viewportV2.desktop}) {
      margin-bottom: ${viewportMargin.desktop};
    }
  `
}
