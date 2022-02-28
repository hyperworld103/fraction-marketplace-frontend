import { Image, ImageProps } from 'antd'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import notFount from '../../assets/notfound.svg'
import { fonts, viewport } from '../../styles/variables'

export interface ContractImageProps {
  name: string
  src: string
  large: boolean
  className?: string
}

export const ContractImage: React.FC<ContractImageProps> = ({ name, large, src, className }: ContractImageProps) => {
  const [isVisible, setIsVisible] = useState(false)
  function setVisible() {
    setIsVisible(!isVisible)
  }
  return (
    <S.ContractImage className={className}>
      <S.Image src={src} onPreviewClose={setVisible} className={`${large ? 'large' : 'small'}`} loading='lazy' fallback={notFount} />
      {isVisible && <div className='title-image-nft'>{name}</div>}
    </S.ContractImage>
  )
}

export const S = {
  ContractImage: styled.div`
    display: flex;
    justify-content: center;
    width: auto;
    height: auto;

    .title-image-nft {
      position: fixed;
      bottom: 20px;
      left: 20px;
      color: black;
      font-weight: 400;
      font-size: 1.5rem;
      z-index: 999999;
      font-family: ${fonts.nunito};
      font-weight: 400;
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
    ${props =>
      props.className === 'large'
        ? css`
            .ant-image-mask-info {
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: row;
              font-size: 1.6rem;
              font-family: ${fonts.nunito};
              font-style: normal;
              font-weight: 400;
            }
          `
        : css`
            .ant-image-mask-info {
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: row;
              font-size: 10px;
              font-family: ${fonts.nunito};
              font-style: normal;
              font-weight: 400;
            }
            span.anticon.anticon-eye {
              display: none;
            }
          `}
  `,
  Image: styled(Image)<ImageProps>`
    ${props =>
      props.className === 'large'
        ? css`
            max-width: 500px;
            max-height: 500px;
            object-fit: cover;
            border-radius: 4px;
          `
        : css`
            width: 48px;
            height: 48px;
            border-radius: 8px;
          `}
  `
}
