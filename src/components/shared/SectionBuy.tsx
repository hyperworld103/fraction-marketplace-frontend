import { useReactiveVar } from '@apollo/client/react'
import { Button } from 'antd'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import styled from 'styled-components'
import clip from '../../assets/icons/clip.svg'
import MetaMask from '../../assets/metamask.svg'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { notifySuccess } from '../../services/NotificationService'
import { addNftFyToMetamask } from '../../services/WalletService'
import { colors, fonts, viewport } from '../../styles/variables'

export interface AssetsSectionBuy {
  title: string
  link: string
  image: string
  nftfyToken: string
}

export const SectionBuy = ({ title, link, nftfyToken, image }: AssetsSectionBuy) => {
  const chainId = useReactiveVar(chainIdVar)
  const notificationClip = async () => {
    notifySuccess('Successfully Copied')
  }
  const sendToken = () => {
    addNftFyToMetamask(chainId)
  }

  return (
    <S.Content>
      <S.Main>
        <S.Header>{title}</S.Header>
        <img alt='NFTFYBuy' src={image} />
        <S.ContentSwap>
          <S.ButtonAction type='primary' onClick={sendToken}>
            + $NFTFY
            <img src={MetaMask} alt='Metamask' />
          </S.ButtonAction>
        </S.ContentSwap>
        <S.TokenAction>
          <h4>NFTFY Token</h4>
          <CopyToClipboard text={nftfyToken} onCopy={() => notificationClip()}>
            <span>
              {nftfyToken}
              <img src={clip} alt='clip' />
            </span>
          </CopyToClipboard>
          <S.BuyNFTFY target='_blank' href={link}>
            BUY NFTFY
          </S.BuyNFTFY>
        </S.TokenAction>
      </S.Main>
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    padding: 5px;
    max-width: 380px;
    text-align: center;
    h1 {
      padding: 30px 0;
      font-weight: 400;
      font-size: 26px;
      line-height: 130%;
      color: ${colors.gray12};
    }
  `,
  Main: styled.div`
    width: 100%;
    max-width: 400px;
    max-height: 560px;
    border: 1px solid ${colors.gray11};
    box-sizing: border-box;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    img {
      max-width: 243px;
      padding: 48px 20px 20px;
    }
  `,
  ContentSwap: styled.div`
    width: 100%;
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    padding: 0 32px;
  `,
  Header: styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    background: ${colors.black1};
    border-radius: 8px 8px 0px 0px;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 130%;
    color: ${colors.orange};
    padding: 0 25px;
    text-align: left;
  `,
  ButtonAction: styled(Button)`
    width: 160px;
    height: 52px;
    border-radius: 8px;
    border: 2px solid ${colors.orange};
    cursor: pointer;
    background: none;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.gray12};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    margin: 5px;

    &:hover {
      border: 2px solid #fc3d13;
      background: ${colors.white};
      color: ${colors.gray12};
    }
    &:focus {
      border: 2px solid #fc3d13;
      background: ${colors.white};
      color: ${colors.gray12};
    }

    img {
      padding: 0px;
      width: 25px;
      height: auto;
      margin-left: 8px;
    }

    @media (max-width: ${viewport.sm}) {
      font-size: 14px;
      margin: 5px;
      img {
        width: 20px;
      }
    }
  `,
  TokenAction: styled.div`
    width: 100%;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 32px 32px;
    h4 {
      font-weight: 400;
      font-size: 16px;
      line-height: 160%;
      color: ${colors.gray12};
    }
    span {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: normal;
      font-size: 12px;
      line-height: 160%;
      cursor: pointer;
      color: ${colors.gray12};
      img {
        padding: 5px;
      }
    }

    @media (max-width: ${viewport.sm}) {
      span {
        font-size: 10px;
      }
    }
  `,
  BuyNFTFY: styled.a`
    width: 100%;
    height: 48px;
    margin-top: 32px;
    background: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.white};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: linear-gradient(90deg, #f86e4f 5.73%, #fc5f74 100%);
      color: ${colors.white};
    }
  `,
  Message: styled.div`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: normal;
    color: ${colors.gray12};
    text-align: center;
    font-size: 13px;
    margin: 10px auto;
  `
}
