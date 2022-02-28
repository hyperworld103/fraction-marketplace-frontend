import { Alert, Button, Input } from 'antd'
import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { validate, emailValidate, confirmValidate } from '../services/ValidationService';
import { register } from '../services/UserService';

export default function SignupPage() {
  const history = useHistory()

  const [username, setUsername] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [firstname, setFirstname] = useState<string>()
  const [lastname, setLastname] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [confirm, setConfirm] = useState<string>()

  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
  }

  const submitSignup = async () => {
    if(!validate('Username', username)) return;
    if(!validate('Email', email)) return;
    if(!emailValidate(email)) return;
    if(!validate('Firstname', firstname)) return;
    if(!validate('Lastname', lastname)) return;
    if(!validate('Password', password)) return;
    if(!validate('Confirm Password', confirm)) return;
    if(!confirmValidate(password, confirm)) return;

    let data = {username: username, email: email, first_name: firstname, last_name: lastname, password: password};

    const activation_code = await register(data);
    if(activation_code !== '')
      history.push({ pathname: '/email_verify', state: activation_code }); 
  }

  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.SignupBox> 
          <S.TitleDiv>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>
              Create Account
            </div>            
            <div>
              Sign Up to your account
            </div>                 
          </S.TitleDiv>  
          <div>
            <div>
              <S.Input maxLength={60} value={username} placeholder="Enter Username" onChange={(e: any) => setUsername(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'email')} />
            </div>
            <div>
              <S.Input maxLength={60} id='email' value={email} placeholder="Enter Email" onChange={(e: any) => setEmail(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'firstname')} />
            </div>
            <div>
              <S.Input maxLength={60} id='firstname' value={firstname} placeholder="Enter FirstName" onChange={(e: any) => setFirstname(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'lastname')} />
            </div>
            <div>
              <S.Input maxLength={60} id='lastname' value={lastname} placeholder="Enter LastName" onChange={(e: any) => setLastname(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'password')} />
            </div>
            <div>
              <S.Input maxLength={60} id='password' type="password" value={password} placeholder="Enter Password" onChange={(e: any) => setPassword(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'confirm')} />
            </div>
            <div>
              <S.Input maxLength={60} id='confirm' type="password" value={confirm} placeholder="Enter Confirm Password" onChange={(e: any) => setConfirm(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'signup')} />
            </div>
            <div style={{marginTop: '40px'}}>
              <S.Button id='signup' onClick={submitSignup}>
                Create Account
              </S.Button>
              <Link to="/login" style={{color: `${colors.red2}`, float: 'right', marginTop: '10px'}}>Back to Login?</Link>
            </div>
          </div>     
        </S.SignupBox>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  TitleDiv: styled.div`
    color: ${(props)=>props.theme.gray['4']};
  `,
  Container: styled.div`
    width: 100%;
    justify-content: center;
    margin-top: 3vh;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 15vh;    
      display: flex;
    }
  `,
  Button: styled(Button)`
    border-radius: 8px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 150px;
    font-size: 16px;
    font-weight: bold;
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
    border-radius: 5px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    margin-top: 20px;
    background: ${(props)=>props.theme.gray['0']};
    color: ${(props)=>props.theme.gray['4']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
  `,
  Alert: styled(Alert)`
    border-radius: 8px;
    font-weight: 400;

    .ant-alert-message {
      margin-bottom: 8px;
      font-size: 14px;
    }
  `,
  SignupBox: styled.div`
    width: 100%;
    max-width: 400px;
    height: 500px;
    display: block !important;
    padding: 20px;    
    border: 1px solid #d0d0d1;
    border-radius: 5px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: 50%;
      display: inline-block !important;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: 50%;
      display: inline-block !important;
    }
  `
}
