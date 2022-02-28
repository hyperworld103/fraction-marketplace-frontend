import { Image, Modal } from 'antd'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import notFound from '../../assets/notfound.svg'

interface Erc721ImageNewProps {
  image: string
  imageFull: string
  name: string
  animation: string | undefined
  backgroundColor?: string
}

export const Erc721ImageNew: React.FC<Erc721ImageNewProps> = ({
  image,
  imageFull,
  name,
  animation,
  backgroundColor
}: Erc721ImageNewProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>(image)

  const showModal = () => {
    setSelectedImage(imageFull)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  function handleImageCancel() {
    setSelectedImage(image)
    setIsVisible(!isVisible)
  }

  return (
    <>
      <S.Content className={image === '' ? 'bg-fail' : ''}>
        {animation ? (
          <S.NFTVideo autoPlay muted loop preload='none' onClick={showModal}>
            <source src={animation} type='video/mp4' />
            <source src='movie.ogg' type='video/ogg' />
          </S.NFTVideo>
        ) : (
          <S.ContractImage>
            <S.Image backgroundColor={backgroundColor} src={selectedImage || notFound} onPreviewClose={handleImageCancel} loading='lazy' />
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
      background: ${props => props.theme.gray[1]};
    }

    height: 522px;
    width: 689px;
    background: ${props => props.theme.white};
    display: flex;
    justify-content: center;
    align-items: center;
    video {
      cursor: pointer;
    }
    @media (max-width: ${props => props.theme.viewport.desktopXl}) {
      width: 100%;
      height: 100%;
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
      @media (max-width: ${props => props.theme.viewport.tablet}) {
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
  Image: styled(Image)<{ backgroundColor?: string }>`
    border-radius: 8px;
    height: 100%;
    object-fit: contain;
    object-position: center;

    ${props =>
      css`
        background-color: ${props.backgroundColor ? props.backgroundColor : 'transparent'};
      `}
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
