import { Skeleton, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'

export const LoadingSkeleton: React.FC = () => {
  return (
    <>
      <S.Content>
        <S.DivLine>
          <Spin indicator={<Skeleton.Avatar active size={48} shape='square' />} spinning />
          <Skeleton active paragraph={{ rows: 0 }} />
        </S.DivLine>
        <S.DivLine>
          <Spin indicator={<Skeleton.Avatar active size={48} shape='square' />} spinning />
          <Skeleton active paragraph={{ rows: 0 }} />
        </S.DivLine>
        <S.DivLine>
          <Spin indicator={<Skeleton.Avatar active size={48} shape='square' />} spinning />
          <Skeleton active paragraph={{ rows: 0 }} />
        </S.DivLine>
      </S.Content>
    </>
  )
}
export const S = {
  Content: styled.div`
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    &:first-child {
      padding-top: 48px;
    }
  `,
  DivLine: styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 18px;
    .ant-spin {
      padding-right: 10px;
      .ant-skeleton {
        .ant-skeleton-avatar {
          border-radius: 8px;
        }
      }
    }
    .ant-skeleton {
      .ant-skeleton-content {
        h3 {
          width: 90% !important;
        }
      }
    }
  `
}
