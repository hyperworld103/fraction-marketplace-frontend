import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled, { css } from 'styled-components'
import ETH from '../../assets/tokens/ETH.png'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { getAssetLogo } from '../../services/WalletService'

export interface ImageProps {
  address: string
  symbol: string
  className?: string
  input?: boolean
}

export const ImageToken: React.FC<ImageProps> = (imageProps: ImageProps) => {
  const chainId = useReactiveVar(chainIdVar)
  const { address, symbol, className, input } = imageProps
  const [showImage, setShowImage] = useState<string>('')
  useEffect(() => {
    setShowImage(getAssetLogo(address, chainId))
  }, [address, chainId])
  return (
    <S.BoxImage className={`${input ? 'input' : 'box'}, ${className}`}>
      {showImage ? (
        <img
          src={
            address === '0x0000000000000000000000000000000000000000' || address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
              ? ETH
              : getAssetLogo(address, chainId)
          }
          alt={symbol}
          onError={() => setShowImage('')}
        />
      ) : (
        <Jazzicon diameter={input ? 22 : 27} seed={jsNumberForAddress(address)} />
      )}
    </S.BoxImage>
  )
}

export const S = {
  BoxImage: styled.div`
    ${props =>
      props.className === 'input'
        ? css`
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 22px;
              height: 22px;
            }
            svg {
              width: 22px;
              height: 22px;
            }
          `
        : css`
            width: 27px;
            height: 27px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 27px;
              height: 27px;
            }
            svg {
              width: 27px;
              height: 27px;
            }
          `}
  `
}
