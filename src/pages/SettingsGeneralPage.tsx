import { Button, Input } from 'antd'
import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import {AppContext} from '../contexts';
import { updateProfile } from '../services/UserService';
import { validate, emailValidate } from '../services/ValidationService';
import { SettingsPageTemplate } from './shared/templates/SettingsPageTemplate'

export default function SettingsGeneralPage() {
  const {user, setUser} = useContext(AppContext);
  const [username, setUsername] = useState<string>(user.username)
  const [email, setEmail] = useState<string>(user.email)
  const [firstname, setFirstname] = useState<string>(user.first_name)
  const [lastname, setLastname] = useState<string>(user.last_name)
  const [phone, setPhone] = useState<string>(user.phone)
  const [paypal, setPaypal] = useState<string>(user.paypal)

  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
  }

  const handleSubmit = async () => {
    if(!validate('Username', username)) return;
    if(!validate('Email', email)) return;
    if(!emailValidate(email)) return;
    if(!validate('Firstname', firstname)) return;
    if(!validate('Lastname', lastname)) return;
    if(!validate('Paypal Address', paypal)) return;
    if(!emailValidate(paypal)) return;

    let data = {username: username, email: email, first_name: firstname, last_name: lastname, phone: phone, paypal: paypal};
    const userdata = await updateProfile(data);
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
  
  return (
    <SettingsPageTemplate>
      <header>General Settings</header>
      <div style={{width: '100%', padding: '7px', borderRadius: '5px', cursor: 'pointer'}}>
        <S.InputDiv>
          User Name
          <S.Input maxLength={60} value={username} placeholder="Enter Username" onChange={(event:any) => setUsername(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'email')} />
        </S.InputDiv>
        <S.InputDiv>
          Email
          <S.Input maxLength={60} id='email' value={email} placeholder="Enter Email" onChange={(event:any) => setEmail(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'firstname')} />
        </S.InputDiv>
        <S.InputDiv>
          First Name
          <S.Input maxLength={60} id='firstname' value={firstname} placeholder="Enter FirstName" onChange={(event:any) => setFirstname(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'lastname')} />
        </S.InputDiv>
        <S.InputDiv>
          Last Name
          <S.Input maxLength={60} id='lastname' value={lastname} placeholder="Enter LastName" onChange={(event:any) => setLastname(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'phone')} />
        </S.InputDiv>
        <S.InputDiv>
          Phone Number
          <S.Input maxLength={60} id='phone' value={phone} placeholder="Enter Phone Number" onChange={(event:any) => setPhone(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'paypal')} />
        </S.InputDiv>
        <S.InputDiv>
          Paypal Address
          <S.Input maxLength={60} id='paypal' value={paypal} placeholder="Enter Paypal Address" onChange={(event:any) => setPaypal(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'update')} />
        </S.InputDiv>
      </div>
      <div style={{width: '100%'}}>
        <S.Button id='update' onClick={handleSubmit}>
          Save
        </S.Button>
      </div>
    </SettingsPageTemplate>
  )
}

export const S = {
  InputDiv: styled.div `
    width: 100%;
    padding: 10px 20px 10px 20px;
    display: inline-block;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: 50%;
    }
  `,
  Input: styled(Input) `
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: ${props=>props.theme.gray['4']};
    background-color: ${props=>props.theme.gray['1']};
    background-clip: padding-box;
    border: 1px solid ${props=>props.theme.gray['2']};
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    `,
  Button: styled(Button)`
    display: inline-block !important;
    margin-left: 27px !important;
    margin-bottom: 20px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border-radius: 5px !important;
    padding: 3px 15px 5px 15px !important;
    cursor: pointer !important;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      opacity: 0.8;
    }
  `
}
