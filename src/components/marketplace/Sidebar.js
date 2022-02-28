import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import * as IoIcons from 'react-icons/io';
import {AppContext} from '../../contexts'

const NavIcon = styled(Link)`
  font-size: 2rem;
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid ${props=>props.theme.gray['1']};
  justify-content: space-between;
`;

const SidebarNav = styled.nav`
  background: #f7fbfb;
  width: 300px;
  height: 90vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 80px;
  left: ${({ sidebar }) => (sidebar ? '0' : '-250px')};
  transition: 350ms;
  overflow-y: scroll;
  scrollbar-width: none;
  padding: 1px;
  background: ${(props)=>props.theme.white};
  z-index: 100;
  @media (min-width: ${props => props.theme.viewport.tablet}) {
    height: 95vh;
  }
  @media (min-width: ${props => props.theme.viewport.desktopl}) {
    top: 85px;
    height: 80vh;
  }
  @media (min-width: ${props => props.theme.viewport.desktopXl}) {
    top: 85px;
    height: 89vh;
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = ({sidebarChange, handleFilter}) => {
  const [sidebar, setSidebar] = useState(false);
  const [color, setColor] = useState('#5C5C5C')
  const { theme } = useContext(AppContext);

  const showSidebar = () => {
    setSidebar(!sidebar);
    sidebarChange();
  }

  const FilterIcon = ()=> {
    return (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 30 30" height="1em" width="1em" style={{display: 'inline-block', marginBottom: '-15px'}}>
        <g>
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fillRule="nonzero" d="M14 14v6l-4 2v-8L4 5V3h16v2l-6 9zM6.404 5L12 13.394 17.596 5H6.404z"></path>
        </g>
      </svg>
    );
  }

  useEffect(()=>{
      if(theme.theme==='dark'){
          setColor('rgb(211 164 164)')
      } else {
          setColor('#5C5C5C')
      }
  })

  return (
    <>
      <IconContext.Provider value={{ color: '#000000' }}>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <div>
                <FilterIcon />
                <div style={{fontSize: '16px',display: 'inline-block', marginBottom: '20px'}}>Filter</div>                
              </div>
              {sidebar? 
                <IoIcons.IoIosArrowRoundBack onClick={showSidebar} style={{ marginRight: '10px', color: color}} />
                :
                <IoIcons.IoIosArrowRoundForward onClick={showSidebar} style={{ marginRight: '10px', color: color}} />
              }
            </NavIcon>
            {sidebar&& SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} handleFilter = {handleFilter} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;