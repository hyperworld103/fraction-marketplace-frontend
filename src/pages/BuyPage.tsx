import { useReactiveVar } from '@apollo/client/react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EthImageBuy from '../assets/nftfy-bal.png'
import BscImageBuy from '../assets/nftfy-pancake.svg'
import { SectionBuy } from '../components/shared/SectionBuy'
import { chainIdVar } from '../graphql/variables/WalletVariable'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function BuyPage() {
  const chainId = useReactiveVar(chainIdVar)
  const [network, setNetwork] = useState('ETH')

  useEffect(() => {
    if (chainId === 56 || chainId === 97) {
      setNetwork('BSC')
    } else if (chainId === 1 || chainId === 42) {
      setNetwork('ETH')
    }
  }, [chainId])

  return (
    <DefaultPageTemplate>
      <S.Container>
        {network === 'ETH' && (
          <SectionBuy
            title='NFTFY on Balancer'
            image={EthImageBuy}
            link='https://app.balancer.fi/#/trade/0x6b175474e89094c44da98b954eedeac495271d0f/0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c'
            nftfyToken='0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c'
          />
        )}
        {network === 'BSC' && (
          <SectionBuy
            title='NFTFY on Pancake SWAP'
            image={BscImageBuy}
            link='https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c'
            nftfyToken='0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c'
          />
        )}
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
  `
}
