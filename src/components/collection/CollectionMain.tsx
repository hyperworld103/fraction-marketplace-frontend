import { Button, Image, Input } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import Navbarmenu from '../shared/layout/header/Navbarmenu'
import * as RiIcons from 'react-icons/ri';
import {useHistory} from 'react-router-dom';
import {API} from '../../constants/api';
import { deleteCollection } from '../../services/CollectionService'

export type CollectionProps = {
  contract_address: string,
  id: string,
  name: string,
  logo: string,
  banner: string,
  item_count: number,
  royalties: number,
  volume_traded: number
}

export default function CollectionMain({contract_address, id, name, logo, banner, item_count, royalties, volume_traded }: CollectionProps) {
  const history = useHistory();
  const [isMenu, setisMenu] = useState(false);
  const [isResponsiveclose, setResponsiveclose] = useState(false);
  const [isSubMenuCreate, setSubMenuCreate] = useState(false);
  
  let createSubMenuClass = ["sub__menus"];
  if(isSubMenuCreate) {
      createSubMenuClass.push('sub__menus__Active');
  }else {
      createSubMenuClass.push('');
  }

  const sortHandle = async (e:any, val:string) => {
    e.preventDefault();
    setisMenu(isMenu === false ? true : false);
    setResponsiveclose(isResponsiveclose === false ? true : false);
    if(val === '/collection/mycollection'){
      let data = {collection_id: id};
      let result = await deleteCollection(data);
      if(!result) return;
    }
    history.push(val);
  };
  const createSubmenu = () => {
      setSubMenuCreate(isSubMenuCreate === false ? true : false);
  };

  console.log("contract addr", contract_address);
  return (
    <S.Container>
      <Navbarmenu />
      <S.BannerImage>
        {banner !== ''&&
          <img src={banner&&API.server_url + API.collection_banner_image + banner} alt='' style={{width: '100%', objectFit: 'cover', height: 'auto', maxHeight: '250px'}} />
        }
      </S.BannerImage>
      <S.LogoDiv>
        <S.LogoImg src={logo&&API.server_url + API.collection_logo_image + logo} alt='' />  
      </S.LogoDiv>
      <div style={{float: 'right', marginTop: '-50px'}}>
        {/* <S.SettingButton>
          <RiIcons.RiSettings2Line style={{width: '25px', fontSize: '18px'}} />
        </S.SettingButton>
        <S.SettingInput type='submit' onClick={handleItemBtn}/> */}
        <S.SettingButton onClick={createSubmenu} className="sub__menus__arrows">
          <RiIcons.RiSettings2Line style={{width: '25px', fontSize: '18px', margin: '-6px 0 0 -13px'}} />
          <S.SettingsUl className={createSubMenuClass.join(' ')} > 
              <li className='sub-item' style={{borderBottom: '0px'}}> <S.SettingsLink onClick={(e:any)=>sortHandle(e, '/create/' + id + '/image')}> Add Item </S.SettingsLink> </li>
              <li className='sub-item' style={{borderBottom: '0px'}}><S.SettingsLink onClick={(e:any)=>sortHandle(e, '/edit/collection/' + contract_address)}> Edit Collection </S.SettingsLink> </li>
              <li className='sub-item' style={{borderBottom: '0px'}}><S.SettingsLink onClick={(e:any)=>sortHandle(e, '/collection/mycollection')}> Delete Collection </S.SettingsLink> </li>
              <li className='sub-item' style={{borderBottom: '0px'}}><S.SettingsLink onClick={(e:any)=>sortHandle(e, '/Activity')}> Activity </S.SettingsLink> </li>
          </S.SettingsUl>
        </S.SettingButton>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '20px'}}>
        <span style={{fontSize: '25px', fontWeight: 'bold'}}>{name}</span>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '10px', paddingBottom: '30px'}}>        
        <S.InfoDiv>
          {item_count}
          <div>Items</div>
        </S.InfoDiv>
        <S.InfoDiv>
          {royalties}
          <div>Royalties</div>
        </S.InfoDiv>
        <S.InfoDiv>
          {volume_traded}
          <div>Volume Traded</div>
        </S.InfoDiv>
      </div>
    </S.Container>
  )
}

const S = {  
  SettingsLink: styled.div`
  color: ${props => props.theme.black};
  margin: 0 0 0 10px;
  background: ${props => props.theme.white};
  width: 100%;
  border: 0px;
  font-size: 15px;
  line-height: 2rem;
  &:hover,
  &:active,
  &:focus {
    background: ${props => props.theme.white};
  }
`,
SettingsUl: styled.ul `
  background: ${props => props.theme.white};
  width: 140px;
  margin-left: -100px !important;
  margin-top: 15px;
  text-align: left;
  @media (min-width: ${props => props.theme.viewport.desktop}) {
    margin-left: 5px;
  }
`,
  InfoDiv: styled.div `
    display: inline-block;
    font-size: 20px;
    width: 100px;
    height: 70px;
    padding-top: 5px;
    border: 1px solid ${props=>props.theme.gray['1']};
    color: ${props=>props.theme.gray['4']};

    > div {
      font-size: 13px;
      color: ${props=>props.theme.gray['3']};
    }
  `,
  Container: styled.div `
    margin-top: -12px;
    background: ${(props)=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
  `,
  LogoImg: styled(Image) `
    width: 125px;
    height: 125px;
    objectFit: cover;
    border: 1px solid rgb(159 156 156);
  `,
  LogoInput: styled(Input)`
    opacity: 0;
    appearance: none;
    cursor: pointer;
    align-items: baseline;
    border-radius: 50%;
    color: inherit; 
    width: 115px;
    height: 115px;
    margin-left: -120px;

    &:hover,
    &:active,
    &:focus {
      background-color: rgb(150, 150, 150);
      opacity: 1;
    }
  `,
  SettingInput: styled(Input)`
    opacity: 0;
    position: relative;
    width: 35px;
    height: 35px;
    appearance: none;
    cursor: default;
    align-items: baseline;
    color: inherit;
    text-overflow: ellipsis;
    white-space: pre;
    text-align: start !important;  
    background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
    margin-left: -35px;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
  `,
  SettingButton: styled(Button)`
    background-color: ${(props)=>props.theme.gray['1']} !important;
    color: ${(props)=>props.theme.gray['3']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    box-shadow: none;
    position: relative;
    width: 35px;
    height: 35px;
    padding: 4px 0 0 0;
    margin: 0px 5px;
  `,
    BannerInput: styled(Input)`
    opacity: 0;
    position: absolute;
    width: 35px;
    height: 35px;
    top: 90px;
    right: 5px;
    appearance: none;
    cursor: default;
    align-items: baseline;
    color: inherit;
    text-overflow: ellipsis;
    white-space: pre;
    text-align: start !important;  
    background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
    margin: 0em;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
  `,
  BannerButton: styled(Button)`
    background-color: ${(props)=>props.theme.gray['1']} !important;
    color: ${(props)=>props.theme.gray['3']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    box-shadow: none;
    position: absolute;
    width: 35px;
    height: 35px;
    top: 90px;
    right: 5px;
    padding: 0 0 0 3px;
  `,
  BannerImage: styled.div`
    width: 100%;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${props=>props.theme.gray['1']};
  `,
  LogoDiv: styled.div`
    width: 100%;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -62px;
    background: transparent;
  `
}
