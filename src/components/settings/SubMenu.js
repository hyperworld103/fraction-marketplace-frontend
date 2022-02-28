import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {AppContext} from '../../contexts'
import Cookies from 'universal-cookie';

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
    background: ${(props)=>props.theme.gray['2']};
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 14px;
  font-size: 16px;
  margin-bottom: 5px;
`;


const SubMenu = ({ item }) => {
  const history = useHistory();
  const { setUser } = useContext(AppContext)

  const onClicked = () => {
    if(item.path !== '#') return;
    const cookies = new Cookies();
    cookies.remove("token", {path: "/"}) 
    setUser({    
        authenticated: false,
        user_id: "",
        username: "", 
        email: "",
        exp: 0,
        first_name: "",
        last_name: "",
        phone: "",
        private_key: "",
        public_key: "",
        profile_cover: "",
        profile_image: "",
        role: 2,
        status: ""});
    history.push('/');
  }
  return (
    <>
      <SidebarLink to={item.path} onClick={onClicked}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
      </SidebarLink>  
    </>
  );
};

export default SubMenu;