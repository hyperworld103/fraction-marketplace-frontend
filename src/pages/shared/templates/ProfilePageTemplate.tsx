import React, { ReactNode, useState, useEffect } from 'react'
import styled from 'styled-components'
import Sidebar from '../../../components/profile/Sidebar';
import ProfileMain from '../../../components/profile/ProfileMain';
import { Footer } from '../../../components/shared/layout/footer/Footer'

export type ProfileTemplatePageProps = {
  children: ReactNode
}

export function ProfilePageTemplate({ children }: ProfileTemplatePageProps) {

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
    <S.Main>
      <ProfileMain />
    </S.Main>   
    <Sidebar sidebarChange = {sidebarChange} />
    <S.Contents sidebar={sidebar} isSidebar={isSidebar}> 
      {children}
    </S.Contents>
    <Footer />
    </>
  )
}

export const S = {
  Main: styled.div `
    width: 100%;
    margin-top: 80px;
    background: #F6F6F6;
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      margin-top: 84px;
    }
  `,
  Contents: styled.div<{ sidebar:boolean; isSidebar: boolean; }> `
    width: 100%;
    padding: 0 24px;
    min-height: 55vh;
    background: ${props => props.theme.white};
    display: block;
    align-items: center;

    ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}

    @media (min-width: ${props => props.theme.viewport.mobile}) {
      min-height: 48vh;
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      min-height: 44.8vh;
      ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      min-height: 58.7vh;
      ${props => props.sidebar && 'padding-left: 274px !important;'}
      ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    }
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      min-height: 39.4vh;
    }
  `
}
