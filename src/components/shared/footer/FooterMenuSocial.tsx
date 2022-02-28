import React from 'react'
import styled from 'styled-components'
import discordIcon from '../../../../assets/icons/social-network/discordIcon.svg'
import githubIcon from '../../../../assets/icons/social-network/githubIcon.svg'
import linkedInIcon from '../../../../assets/icons/social-network/linkedInIcon.svg'
import telegramIcon from '../../../../assets/icons/social-network/telegramIcon.svg'
import twitterIcon from '../../../../assets/icons/social-network/twitterIcon.svg'

export const FooterMenuSocial: React.FC = () => {
  return (
    <S.FooterMenu>
      <S.LinkItem href='https://www.linkedin.com/company/nftfy/' target='_blank'>
        <img src={linkedInIcon} alt='linkedIn' />
      </S.LinkItem>
      <S.LinkItem href='https://discord.gg/zyuawXTtrK' target='_blank'>
        <img src={discordIcon} alt='discord' />
      </S.LinkItem>
      <S.LinkItem href='https://twitter.com/nftfyofficial' target='_blank'>
        <img src={twitterIcon} alt='twitter' />
      </S.LinkItem>
      <S.LinkItem href='https://github.com/nftfy' target='_blank'>
        <img src={githubIcon} alt='github' />
      </S.LinkItem>
      <S.LinkItem href='https://t.me/nftfySec' target='_blank'>
        <img src={telegramIcon} alt='telegram' />
      </S.LinkItem>
    </S.FooterMenu>
  )
}

const S = {
  FooterMenu: styled.nav`
    margin-left: auto;
    margin-right: ${props => props.theme.margin.medium};
  `,
  LinkItem: styled.a`
    width: 16px;
    height: 16px;
    text-decoration: none;
    cursor: pointer;
    & + a {
      margin-left: 18px;
    }
    img {
      color: ${props => props.theme.blue.main};
    }
    &:hover {
      color: ${props => props.theme.blue.main};
    }
    @media (max-width: ${props => props.theme.viewport.desktop}) {
      display: none;
    }
  `
}
