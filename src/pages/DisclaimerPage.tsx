import React from 'react'
import styled from 'styled-components'
import { viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function DisclaimerPage() {
  return (
    <DefaultPageTemplate>
      <S.Content>
        <h2>Disclaimer</h2>
        <p>
          *Nftfy tokens are not destined for the general public and the investment in such digital assets is subject to regulatory
          restrictions and obligations related to the jurisdiction of each investor. The investment of individuals and/or legal entities in
          such assets will be carefully analyzed and may not be allowed and/or accepted if a potential breach to a regulation or legislation
          would occur by virtue of such investment. Nftfy retains and shall retain at all times the right to prohibit and select the
          investors which shall participate on, including but not limited to, liquidity events, at its sole discretion, based on legal and
          regulatory analysis.
        </p>
        <p>
          *The offering of Nftfy tokens is restricted to jurisdictions in which Nftfy is authorized to offer such digital assets, including
          British Virgin Islands and Cayman Islands, and is not destined to any jurisdiction subject to regulatory restrictions, including
          but not limited to Brazil, EUA, and China.
        </p>
        <p>
          *The offering of Nftfy tokens is not destined to investors resident in Brazil, EUA, China, Venezuela, Iran, North Korea, Syria,
          Yemen.
        </p>
      </S.Content>
    </DefaultPageTemplate>
  )
}

export const S = {
  Content: styled.div`
    max-width: 650px;
    font-weight: 400;
    margin-top: 90px;

    @media (max-width: ${viewport.sm}) {
      margin-top: 32px;
      padding: 0 32px;
    }

    > h2 {
      font-size: 40px;
      line-height: 52px;
      margin-bottom: 32px;
    }

    > p {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 24px;
    }
  `
}
