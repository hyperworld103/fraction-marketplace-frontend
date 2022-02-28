import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import Image404 from '../assets/404/ErrorImage.svg'
import { colors, fonts, viewportV2 } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export const Page404 = () => {
  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.Content>
          <img src={Image404} alt='404' />
          <h1>This page is lost.</h1>
          <p>We’ve explore deep and wide, but we can’t find the page you were looking for.</p>
          <S.ButtonAction href='/'> Navigate back home</S.ButtonAction>
        </S.Content>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  Container: styled.div`
    min-height: calc(100vh - 96px);
    display: flex;
    width: 100%;
    max-width: ${viewportV2.desktopXl};
    margin: 0 auto;
  `,
  Content: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      max-width: 368px;
      height: auto;
    }

    h1 {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
      font-size: 40px;
      line-height: 52px;
      color: ${colors.gray11};
      margin-bottom: 19px;
    }

    p {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 26px;
      color: ${colors.gray0};
      max-width: 420px;
      text-align: center;
      margin-bottom: 41px;
    }
  `,
  ButtonAction: styled(Button)`
    border: none;
    border-radius: 8px;
    background: ${colors.blue1};
    color: ${colors.white};
    width: 248px;
    height: 40px;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &:active,
    &:focus {
      background: ${colors.blue2};
      color: ${colors.white};
    }
  `
}
