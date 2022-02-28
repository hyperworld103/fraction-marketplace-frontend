import { Button, Input, Modal, Select } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../../styles/variables'

interface ModalParams {
    visible: boolean,
    setVisible: any
}

export default function TransferModal({ visible, setVisible }: ModalParams) {
    const [address, setAddress] = useState<String>('');
    const [value, setValue] = useState<number>();
    const [type, setType] = useState<String>('USDC');

    const closeModal = () => {
        setVisible(false)
    }

    const handleKeyPress = (e: any, target: string) => {
        if(e.key === 'Enter'){
          document.getElementById(target).focus();           
        }
      }
     
    const submitTransfer = async() => {
        
    }
    return (
        <S.Modal visible={visible} onCancel={() => closeModal()} footer={null} destroyOnClose >
            <header>
                <h2>Transfer {type}</h2>
            </header>
            <S.Span>Crypto Type</S.Span>
            <S.Select value={type} options={[{value:'USDC',lable:'USDC'}, {value:'ETH',lable:'ETH'}]} onChange={(e:any) => setType(e)}/>
            <S.Span>{type} Address</S.Span>
            <S.Input maxLength={'10'} value={address} placeholder="Enter Ethereum Address" onChange={(e: any) => setAddress(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'Royalty')} />                  
            <S.Span>{type} Value</S.Span>
            <S.Input type='number' maxLength={'50'} value={value} id='value' placeholder="Enter Ethereum Value" onChange={(e: any) => setValue(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'Descript')} />          
            <div style={{width: '100%', marginTop: '20px'}}>
                <S.Button onClick = { submitTransfer }>
                Transfer
                </S.Button>
            </div>
        </S.Modal>
    )
}

export const S = {
    Modal: styled(Modal)`        
        border-radius: 3px;
        .ant-modal-content {
            border-radius: 6px;
            .ant-modal-close {
              display: none;
            }
            .ant-modal-body {
              padding: 10px 20px 20px 20px;
              background: ${(props)=>props.theme.gray['0']};
            }
          }
        header {
            width: 100%;
            padding: 20px 22px;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            border: 0px;
      
            h2 {
              font-style: normal;
              font-weight: 600;
              font-size: 27px;
              color: ${props=>props.theme.gray['4']};
              line-height: 35px;
      
              display: flex;
              align-items: center;
            }
        }
        
    `,
    Span: styled.span`
        color: ${props => props.theme.black};
        font-family: ${props => props.theme.fonts.primary};
    `,
    Select: styled(Select)`
        margin-bottom: 15px;
        width: 100%;
        margin-top: 8px;
        color: ${(props)=>props.theme.gray['4']};
        background: ${(props)=>props.theme.gray['0']};
        border: 1px solid ${(props)=>props.theme.gray['2']};
        border-radius: 3px;

        div: nth-child(1) {
            background: ${(props)=>props.theme.gray['0']} !important;
            border: 0 !important;
        } 

        span {
            color: ${(props)=>props.theme.gray['4']} !important;
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
    Button: styled(Button)`
        display: inline-block !important;
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
        margin-bottom: 20px;
    `
}