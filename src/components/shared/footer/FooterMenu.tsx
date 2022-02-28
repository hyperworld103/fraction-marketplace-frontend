import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { popupModalVar } from '../../../graphql/variables/PopupVariables'
// import { PopupModal } from '../../PopulopModal'

export const FooterMenu: React.FC = () => {
  const openModal = () => {
    popupModalVar(true)
  }
  return (
    <S.Menu>
      {/* <PopupModal /> */}
      <S.LinkItem to='/disclaimer'>Disclaimer</S.LinkItem>
      <S.LinkItem to='#' onClick={openModal}>
        Newsletter
      </S.LinkItem>
    </S.Menu>
  )
}

const S = {
  Menu: styled.nav`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  LinkItem: styled(Link)`
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 400;
    text-decoration: none;
    font-size: 18px;
    line-height: 2rem;
    display: flex;
    align-items: center;
    color: ${props => props.theme.gray[3]};
    display: flex;
    align-items: center;
    margin-right: ${props => props.theme.margin.medium};
    &:hover {
      color: ${props => props.theme.blue.main};
    }
  `
}
