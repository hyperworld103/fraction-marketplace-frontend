import React from 'react'
import styled from 'styled-components'
import { viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { Activity } from '../components/shared/Activity'

export default function ActivityPage() {

  return (
    <DefaultPageTemplate noMargin fullWidth>
      <S.Container>        
        <Activity />
      </S.Container>
    </DefaultPageTemplate>
  )
}

export const S = {
  Container: styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 30px;
    width: 100%;
    @media (min-width: ${viewport.sm}) {
      max-width: 80%;
    }
    @media (min-width: ${viewport.md}) {
      max-width: 80%;
  `
}
