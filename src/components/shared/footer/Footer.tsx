import React from 'react'
import styled from 'styled-components'
import rectangle from '../../../../assets/rectangle.svg'
import { FooterMenu } from './FooterMenu'
import { FooterMenuSocial } from './FooterMenuSocial'

export interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className }: FooterProps) => {
  return (
    <S.Footer className={className}>
      <S.Span>© Nftfy 2021</S.Span>
      <S.Img src={rectangle} alt='' />
      <FooterMenu />
      <FooterMenuSocial />
    </S.Footer>
  )
}

const S = {
  Footer: styled.footer`
    width: 100%;
    height: 96px;
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 400;
    text-decoration: none;
    font-size: 1.4rem;
    line-height: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 24px;
    background: ${props => props.theme.white};
    @media (max-width: ${props => props.theme.viewport.desktop}) {
      padding: 0;
      justify-content: center;
    }
  `,
  Span: styled.span`
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 400;
    text-decoration: none;
    font-size: 20px;
    line-height: 2rem;
    margin-left: ${props => props.theme.margin.large};
    display: flex;
    align-items: center;
    color: ${props => props.theme.blue.main};
  `,
  Img: styled.img`
    margin: 0 ${props => props.theme.margin.medium} 0 ${props => props.theme.margin.medium};
  `
}
