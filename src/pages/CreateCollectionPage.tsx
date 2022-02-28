import { Button, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import * as IoIcons from 'react-icons/io';
import { notifyWarning, notifySuccess } from '../services/NotificationService'
import {imageUpload, AddCollection, UpdateCollection, getCollectionInfo} from '../services/CollectionService';
import { validate } from '../services/ValidationService';
import {API} from '../constants/api';
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function CreateCollectionPage() {
  const history = useHistory();
  const { mode, address } = useParams<{ mode: string, address: string }>()
  const [description, setDescription] = useState<string>()
  const [name, setName] = useState<string>()
  const [royalties, setRoyalties] = useState<string>()
  const [logo, setLogo] = useState<string>('');
  const [banner, setBanner] = useState<string>('');
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [heightLogo, setHeightLogo] = useState<string>('auto');
  const [heightBanner, setHeightBanner] = useState<string>('auto');

  useEffect(() => {
    if(mode === 'edit') init_data();
  }, [mode])

  const init_data = async () => {
    let data = {contract_address: address};
    let result = await getCollectionInfo(data);
    if(result){
      setName(result['name']);
      setDescription(result['description'])
      setRoyalties(result['royalties'])
      setLogo(result['image'])
      setBanner(result['banner'])

      setShowLogo(false);
      setHeightLogo('100%');
      setShowBanner(false);
      setHeightBanner('100%');
    }
  }
  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
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
      if(field === 'logo_img'){
        setLogo(filename);
        setShowLogo(false);
        setHeightLogo('100%');
      } else {
        setBanner(filename);
        setShowBanner(false);
        setHeightBanner('100%');
      }      
    }
  }

  const onReturnClick = (e:any, field:string) => {
    if(field === 'logo_img') {
      setLogo('');
      setShowLogo(true);
      setHeightLogo('auto');
    } else {
      setBanner('');
      setShowBanner(true);
      setHeightBanner('auto');
    }
  }

  const submit = async () => {
    if(!validate('Collection name', name)) return;
    if(!validate('Royalties', royalties)) return;
    if(!validate('Logo', logo)) return;
    if(!validate('Banner', banner)) return;

    let data = {contract_address: address, name: name, royalties: royalties, description: description, image: logo, banner: banner}; 
    
    if(mode==='create'){
      await AddCollection(data);
      notifySuccess('Collection created successfully! You will be redirected to the myCollection page in a few seconds')
      history.push(`/collection/mycollection`)
    } else {
      await UpdateCollection(data);
    }
  }
  return (
    <DefaultPageTemplate noMargin fullWidth>
      <S.Content>
        <div>                
          <header>
          {mode==='create'? 'Add' : 'Update'} Your Collection
          </header>
          <S.subContent>
            <S.Span>Name</S.Span>
            <S.Input maxLength={'10'} value={name} placeholder="Enter Collection Name" onChange={(e: any) => setName(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'Royalty')} readOnly={mode==='edit'&& 'readOnly'} />                  
            <S.Span>Royalties</S.Span>
            <S.Input type='number' maxLength={'50'} value={royalties} id='Royalty' placeholder="Enter Royalties Percentage" onChange={(e: any) => setRoyalties(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'Descript')} />          
            <S.Span>Description</S.Span>
            <S.TextArea maxLength={1000} showCount rows={2} id='Descript' placeholder="Enter Description" value={description} onChange={(event:any) => setDescription(event.target.value)} />
            <S.Span>Collection Logo</S.Span>
            <S.Help>This image will also be used for navigation. 350 x 350 recommended.</S.Help> 
            <S.ImageArea>
              <img src={logo === ''?'' : API.server_url + API.collection_logo_image + logo} alt='' style={{width: '100%', objectFit: 'cover', height: heightLogo }}/>
              { showLogo? <IoIcons.IoMdImages id='logo_icon' style={{width: '50px', height: '50px'}} /> : null }
              { showLogo? <span>No Logo Selected</span> : null }  
              { showLogo? <S.Button id='logo_img'>
                <IoIcons.IoMdImage style={{width: '20px', height: '20px', marginBottom: '-5px', marginRight: '5px'}} />
                Select Image
                <S.ImageInput id='logo_input' type='file' name='logo' onChange={(e:any) => onFileChange(e, 'logo_img')}/>
              </S.Button> : null }
              { !showLogo? <button className='returnbtn' onClick={(e:any)=>onReturnClick(e, 'logo_img')}>REMOVE</button> : null }                
            </S.ImageArea> 
            <S.Span>Collection Banner</S.Span>
            <S.Help>This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.</S.Help> 
            <S.ImageArea>
              <img src={banner === ''?'' : API.server_url + API.collection_banner_image + banner} alt='' style={{width: '100%', objectFit: 'cover', height: heightBanner }} />
              { showBanner? <IoIcons.IoMdImages style={{width: '50px', height: '50px'}} /> : null }
              { showBanner? <span>No Banner Selected</span> : null }
              { showBanner? <S.Button id='logo_img'>
                <IoIcons.IoMdImage style={{width: '20px', height: '20px', marginBottom: '-5px', marginRight: '5px'}} />
                Select Image
                <S.ImageInput type='file' name='banner' onChange={(e:any) => onFileChange(e, 'banner_img')}/>
              </S.Button> : null }
              { !showBanner? <button className='returnbtn' onClick={(e:any)=>onReturnClick(e, 'banner_img')}>REMOVE</button> : null }
            </S.ImageArea>
            <S.Button style={{width:'100px'}} id='login' onClick={ submit }>
              {mode==='create'? 'Create' : 'Update'}
            </S.Button>  
          </S.subContent>  
        </div>          
      </S.Content>
    </DefaultPageTemplate>
  )
}

