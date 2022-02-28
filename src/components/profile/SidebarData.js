import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Collected',
    path: '/profile/collected',
    icon: <AiIcons.AiOutlineMoneyCollect style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'button'
  },
  {
    title: 'Created',
    path: '/profile/created',
    icon: <AiIcons.AiOutlinePlusSquare style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'button'
  },
  {
    title: 'Favorited',
    path: '/profile/favorited',
    icon: <IoIcons.IoIosHeartEmpty style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,

    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'search'
  },
  {
    title: 'Activity',
    path: '/profile/activity',
    icon: <FaIcons.FaDolly style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'none'
  },
  {
    title: 'Offers',
    path: '/profile/offers',
    icon: <IoIcons.IoIosList style={{marginBottom: '-3px', color: `${props=>props.theme.gray['4']}`}} />,
    
    iconClosed: <IoIcons.IoIosArrowDown />,
    iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'none'
  }
];