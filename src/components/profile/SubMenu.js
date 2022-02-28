import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: ${(props)=>props.theme.gray['4']} !important;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: ${(props)=>props.theme.gray['0']};
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 14px;
  font-size: 16px;
  margin-bottom: 5px;
`;


const SubMenu = ({ item }) => {

  return (
    <>
      <SidebarLink to={item.path}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
      </SidebarLink>  
    </>
  );
};

export default SubMenu;