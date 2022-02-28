import { Button, Input } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import { changePassword } from '../services/UserService';
import { validate } from '../services/ValidationService';
import { SettingsPageTemplate } from './shared/templates/SettingsPageTemplate'

export default function SettingsChangePasswordPage() {
  const [oldpassword, setOldPassword] = useState<string>()
  const [newpassword, setNewPassword] = useState<string>()

  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
  }

  const handleSubmit = async () => {
    if(!validate('Old Password', oldpassword)) return;
    if(!validate('New Password', newpassword)) return;

    let data = {oldpassword: oldpassword, newpassword: newpassword};
    const isUpdated = await changePassword(data);
    if(isUpdated){    
      setOldPassword('')
      setNewPassword('')
    }
  }

  return (
    <SettingsPageTemplate>
      <header>Update Password</header>
      <div style={{width: '100%', padding: '7px', borderRadius: '5px', cursor: 'pointer'}}>
        <S.InputDiv>
          Old Password
          <S.Input maxLength={60} value={oldpassword} placeholder="Enter Password" onChange={(event:any) => setOldPassword(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'newpassword')} />
        </S.InputDiv>
        <S.InputDiv>
          New Password
          <S.Input maxLength={60} id='newpassword' value={newpassword} placeholder="Confirm Password" onChange={(event:any) => setNewPassword(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'save')} />
        </S.InputDiv>
      </div>
      <div style={{width: '100%'}}>
        <S.Button id='save' onClick={handleSubmit}>
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
