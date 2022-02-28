import { Image, Modal } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import notfound from '../../assets/notfound.svg'
import { colors, colorsV2, viewport } from '../../styles/variables'

export interface Erc721ImageProps {
  image: string
  name: string
  animation: string | undefined
  animationType: string
}

export const Erc721Image: React.FC<Erc721ImageProps> = ({ image, name, animation, animationType }: Erc721ImageProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  function setVisible() {
    setIsVisible(!isVisible)
  }

  return (
    <>
      <S.Content className={image === '' ? 'bg-fail' : ''}>
        {animationType == 'video' ? (
          <S.NFTVideo autoPlay muted loop preload='none' onClick={showModal}>
            <source src={animation} type='video/mp4' />
            <source src='movie.ogg' type='video/ogg' />
          </S.NFTVideo>
        ) : (
          <S.ContractImage>
            <S.Image src={image || notfound} onPreviewClose={setVisible} loading='lazy' />
            {isVisible && <div className='title-image-nft'>{name}</div>}
          </S.ContractImage>
        )}
      </S.Content>
      <S.ModalVideo visible={isModalVisible} destroyOnClose centered onOk={handleOk} onCancel={handleCancel}>
        <S.NFTVideo autoPlay controls preload='none' controlsList='nodownload'>
          <source src={animation} type='video/mp4' />
          <source src='movie.ogg' type='video/ogg' />
        </S.NFTVideo>
      </S.ModalVideo>
    </>
  )
}

const S = {
  Content: styled.div`
    &.bg-fail {
      background: ${props=>props.theme.gray['1']};
    }
    width: 100%;
    height: 100%;

    background: ${props=>props.theme.gray['1']};
    justify-content: center;
    align-items: center;
    video {
      cursor: pointer;
    }

    @media (min-width: ${viewport.md}) {
      min-width: 330px;
      min-height: 330px;
      max-height: 330px;
      display: flex;
      video {
        cursor: pointer;
        min-width: 330px;
        min-height: 330px;
        max-height: 330px;
      }
    }

    @media (min-width: ${viewport.lg}) {
      min-width: 500px;
      min-height: 500px;
      max-height: 500px;
      margin-top: 1rem;
      display: flex;
      video {
        cursor: pointer;
        min-width: 500px;
        min-height: 500px;
        max-height: 500px;
      }
    }

    @media (min-width: ${viewport.xl}) {
      min-width: 544px;
      min-height: 544px;
      max-height: 544px;
      display: flex;
      video {
        cursor: pointer;
        min-width: 544px;
        min-height: 544px;
        max-height: 544px;
      }
    }
  `,
  ContractImage: styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    .title-image-nft {
      position: fixed;
      bottom: 20px;
      left: 20px;
      color: black;
      font-weight: 500;
      font-size: 1.5rem;
      z-index: 999999;
      font-family: Montserrat;
      font-weight: 500;
    }

    > .ant-image {
      width: 100%;
      height: 100%;
    }

    .ant-image-mask-info {
      text-align: center;
      @media (max-width: ${viewport.md}) {
        display: none;
      }
    }

    .ant-image-mask-info {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      font-size: 1.6rem;
      font-family: Montserrat;
      font-style: normal;
      font-weight: 400;
    }
  `,
  Image: styled(Image)`
    border-radius: 8px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background-color: transparent;
  `,
  NFTVideo: styled.video`
    width: 100%;
    height: 100%;
    border-radius: 8px;
  `,
  ModalVideo: styled(Modal)`
    width: 100% !important;
    max-width: 750px;
    height: auto;
    .ant-modal-content {
      background: none !important;
      box-shadow: none;
    }
    .ant-modal-footer {
      display: none;
    }
  `
}
