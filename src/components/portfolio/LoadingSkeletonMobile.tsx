import { Skeleton, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'

export const LoadingSkeletonMobile: React.FC = () => {
  return (
    <>
      <S.PanelHeader>
        <Spin indicator={<Skeleton.Avatar active size={48} shape='square' />} spinning />
        <S.PanelDivInfo>
          <S.PriceDiv>
            <Skeleton.Input style={{ width: 250 }} active size='small' />
          </S.PriceDiv>
          <S.BalanceDiv>
            <Skeleton.Input style={{ width: 250 }} active size='small' />
          </S.BalanceDiv>
          <S.BalanceDiv>
            <Skeleton.Input style={{ width: 250 }} active size='small' />
          </S.BalanceDiv>
        </S.PanelDivInfo>
      </S.PanelHeader>
    </>
  )
}
export const S = {
  PanelHeader: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    align-items: center;
    span.ant-skeleton-avatar.ant-skeleton-avatar-square.ant-spin-dot {
      margin-right: 16px;
    }
    .ant-skeleton.ant-skeleton-element.ant-skeleton-active {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ant-skeleton.ant-skeleton-element.ant-skeleton-active.ant-spin-dot {
      height: 48px;
    }
    span.ant-skeleton-avatar.ant-skeleton-avatar-square.ant-spin-dot {
      border-radius: 8px;
    }
  `,
  PanelDivInfo: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  PriceDiv: styled.div`
    display: flex;
    flex-direction: row;
    span.ant-skeleton-input.ant-skeleton-input-sm {
      height: 12px;
    }
  `,
  BalanceDiv: styled.div`
    display: flex;
    flex-direction: row;
    span.ant-skeleton-input.ant-skeleton-input-sm {
      margin-right: 20px;
      height: 12px;
      margin-top: 4px;
    }
  `
}
