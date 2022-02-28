import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Input, Modal } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import styled from 'styled-components'
import { popupModalVar } from '../../graphql/variables/PopupVariables'
import { notifyWarning } from '../../services/NotificationService'
import { colors, fonts, viewport } from '../../styles/variables'

export const PopupModal = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const popupModal = useReactiveVar(popupModalVar)
  const [loading, setLoading] = useState(false)

  const createContact = async () => {
    await axios
      .post('https://us-central1-nftfy-production.cloudfunctions.net/api/contact', {
        contact: {
          email,
          firstName: name
        }
      })
      .catch(error => {
        notifyWarning(error)
      })
  }
  const submit = async () => {
    if (!name || !email) {
      notifyWarning('Please fill in the fields')
      return
    }

    const textOnly = new RegExp('^[a-zA-Z ]*$')

    if (name.length < 2 || !name.match(textOnly)) {
      notifyWarning('Please fill a valid name')
      return
    }

    if (!email.includes('@')) {
      notifyWarning('Please fill a valid e-mail')
      return
    }

    setLoading(true)
    localStorage.setItem('subscription_modal', 'false')
    await createContact()
    setLoading(false)
    popupModalVar(false)
  }

  const closeModal = () => {
    localStorage.setItem('subscription_modal', 'false')
    popupModalVar(false)
  }

  return (
    <S.Modal visible={popupModal} onCancel={() => closeModal()} footer={null} destroyOnClose>
      <S.Title>Get Nftfy Exclusive Content</S.Title>
      <div>
        <S.InputForm placeholder='Enter your first name' type='text' onChange={e => setName(e.target.value)} />
        <S.InputForm placeholder='Enter your e-mail' type='email' onChange={e => setEmail(e.target.value)} />
      </div>
      <S.ActionButton onClick={submit} loading={loading}>
        Subscribe
      </S.ActionButton>
      <S.Info>
        We process your personal data as stated in our Privacy Policy. You may withdraw your consent at any time by clicking the
        unsubscrible link at the bottom of any of our emails.
      </S.Info>
    </S.Modal>
  )
}

export const S = {
  Modal: styled(Modal)`
    width: 100vw !important;
    max-width: 688px !important;
    height: auto;
    padding: 32px;
    text-align: center;
    .ant-modal-content {
      border-radius: 16px;
    }
    .ant-modal-body {
      padding: 60px;
    }
    .ant-modal-close-x {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
    }
  `,
  Link: styled.a``,
  Title: styled.h1`
    font-family: ${fonts.nunito};
    font-weight: 400;
    font-size: 3rem;
    color: ${colors.gray11};
    text-align: center;
    margin-bottom: 40px;
    @media (max-width: ${viewport.sm}) {
      font-size: 1.8rem;
    }
  `,
  InputForm: styled(Input)`
    width: 100%;
    max-width: 624px;
    height: 54px;
    border: 1px solid ${colors.gray14};
    box-sizing: border-box;
    border-radius: 8px;
    margin-bottom: 16px;
  `,
  ActionButton: styled(Button)`
    width: 100%;
    max-width: 624px;
    height: 54px;
    background: ${colors.blue1};
    color: ${colors.white};
    border-radius: 8px;
    font-family: ${fonts.nunito};
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 24px;
    margin-bottom: 20px;

    &:hover,
    &:active,
    &:focus {
      background: ${colors.blue2};
      color: ${colors.white};
    }

    @media (max-width: ${viewport.sm}) {
      font-size: 1.2rem;
    }
  `,
  Info: styled.p`
    font-family: ${fonts.nunito};
    color: #c2c1c1;
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 2rem;
    margin-top: 10px;

    @media (max-width: ${viewport.sm}) {
      font-size: 1rem;
    }
  `
}
