import React from 'react'
import styled from 'styled-components'
import nftfyBnb from '../assets/icons/bnb-nftfy.png'
import nftfyDai from '../assets/icons/dai-nftfy.png'
import nftfyWeth from '../assets/icons/weth-nftfy.svg'
import nftfyBusd from '../assets/nftfy-busd.svg'
import { FarmForm } from '../components/farm/FarmForm'
import { useGlobalConfig } from '../hooks/ConfigHook'
import { viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function FarmPage() {
  const { farms } = useGlobalConfig()
  const { wethNftfy, daiNftfy, bnbNftfy, busdNftfy } = farms

  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.Content>
          <FarmForm icon={nftfyDai} {...daiNftfy} />
          <FarmForm icon={nftfyWeth} {...wethNftfy} />
        </S.Content>
        <S.Content>
          <FarmForm icon={nftfyBusd} {...busdNftfy} />
          <FarmForm icon={nftfyBnb} {...bnbNftfy} />
        </S.Content>
      </S.Container>
    </DefaultPageTemplate>
  )
}

export const S = {
  Container: styled.div`
    margin: 0 auto;
    min-height: calc(100vh - 96px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `,
  Content: styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 32px;
    margin-top: 32px;

    > div:first-child {
      margin-right: 20px;
    }

    @media (max-width: ${viewport.xl}) {
      > div:first-child {
        margin-right: 0px;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      padding: 5px;
      flex-direction: column;
    }
  `
}
