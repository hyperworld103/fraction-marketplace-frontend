import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as IoIcons from 'react-icons/io';
import { Input } from 'antd'
import { useGlobalConfig } from '../../hooks/ConfigHook'
import { useMyCollections } from '../../hooks/MyCollectionHooks'

const SidebarLink = styled(Link)`
  display: flex;
  color: #444;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: ${(props)=>props.theme.gray['1']};
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 14px;
  font-weight: 400;
  color: ${(props)=>props.theme.gray['4']}
`;

const SubLabel = styled.span`
  margin-left: 13px;
  font-size: 16px;
  font-weight: normal;
  color: ${(props)=>props.theme.gray['3']}
`;

const DropdownLink = styled(Link)`
  background: ${(props)=>props.theme.gray['0']};
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${(props)=>props.theme.gray['4']};
  font-size: 18px;
  &:hover {
    cursor: pointer;
  }
`;
const SidebarButton = styled.button`
  color: red;
  border: 1px solid red;
  border-radius: 5px;
  align-items: center;
  list-style: none;
  height: 35px;
  width: 40%;
  margin-left: 20px;
  margin-top: 10px;
  text-decoration: none;
  background: ${(props)=>props.theme.gray['0']};
  &:hover {
    background: red;
    cursor: pointer;
    color: white;
  }
`;
const SearchDiv = styled.div`
  background-color: ${(props)=>props.theme.gray['0']};
  padding-top: 20px;
`;
const SearchInput = styled(Input)`
  background: ${(props)=>props.theme.gray['0']};
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props)=>props.theme.gray['4']};
  background-clip: padding-box;
  border: 1px solid ${(props)=>props.theme.gray['2']};
  border-radius: 0.25rem;
  margin-bottom: 10px;
  width: 200px !important;
`;

const SubMenu = ({ item, handleFilter }) => {
  const [subnav, setSubnav] = useState(false);

  const SubMenuDiv = styled.div`
    ${(props) => (item.type==='button' ? 'height: 100px;line-height: 30px; background-color: '+props.theme.gray['0']+';' : '')};    
  `;

  const showSubnav = () => setSubnav(!subnav);

  const subButtonClicked = (e, v) => {
    handleFilter(v);
  }

  // let collectionData = [
  //   {
  //     title: 'Collection 1',
  //     path: '#',
  //     icon: <IoIcons.IoIosPaper style={{color: `${props=>props.theme.gray['4']}`}} />
  //   },
  //   {
  //     title: 'Collection 2',
  //     path: '#',
  //     icon: <IoIcons.IoIosPaper style={{color: `${props=>props.theme.gray['4']}`}} />
  //   },
  //   {
  //     title: 'Collection 3',
  //     path: '#',
  //     icon: <IoIcons.IoIosPaper style={{color: `${props=>props.theme.gray['4']}`}} />
  //   }
  // ];
  // const { paginationLimit } = useGlobalConfig()
  // // const [collections, setCollections] = useState(collectionData);
  // const [searchKey, setSearchKey] = useState('');

  // const { loading, hasMore, loadMore, collections } = useMyCollections(paginationLimit, searchKey)
  // const collectionSearchHandler = (e) => {
  //   e.preventDefault();
  //   setSearchKey(e.target.value);
  // }

  // useEffect(()=>{
  //   if(searchKey === '') setCollections(collectionData);
  //   let newCollection = [];
  //   for(let i = 0; i < collectionData.length; i++) {
  //     if(collectionData[i].title.search(searchKey) !== -1)
  //       newCollection.push(collectionData[i]);
  //   }
  //   setCollections(newCollection);
  // },[searchKey])

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <div>
          {/* {item.icon} */}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? <IoIcons.IoIosArrowUp style={{color: `${props=>props.theme.gray['4']}`}} />
            : item.subNav
            ? <IoIcons.IoIosArrowDown style={{color: `${props=>props.theme.gray['4']}`}} />
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        <SubMenuDiv>
          {(item.title==='Sort by'||item.title==='Price')?
            item.subNav.map((subitem, index) => {
              return (             
                <SidebarButton key={index} onClick={(e)=>subButtonClicked(e, subitem.path)}>{subitem.title}</SidebarButton>
              )
            })
            :
            // item.title==='Collections'?
            // <SearchDiv>
            //   <div style={{margin: '0 0 10px 50px'}}>
            //     <SearchInput onChange = {(e) => collectionSearchHandler(e)} value={searchKey} type='text' placeholder='Search'></SearchInput>
            //   </div>
            //   <S.CollectionDiv>
            //     {collections.map((subitem, index) => {
            //       return (
            //         <DropdownLink to={'#'} key={index}>
            //           <IoIcons.IoIosPaper style={{color: `${props=>props.theme.gray['4']}`}} />
            //           <SubLabel>{subitem.name}</SubLabel>
            //         </DropdownLink>
            //       )
            //     })}
            //   </S.CollectionDiv>
            // </SearchDiv>
            // :
            item.subNav.map((subitem, index) => {
              return (
                <DropdownLink to="#" key={index} onClick={(e)=>subButtonClicked(e, subitem.value)}>
                  {subitem.icon}
                  <SubLabel>{subitem.title}</SubLabel>
                </DropdownLink>
              )
            })
          }        
        </SubMenuDiv>
      }
    </>
  );
};

export default SubMenu;

export const S = {
  CollectionDiv: styled.div `
    height: 4rem;
    color: ${props=>props.theme.black}
  `
}