import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Sort by',
    path: '#',
    type: 'button',

    subNav: [
      {
        title: 'Recent',
        path: 'recent',
      },
      {
        title: 'Most Viewed',
        path: 'mostviewed',
      },
      {
        title: 'Most Liked',
        path: 'mostliked',
      },
      {
        title: 'On Auction',
        path: 'onauction',
      }
    ]
  },
  {
    title: 'Price',
    path: '#',
    // icon: <IoIcons.IoIosPaper />,
    // iconClosed: <IoIcons.IoIosArrowDown />,
    // iconOpened: <IoIcons.IoIosArrowUp />,
    type: 'button',
    subNav: [
      {
        title: '<1ETH',
        path: '1eth',
        // icon: <IoIcons.IoIosPaper />
      },
      {
        title: '<10ETH',
        path: '10eth',
      },
      {
        title: '<100ETH',
        path: '100eth',
      },
      {
        title: '<1000ETH',
        path: '1000eth',
      }
    ]
  },
  // {
  //   title: 'Collections',
  //   path: '#',
  //   icon: <FaIcons.FaEnvelopeOpenText />,
  //   type: 'search',
  //   subNav: []
  // },
  {
    title: 'Categories',
    path: '#',
    icon: <IoIcons.IoMdHelpCircle />,
    type: 'none',
    subNav: [
      {
        title: 'Image',
        value: 'image',
        icon: <IoIcons.IoIosImages style={{color: `${props=>props.theme.gray['4']}`}} />
      },
      {
        title: 'Music',
        value: 'audio',
        icon: <IoIcons.IoIosMusicalNotes style={{color: `${props=>props.theme.gray['4']}`}} />
      },
      {
        title: 'Video',
        value: 'video',
        icon: <IoIcons.IoIosVideocam style={{color: `${props=>props.theme.gray['4']}`}} />
      }
    ]
  }
];