import React from 'react'
import styled from 'styled-components'
import howItWorksInfo from '../../assets/collective-buy/how-it-works.svg'

export const HowItWorks = () => {
  return (
    <S.Content>
      <div>
        <h3>How it works</h3>
        <p>Now you can sell your NFT to a group of people in a very simple way!</p>
        <p>
          After choosing the NFT you want to sell, the first thing you need to do is to set the reserve price for it, which will be the
          minimum value you would like it to be sold for. Now, anyone can participate in the purchase of your NFT, by joining with the
          amount they want and getting the right to a proportional amount of its Fractions. Once the reserve price is met, it will trigger a
          countdown, according to the timer you set, allowing other users to join the sale and consequently increasing the final value of
          your NFT.
        </p>
        <p>
          By the end of the countdown, the NFT will be Fractionalized and the Fractions will be distributed among the participants. The
          accumulated amount in the sale will be sent to your wallet’s address, discounting a 5% fee that goes to the protocol.
        </p>
      </div>
      <img src={howItWorksInfo} alt='Explaining how it works' />
    </S.Content>
  )
}
const S = {
  Content: styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: ${props => props.theme.margin.small};
    width: 100%;
    padding: ${props => props.theme.margin.small};
    margin-top: ${props => props.theme.margin.medium};

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      gap: ${props => props.theme.margin.medium};
      margin-top: ${props => props.theme.margin.large};
      padding: ${props => props.theme.margin.medium};
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      flex-direction: row;
    }

    > div {
      display: flex;
      flex-direction: column;
      gap: 40px;

      > h3 {
        font-size: 40px;
        line-height: 54px;
        color: ${props => props.theme.gray['4']};
      }

      > p {
        font-size: 24px;
        line-height: 32px;
        color: ${props => props.theme.gray['4']};
      }
    }
  `
}
