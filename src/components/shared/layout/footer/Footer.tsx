import React from 'react'
import styled from 'styled-components'

export interface FooterProps {
  className?: string
}
 
export const Footer: React.FC<FooterProps> = ({ className }: FooterProps) => {
  return (
    <S.Footer className={className}>
      <S.Span>Copyright @2021 CryptoTrades All Rights Reserved</S.Span>
    </S.Footer>
  )
}

const S = {
  Footer: styled.footer`
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    background: ${props => props.theme.white};
    position: absolute;
  `,
  Span: styled.span`
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 400;
    text-decoration: none;
    font-size: 16px;
    color: ${props => props.theme.black};
    padding: 11px;
  `
}
