import React from 'react'
import { Button } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
//import attention from '../../assets/icons/attention.svg'
import { colors, fonts, viewport } from '../../styles/variables'

export const AlertWalletMessage: React.FC = () => {
  const [visible, setVisible] = useState(true)
  return (
    <S.Alert className={`${visible ? '' : 'disabled'}`}>
      <S.Container>
        <S.Message>
          
          <span>{`${'For some unspecified reason you wallet could not be loaded, you can request a wallet error review'}`}</span>
        </S.Message>
        <S.Actions>
          <a href='https://docs.google.com/forms/d/1-Iwv8ZFKekgLMfudiqvX0JHjV4RlN52UADbT3k0EyRA' target='_blank' rel="noopener noreferrer">
            <S.ActionButton>Report</S.ActionButton>
          </a>
          <S.ActionButton onClick={() => setVisible(false)}>Close</S.ActionButton>
        </S.Actions>
      </S.Container>
    </S.Alert>
  )
}

const S = {
  Alert: styled.div`
    flex: 1;
    width: 100%;
    min-height: 80px;
    background: ${colors.red4};

    font-size: ${fonts.nunito};
    color: ${colors.white};
    font-size: 16px;
    font-weight: 400;

    display: flex;
    align-items: center;
    justify-content: center;

    &.disabled {
      display: none;
    }
  `,
  Container: styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: ${viewport.xxl};
    height: 100%;
    @media (max-width: ${viewport.xl}) {
      padding: 32px 24px;
    }

    @media (max-width: ${viewport.sm}) {
      padding: 32px 8px;
      flex-direction: column;
    }
  `,
  Message: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin-right: 8px;
      width: 22px;
      height: 20px;
    }
    span {
      line-height: 24px;
    }
    @media (max-width: ${viewport.sm}) {
      margin-bottom: 16px;
    }
  `,
  Actions: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  `,
  ActionButton: styled(Button)`
    width: 127px;
    height: 37px;

    border: 1px solid ${colors.white};
    box-sizing: border-box;
    border-radius: 8px;

    background: ${colors.red4};
    color: ${colors.white};

    font-size: 16px;
    font-weight: 400;

    :nth-child(1) {
      margin-right: 8px;
    }

    &:hover {
      border: 1px solid ${colors.white};
      background: ${colors.red4};
      color: ${colors.white};
    }
    &:focus {
      border: 1px solid ${colors.white};
      background: ${colors.red4};
      color: ${colors.white};
    }

    @media (max-width: ${viewport.sm}) {
      font-size: 1.2rem;
    }
  `
}
