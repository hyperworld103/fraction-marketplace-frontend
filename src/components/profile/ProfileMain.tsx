import { Button, Image, Input } from 'antd'
import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import Navbarmenu from '../shared/layout/header/Navbarmenu'
import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';
import {useHistory} from 'react-router-dom';
import {AppContext} from '../../contexts';
import {API} from '../../constants/api';
import {imageUpload, updateImageInfo} from '../../services/UserService';
import { notifyWarning } from '../../services/NotificationService'
import * as IoIcons from 'react-icons/io';

export default function ProfileMain() {
  const history = useHistory();
  const {user, setUser, theme} =  useContext(AppContext);
  const [opacity, setOpacity] = useState(0);
  const onSubmit = () => {
    history.push('/settings/wallet')
  }
  const onShow = () => {
    setOpacity(0.99);
  }
  const onHide = () => {
    setOpacity(0);
  }

  const onFileChange = async (e:any, field:string) => {
    let isImage = true;
    const timestamp = Date.now();
    let image = e.target.files;
    let formData = new FormData();
    let filename = Math.random().toString() + timestamp + '.jpg';
    for (const key of Object.keys(image)) {
      if ( /\.(jpe?g|png|gif|bmp)$/i.test(image[key].name) === false ) { isImage = false; break; }
      formData.append('file', image[key], filename)
    }
    if(!isImage){
      notifyWarning('Not image format')
      return;
    }
    const isUploaded = await imageUpload(formData, field);
    if(isUploaded){
      let data = {};
      if(field === 'profile_image'){
        data = {email: user.email, profile_image: filename};
      } else {
        data = {email: user.email, profile_cover: filename};
      }
      
      const userdata = await updateImageInfo(data, field);
      if(userdata !== {}){    
        setUser({
          authenticated: true,
          username: userdata['username'], 
          email: userdata['email'],
          exp: userdata['exp'],
          first_name: userdata['first_name'],
          last_name: userdata['last_name'],
          phone: userdata['phone'],
          private_key: userdata['private_key'],
          public_key: userdata['public_key'],
          profile_cover: userdata['profile_cover'],
          profile_image: userdata['profile_image'],
          paypal: userdata['paypal'],
          role: userdata['role'],
          status: userdata['status']
        })
      }
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(user.public_key);
    notifyWarning('Wallet address copied')
  }

  return (
    <S.Container>
      <Navbarmenu />
      <S.BannerImage>
        {user.profile_cover!==''&&
          <img src={API.server_url + API.user_profile_cover + user.profile_cover} alt='' style={{width: '100%', objectFit: 'cover', height: 'auto', maxHeight: '250px'}} />
        }
        <S.BannerButton>
          <FaIcons.FaRegEdit style={{width: '25px'}} />
        </S.BannerButton>
        <S.BannerInput type='file' name='banner' onChange={(e:any) => onFileChange(e, 'profile_cover')}/>
      </S.BannerImage>
      <S.LogoDiv>
        {user.profile_image===''?
          <S.LogoImg src={API.server_url + API.user_profile_image + theme.theme + 'nouser.jpg'} alt='' /> 
          :
          <S.LogoImg src={API.server_url + API.user_profile_image + user.profile_image} alt='' /> 
        }
        <S.LogoInput type='file' name='logo' onChange={(e:any) => onFileChange(e, 'profile_image')} multiple onMouseOver={onShow} onMouseOut={onHide} style={{opacity: opacity}} />
        <FaIcons.FaRegEdit style={{width: '20px', height: '20px', opacity: opacity, color: 'white', marginLeft: '-65px'}} />  
      </S.LogoDiv>
      <div style={{float: 'right', marginTop: '-50px'}}>
        <S.SettingButton>
          <RiIcons.RiSettings2Line style={{width: '25px', fontSize: '18px'}} />
        </S.SettingButton>
        <S.SettingInput type='submit' onClick={onSubmit}/>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '20px'}}>
        <span style={{fontSize: '25px', fontWeight: 'bold'}}>{user.first_name + ' ' + user.last_name}</span>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '10px', paddingBottom: '30px'}}>        
        <span style={{fontSize: '16px', cursor: 'pointer'}} onClick={copyAddress}>
          {user.public_key.substr(0, 4) + '...' + user.public_key.substr(user.public_key.length - 4, user.public_key.length)}
          <IoIcons.IoMdCopy style={{fontSize: '20px', margin: '0 0 -5px 5px'}} />
        </span>
      </div>
    </S.Container>
  )
}

const S = {  
  Container: styled.div `
    background: ${(props)=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
  `,
  LogoImg: styled(Image) `
    width: 125px;
    height: 125px;
    margin-left: -53px;
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
