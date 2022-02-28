import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import * as IoIcons from 'react-icons/io';

const NavIcon = styled(Link)`
  font-size: 2rem;
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid ${(props)=>props.theme.gray['2']};
  color: ${(props)=>props.theme.gray['4']} !important;
  justify-content: space-between;
`;

const SidebarNav = styled.nav`
  background: ${props=>props.theme.gray['0']};
  width: 250px;
  min-height: 78vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 80px;
  color: ${props=>props.theme.gray['4']} !important;
  left: ${({ sidebar }) => (sidebar ? '0' : '-200px')};
  transition: 350ms;
  z-index: 10;
  overflow-y: scroll;
  scrollbar-width: none;
  @media (min-width: ${props => props.theme.viewport.mobile}) {
    min-height: 82vh;
  }
  @media (min-width: ${props => props.theme.viewport.tablet}) {
    min-height: 87vh;
  }
  @media (min-width: ${props => props.theme.viewport.desktop}) {
    min-height: 90.6vh;
  }
  @media (min-width: ${props => props.theme.viewport.desktopXl}) {
    min-height: 91.6vh;
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = ({sidebarChange}) => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
    sidebarChange();
  }

  return (
    <>
      <IconContext.Provider value={{ color: '#000000' }}>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <div>
                <div style={{fontSize: '16px',display: 'inline-block', marginLeft: '20px', marginBottom: '20px'}}>Settings Menu</div>                
              </div>
              {sidebar? 
                <IoIcons.IoIosArrowRoundBack onClick={showSidebar} style={{ marginRight: '10px', color: `${props=>props.theme.gray['4']}`}} />
                :
                <IoIcons.IoIosArrowRoundForward onClick={showSidebar} style={{ marginRight: '10px', color: `${props=>props.theme.gray['4']}`}} />
              }
            </NavIcon>
            {sidebar&& SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;