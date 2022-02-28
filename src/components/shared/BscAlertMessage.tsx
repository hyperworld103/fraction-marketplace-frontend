import { Button } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import attention from '../../assets/icons/attention.svg'
import { colors, fonts, viewport } from '../../styles/variables'
import React from 'react'
export const BscAlertMessage: React.FC = () => {
  const [visible, setVisible] = useState(true)
  return (
    <S.Alert className={`${visible ? '' : 'disabled'}`}>
      <S.Container>
        <S.Message>
          <img src={attention} alt='Attention' />
          <span>
            This feature currently does not support BSC. We are working on adding the support soon! For the time being, use the Ethereum
            Mainnet.
          </span>
        </S.Message>
        <S.Actions>
          <S.ActionButton onClick={() => setVisible(false)}>Close</S.ActionButton>
        </S.Actions>
      </S.Container>
    </S.Alert>
  )
}
export const S = {
  Alert: styled.div`
    flex: 1;
    width: 100%;
    min-height: 80px;
    background: ${colors.orange};

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

    background: ${colors.orange};
    color: ${colors.white};

    font-size: 16px;
    font-weight: 400;

    :nth-child(1) {
      margin-right: 8px;
    }

    &:hover,
    &:focus {
      border: 1px solid ${colors.white};
      background: ${colors.orange};
      color: ${colors.white};
      opacity: 0.8;
    }

    @media (max-width: ${viewport.sm}) {
      font-size: 1.2rem;
    }
  `
}
