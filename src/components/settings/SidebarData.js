import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Wallet',
    path: '/settings/wallet',
    icon: <AiIcons.AiOutlineMoneyCollect style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'button'
  },
  {
    title: 'General',
    path: '/settings/general',
    icon: <AiIcons.AiOutlinePlusSquare style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'button'
  },
  {
    title: 'Update Password',
    path: '/settings/changepassword',
    icon: <IoIcons.IoIosHeartEmpty style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,

    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'search'
  },
  {
    title: 'Logout',
    path: '#',
    icon: <FaIcons.FaDolly style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'none'
  }
];