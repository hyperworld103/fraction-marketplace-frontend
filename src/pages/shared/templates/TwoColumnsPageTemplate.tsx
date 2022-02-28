import React, { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import arrowLeft from '../../../assets/icons/arrow-left.svg'
import { DefaultPageTemplate } from './DefaultPageTemplate'

export type TwoColumnsPageTemplateProps = {
  className?: string
  topLeftContainer: ReactNode
  topRightContainer: ReactNode
  bottomContainer?: ReactNode
  canGoBack?: boolean
}

export default function TwoColumnsPageTemplate({
  canGoBack = false,
  topLeftContainer,
  topRightContainer,
  bottomContainer
}: TwoColumnsPageTemplateProps) {
  const history = useHistory()

  const goBack = () => {
    history.goBack()
  }

  return (
    <DefaultPageTemplate bgGray>
      {canGoBack && (
        <S.GoBack type='button' onClick={() => goBack()}>
          <img src={arrowLeft} alt='Go back' />
          <span>Back</span>
        </S.GoBack>
      )}
      <S.TopContainer>
        <S.GrayContainer>{topLeftContainer}</S.GrayContainer>
        <S.WhiteContainer>{topRightContainer}</S.WhiteContainer>
      </S.TopContainer>
      {bottomContainer && <S.BottomContainer>{bottomContainer}</S.BottomContainer>}
    </DefaultPageTemplate>
  )
}

const S = {
  TopContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 48px;

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      flex-direction: row;
    }
  `,
  GrayContainer: styled.div`
    flex: 1.1;
    width: 100%;
  `,
  WhiteContainer: styled.div`
    flex: 0.9;
    background-color: ${props => props.theme.white};
    border-radius: 16px;
  `,
  GoBack: styled.button`
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background: ${props => props.theme.gray[0]};
    color: ${props => props.theme.gray[4]};
    cursor: pointer;
    margin-bottom: 24px;

    > img {
      height: 8px;
      width: 9px;
      margin-right: 6px;
    }
    span {
      font-size: 14px;
      line-height: 18px;
    }
  `,
  BottomContainer: styled.div`
    border-radius: 16px;
    background-color: ${props => props.theme.white};
    flex: 2;
  `
}
