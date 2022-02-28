import React, { ReactNode, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import Navbarmenu from '../../../components/shared/layout/header/Navbarmenu'
import Sidebar from '../../../components/settings/Sidebar';
import { Footer } from '../../../components/shared/layout/footer/Footer'

export type ProfileTemplatePageProps = {
  children: ReactNode
}

export function SettingsPageTemplate({ children }: ProfileTemplatePageProps) {

  const[sidebar, setSidebar] = useState(false);
  const sidebarChange = () => {
    setSidebar(!sidebar);
  }

  const [isSidebar, setIsSidebar] = useState(false);
  useEffect(()=>{
    if(sidebar !== undefined) setIsSidebar(true);
  })

  return (
    <>    
    <Navbarmenu />
    <Sidebar sidebarChange = {sidebarChange} />
    <S.Container sidebar={sidebar} isSidebar={isSidebar}> 
      <S.Content>
        {children}
      </S.Content>      
    </S.Container>
    <Footer />
    </>
  )
}

export const S = {
  Container: styled.div<{ sidebar:boolean; isSidebar: boolean; }> `
    width: 100%;
    min-height: 80.2vh;
    padding: 24px;
    background: ${props => props.theme.white};
    display: block;
    align-items: center;
    margin-top: 60px;

    ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}

    @media (min-width: ${props => props.theme.viewport.mobile}) {
      min-height: 85.5vh;
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      min-height: 89.5vh;
      padding: ${props => props.theme.margin.small};
      ${props =>
        css`
          padding: ${props.noMargin ? 0 : props.theme.margin.small}};
        `}
      ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      min-height: 92.2vh;
      padding: ${props => props.theme.margin.small};
      ${props =>
        css`
          padding: ${props.noMargin ? 0 : props.theme.margin.small};
        `}
      ${props => props.sidebar && 'padding-left: 274px !important;'}
      ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    }
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      min-height: 88.6vh;
    }
  `,
  Content: styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    border-radius: 5px;
    border: 1px solid ${props=>props.theme.gray['2']};
    color: ${props=>props.theme.gray['4']};

    header {
      width: 100%;
      padding: 0.75rem 1.25rem;
      color: ${props=>props.theme.gray['4']};
      margin-bottom: 0;
      background-color: ${props=>props.theme.gray['0']};
      border-bottom: 1px solid ${props=>props.theme.gray['2']};
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      grid-template-columns: repeat(4, 1fr);
    }
  `
}