const S = {
  Content: styled.div`
    display: flex;
    //flex-wrap: wrap;
    width: 100%;
    align-items: center;
    justify-content: center;
    div:nth-child(1) {
      border: 1px solid #c8ced3;
      border-radius: 5px;
      line-height: 1.5rem;
      @media (min-width: ${props => props.theme.viewport.tablet}) {
        width: 80%;
        margin-top: 40px;
        margin-bottom: 40px;
      }

      @media (min-width: ${props => props.theme.viewport.desktopXl}) {
        width: 60%;
        margin-top: 100px;
        margin-bottom: 100px;
      }
      header {
        width: 100%;
        height: 40px;
        background: #f0f3f5;
        padding: 7px 20px;
      }
    }
  `,
  subContent: styled.div`
    padding: 10px 20px 20px 20px;
    width: 100%;
  `,
  Span: styled.span`
    color: ${props => props.theme.black};
    font-family: ${props => props.theme.fonts.primary};
  `,    
  ImageInput: styled(Input)`
    opacity: 0;
    position: absolute;
    width: 150px;
    height: 30px;
    right:0px !important;
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
  Button: styled(Button)`
    border-radius: 5px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 150px;
    font-size: 16px;
    height: 40px;
    padding-bottom: 7px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      color: ${colors.white};
      opacity: 0.8;
      box-shadow: none;
      border: none;
    }
  `,
  Input: styled(Input)`
    border-radius: 3px;
    border: 2px;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 30%);
    margin-top: 8px;
    margin-bottom: 15px;
    width: 100%;
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
  `,
  TextArea: styled(TextArea)`
    border-radius: 8px;
    border: none;
    margin-bottom: 15px;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    .ant-input {
      color: ${(props)=>props.theme.gray['4']};
      background: ${(props)=>props.theme.gray['0']};
      border: 1px solid ${(props)=>props.theme.gray['2']};
    }
  `,
  Help: styled.div`
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  `,
  ImageArea: styled.div`
    border:1px solid #ccc; 
    text-align: center; 
    height: 200px; 
    position: relative; 
    display: flex; 
    justify-content: center; 
    flex: 1; 
    margin-bottom:20px;
    align-items: center; 
    flex-direction: column; 
    background-color: #e7e7e7;
    .returnbtn {
      position: absolute;
      top:0;
      right: 0;
      border-radius: 5px;
      background-color: ${colors.red1};
      color: ${colors.white};
      border: none;
      box-shadow: none;
      width: 100px;
      font-size: 14px;
      font-weight: bold;
      height: 30px;
      padding-bottom: 7px;

      &:hover,
      &:active,
      &:focus {
        background-color: ${colors.red2};
        color: ${colors.white};
        opacity: 0.8;
        box-shadow: none;
        border: none;
      }
    }
  `
}
