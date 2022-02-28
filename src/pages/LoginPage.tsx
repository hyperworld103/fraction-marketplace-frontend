import { Alert, Button, Input } from 'antd'
import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { validate } from '../services/ValidationService';
import { login } from '../services/UserService';

export default function LoginPage() {

  const history = useHistory()
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()

  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
  }

  const submitLogin = async () => {
    if(!validate('Username', username)) return;
    if(!validate('Password', password)) return;

    let data = {username: username, password: password};

    const activation_code = await login(data);
    if(activation_code !== '')
      history.push({ pathname: '/email_verify', state: activation_code});
  }

  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.LoginBox> 
          <S.TitleDiv>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>
              Login
            </div>            
            <div>
              Sign In to your account
            </div>                 
          </S.TitleDiv>  
          <div>
            <div>
              <S.Input maxLength={60} value={username} placeholder="Enter Username" onChange={(e: any) => setUsername(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'password')} />
            </div>
            <div>
              <S.Input maxLength={60} id='password' type='password' value={password} placeholder="Enter Password" onChange={(e: any) => setPassword(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'login')} />
            </div>
            <div style={{marginTop: '40px'}}>
              <S.Button id='login' onClick={submitLogin}>
                Login
              </S.Button>
              <Link to="/forgot_password" style={{color: `${colors.red2}`, float: 'right', marginTop: '10px'}}>Forgot password?</Link>
            </div>
          </div>     
        </S.LoginBox>
        <S.SignupBox>
          <div style={{fontSize: '22px', fontWeight: 'bold', marginTop:'60px'}}>
            Sign up
          </div>            
          <div style={{marginBottom: '30px'}}>
            Click below button to signup with Cryptotrades.
          </div>
          <div>
            <Link to="/register" style={{backgroundColor: 'red', borderRadius: '5px', color: 'white', marginTop: '10px', padding: '7px 15px 10px 15px', fontSize: '16px', fontWeight:'bold'}}>Register Now!</Link>
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
    margin-top: 24px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 25vh;    
      display: flex;
    }
  `,
  Button: styled(Button)`
    border-radius: 8px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 100px;
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
    width: 90%;
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
  LoginBox: styled.div`
    width: 100%;
    max-width: 400px;
    height: 300px;
    display: block !important;
    padding: 20px;    
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: 50%;
      display: inline-block !important;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: 50%;
      display: inline-block !important;
    }
  `,
  SignupBox: styled.div`
    width: 100%;
    max-width: 400px;
    height: 300px;
    display: block !important;
    padding: 20px;
    background-color: ${colors.red2};
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    color: white;
    text-align: center;
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
