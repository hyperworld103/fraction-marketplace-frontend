import { Button, Divider, Skeleton, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { colors, colorsV2, fonts, viewport, viewportV2 } from '../../styles/variables'

export const FractionalizeDetailsCardsLoading: React.FC = () => {
  return (
    <S.Main>
      <S.Content>
        <S.NftImageBox>
          <S.TitleArea>
            <S.TitleBox>
              <h1>
                <Skeleton active paragraph={{ rows: 0 }} />
                <Skeleton active paragraph={{ rows: 0 }} />
              </h1>
            </S.TitleBox>
          </S.TitleArea>
          <S.Card>
            <Spin indicator={<Skeleton.Avatar active size={48} shape='circle' />} spinning />
          </S.Card>
        </S.NftImageBox>

        <S.DetailsBox>
          <S.NftDetails>
            <div className='sharedDetail'>
              <Skeleton active />
              <Divider />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton.Button className='button' active />
            </div>
          </S.NftDetails>
        </S.DetailsBox>
      </S.Content>
    </S.Main>
  )
}

const S = {
  Main: styled.div`
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 96px);
    background: ${props=>props.theme.white};
    display: flex;
    justify-content: center;
  `,
  Content: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;

    max-width: ${viewportV2.desktopXl};

    @media (max-width: ${viewport.xl}) {
      padding: 32px 24px;
    }

    @media (max-width: ${viewport.lg}) {
      flex-direction: column;
    }

    @media (max-width: ${viewport.sm}) {
      padding: 32px 8px;
    }
  `,
  NftDetails: styled.div`
    .ant-skeleton-button {
      width: 100% !important;
      height: 40px !important;
    }
    .description {
      margin-top: 28px;
      .ant-skeleton-element .ant-skeleton-avatar {
        vertical-align: baseline;
      }
      h3.ant-skeleton-title {
        margin: 0px 0px 8px 0px;
      }
      span.ant-skeleton-avatar.ant-skeleton-avatar-square.ant-spin-dot {
        border-radius: 8px;
      }
      .ant-skeleton-content .ant-skeleton-paragraph > li + li {
        margin-top: 8px;
      }
    }
    .sharedDetail {
      border: 1px solid ${props=>props.theme.gray['1']};
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      .ant-skeleton-element .ant-skeleton-avatar {
        vertical-align: baseline;
      }
      ul.ant-skeleton-paragraph {
        display: none;
      }
      h3.ant-skeleton-title {
        width: 100% !important;
        margin: 0px 0px 8px 0px;
        margin-bottom: 50px;
      }
      .ant-skeleton-button {
        width: 100px;
        height: 25px;
      }
      span.ant-skeleton-avatar.ant-skeleton-avatar-square.ant-spin-dot {
        border-radius: 8px;
      }
      .ant-skeleton-content .ant-skeleton-paragraph > li + li {
        margin-top: 8px;
      }
      .ant-skeleton-element {
        display: flex;
        justify-content: center;
      }
    }
  `,
  SharesDetails: styled.div``,
  NftImageBox: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-right: 48px;
    margin-bottom: 64px;

    @media (max-width: ${viewport.lg}) {
      justify-content: center;
      margin-right: 0;

      img {
        max-width: 440px;
        max-height: 440px;
      }
    }

    @media (max-width: ${viewport.sm}) {
      margin-bottom: 32px;
    }
  `,
  Card: styled.div`
    width: 100%;
    max-width: 544px;
    height: 544px;
    background: ${props=>props.theme.white};
    border: 1px solid transparent;
    box-sizing: border-box;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    .bg-fail {
      background: ${props=>props.theme.gray['0']};
    }
  `,
  DetailsBox: styled.div`
    flex: 1;
    max-width: 490px;

    @media (max-width: ${viewportV2.tablet}) {
      max-width: none;
    }
  `,
  TitleArea: styled.div`
    display: flex;
    flex-direction: row;
    max-width: 575px;

    @media (max-width: ${viewport.lg}) {
      max-width: 100%;
    }
  `,
  BuyNft: styled(Button)`
    height: 40px;
    padding: 0 32px;
    border-radius: 8px;
    font-family: ${fonts.nunito};
    font-weight: 400;
    color: ${props=>props.theme.gray['2']};

    @media (max-width: ${viewport.sm}) {
      width: 100%;
    }
  `,
  TitleBox: styled.div`
    flex: 1;
    max-width: 575px;
    font-family: ${fonts.nunito};
    .ant-btn-link {
      padding-left: 5px;
    }

    h1 {
      font-style: normal;
      font-weight: 400;
      font-size: 38px;
      line-height: 40px;
      margin-bottom: 4px;
      color: ${props=>props.theme.gray['2']};

      .ant-skeleton-element .ant-skeleton-avatar {
        vertical-align: baseline;
      }
      ul.ant-skeleton-paragraph {
        display: none;
      }
      h3.ant-skeleton-title {
        margin: 0px 0px 4px 0px;
      }
      span.ant-skeleton-avatar.ant-skeleton-avatar-square.ant-spin-dot {
        border-radius: 8px;
      }

      small {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: ${props=>props.theme.gray['1']};
        margin-left: 8px;
        font-weight: 400;
      }
    }

    @media (max-width: ${viewport.sm}) {
      h1 {
        line-height: 38px;
      }
    }
  `,
  BtnDesktop: styled.div`
    @media (max-width: ${viewport.sm}) {
      display: none;
    }
  `,
  BtnMobile: styled.div`
    display: none;

    @media (max-width: ${viewport.sm}) {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }
  `,
  Division: styled.div`
    width: 100%;
    height: 2px;
    background: ${props=>props.theme.gray['0']};
    margin: 36px 0;
    max-width: 575px;
    @media (max-width: ${viewport.lg}) {
      max-width: 100%;
    }
  `
}
