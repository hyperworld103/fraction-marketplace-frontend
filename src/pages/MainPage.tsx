import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import bgImage from '../assets/banner/banner.jpg'
import bgFaceImage from '../assets/banner/banner_images.png'
import Collections from '../assets/banner/collections.png'
import Nfts from '../assets/banner/nfts.png'
import Sale from '../assets/banner/sale.png'
import Wallet from '../assets/banner/wallet.png'
import { PopupModal } from '../components/shared/PopupModal'
import { colors, fonts, viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function MainPage() {

  const redirect = (url: string) => {
    window.location.href = url
  }

  return (
    <DefaultPageTemplate noMargin fullWidth>
      <S.Container>
        <S.Intro>
          <S.Fluid>
            <section>
              <div>
                <h2>
                  Discover, Collect, and sell{"\n"}
                  extraordinary <span>NFTs</span>
                </h2>
                <p>
                  Etiam auctor urna ac nisi feugiat, in tempor massa tempus arcu necneque efficitur porta
                </p>
                {/* <ul> */}
                  <li>
                    <S.ButtonExplore onClick={() => redirect('/#/marketplace')}>Explore</S.ButtonExplore>
                  </li>
                  <li>
                    <S.ButtonFractionalize onClick={() => redirect('/#/fractionalize')}>Fractionalize</S.ButtonFractionalize>
                  </li>
                {/* </ul> */}
              </div>
              <div>
                <img src={bgFaceImage} alt='' />
              </div>
            </section>
          </S.Fluid>
          
        </S.Intro>
        {/*  */}
        <S.Avatars>
          <section>
            <h1>Create and Sell your Nfts</h1>
            <p>
              ellentesque mollis magna nec tortor mattis rIn quis purus.
            </p>

            <ul>
              <li>
                <div>
                  <img src={Wallet} alt='Wallet' />
                </div>
                <h2>Setup your Wallet</h2>
                <span>
                  Etiam auctor urna ac nisi feugiat, in tempor massa tempus arcu nec neque efficitur porta ollis magna nec tortor mattis eugiat, in tempoarcu nec neque effici...
                </span>
              </li>
              <li>
                <div>
                  <img src={Collections} alt='Collections' />
                </div>             
                <h2>Create your collection</h2>
                <span>
                  Etiam auctor urna ac nisi feugiat, in tempor massa tempus arcu nec neque efficitur porta ollis magna nec tortor mattis eugiat, in tempoarcu nec neque effici...
                </span>
              </li>
              <li>
                <div>
                  <img src={Nfts} alt='Nfts' />
                </div>
                <h2>Add your Nfts</h2>
                <span>
                  Etiam auctor urna ac nisi feugiat, in tempor massa tempus arcu nec neque efficitur porta ollis magna nec tortor mattis eugiat, in tempoarcu nec neque effici...
                </span>
              </li>
              <li>
                <div>
                  <img src={Sale} alt='Sale' />
                </div>
                <h2>List Them for Sale</h2>
                <span>
                  Etiam auctor urna ac nisi feugiat, in tempor massa tempus arcu nec neque efficitur porta ollis magna nec tortor mattis eugiat, in tempoarcu nec neque effici...
                </span>
              </li>
            </ul>
          </section>
        </S.Avatars>
        {/*  */}
        <S.Banner>  
          <section>
            <h1>Browse By Category</h1>
            <p>ellentesque mollis magna nec tortor mattis rIn quis purus.</p>
          </section>
        </S.Banner>
        <PopupModal />
      </S.Container>
    </DefaultPageTemplate>
  )
}

export const S = {
  Container: styled.div`
    flex: 1;
    min-height: calc(100vh - 76px);
    display: flex;
    flex-direction: column;
  `,
  // Header: styled(Header)``,
  Intro: styled.div`
    width: 100%;
    height: 700px;
    background: url(${bgImage});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @media (max-width: ${viewport.md}) {
      height: 600px;
    }
  `,
  Fluid: styled.div`
    height: 100%;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 50px;
    padding-right: 50px;
    
    section {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0px;
      @media (max-width: ${viewport.md}) {
        display: inline-block;
      }
      div:nth-child(1) {
        width: 45%;
        display: inline-block;
        h2 {
          font-family: ${fonts.nunito};
          line-height: 55px;
          font-weight: 700;
          font-size: 46px;
          color: ${colors.black};
          span:nth-child(1) {
            color: ${colors.red5};
          }
        }
        p {
          font-family: ${fonts.nunito};
          font-size: 16px;
          color: ${colors.gray1};
          margin-bottom: 50px !important;
        }
        li {
          margin-right: 20px;
          list-style: none;
          display: inline-block;
          a {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 28px;
          }
        }

        @media (max-width: ${viewport.md}) {
          width: 100%;
          padding: 20px 0px;

          li {
            margin-right: 10px;
          }
        }
      }
      div:nth-child(2) {
        width: 55%;
        text-align: center;
        display: inline-block;
        > img {
          border-radius: 10px !important;
          max-width: 100%;
          vertical-aling: middle;
        }
        @media (max-width: ${viewport.md}) {
          width: 100%;
          padding: 20px 0px;
        }
      }
    }
    @media (max-width: ${viewport.md}) {
      padding-left: 15px;
      padding-right: 15px;
    }
  `,
  Avatars: styled.div`
    width: 100%;
    background: #fdefed;
    // margin-bottom: 30px;
    section {
      margin: 50px 70px;
      //max-width: ${viewport.xl};

      h1 {
        font-family: ${fonts.nunito};
        font-weight: bold;
        font-size: 30px;
        color: ${colors.black};
        text-align: left;
        padding-bottom: 0px !important;
      }
      p {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        color: ${colors.gray1};
        text-align: left;
      }

      ul {
        padding-top: 48px;
        padding-left: 0px !important;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        @media (max-width: ${viewport.lg}) {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: ${viewport.md}) {
          display: flex;
          flex-direction: column;
        }

        li {
          display: flex;
          align-items: start;
          flex-direction: column;
          margin: 0 12px;
          padding: 24px 12px;
          background: ${colors.red6};
          border-radius: 16px;
          &:hover {
            background: ${colors.gray13};
          }
          div {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 100%;
            margin-bottom: 24px;
          }
          h2 {
            font-weight: 600;
            font-size: 20px;
            line-height: 32px;
            color: ${colors.black};
            text-align: left;
            padding-bottom: 10px;
          }
          span {
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            color: ${colors.gray1};
            text-align: left;
          }
        }
      }

      @media (max-width: ${viewport.lg}) {
        padding: 20px;
        margin: 50px 0px;
        h1 {
          margin-top: 0px;
          font-size: 32px;
        }
        ul {
          li {
            padding: 12px 24px;
            margin: 12px;
          }
        }
      }
    }
  `,
  Banner: styled.div`
    width: 100%;
    background: ${colors.white};
    section {
      margin: 0px 70px 60px 70px;
      max-width: ${viewport.xl};

      h1 {
        font-family: ${fonts.nunito};
        font-weight: bold;
        font-size: 30px;
        color: ${colors.black};
        text-align: left;
        padding-bottom: 0px !important;
      }
      p {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        color: ${colors.gray1};
        text-align: left;
      }
      
      @media (max-width: ${viewport.sm}) {
        margin: 0px 10px 60px 10px;
        h1 {
          margin-top: 0px;
          font-size: 32px;
        }
      }
    }
  `,
  ButtonExplore: styled(Button)`
    width: 120px;
    height: 40px;
    border: 2px solid ${colors.red5};
    box-sizing: border-box;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.red5};
    background: transparent;

    @media (max-width: ${viewport.md}) {
      width: 120px;
      height: 40px;
    }

    &:hover,
    &:focus,
    &:active {
      background: ${colors.red5};
      color: ${colors.white};
      border-color: ${colors.red5};
    }
  `,
  ButtonFractionalize: styled(Button)`
    width: 120px;
    height: 40px;
    border: 2px solid ${colors.red5};
    box-sizing: border-box;
    border-radius: 30px;
    background: transparent;
    color: ${colors.red5};
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    @media (max-width: ${viewport.sm}) {
      width: 120px;
      height: 40px;
    }

    &:hover,
    &:focus,
    &:active {
      background: ${colors.red5};
      color: ${colors.white};
      border-color: ${colors.red5};
    }
  `,
  ButtonAction: styled(Button)`
    width: 100%;
    max-width: 400px;
    height: 54px;
    border: none;
    box-sizing: border-box;
    border-radius: 8px;
    background: ${colors.blue1};
    color: ${colors.white};
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 20px;
    margin-top: 40px;
    @media (max-width: ${viewport.sm}) {
      width: 100%;
      height: 40px;
      font-size: 14px;
    }

    &:hover,
    &:focus,
    &:active {
      background: ${colors.blue2};
      color: ${colors.white};
    }
  `,
  LinkSimple: styled.a`
    padding-right: 3px;
  `,
  AreaClick: styled.a`
    width: 100%;
    height: 100%;
    padding: 30px;
  `
}
