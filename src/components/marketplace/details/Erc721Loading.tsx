import { Button, Skeleton, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { DefaultPageTemplate } from '../../../pages/shared/templates/DefaultPageTemplate'
import { colors, colorsV2, fonts, viewport } from '../../../styles/variables'

export const Erc721Loading: React.FC = () => {
  return (
    <DefaultPageTemplate>
      <S.BackBox>
        <S.ExitPriceArea>
          <div>
            <Skeleton active paragraph={{ rows: 0 }} />
          </div>
        </S.ExitPriceArea>
      </S.BackBox>
      <S.Nft>
        <S.NftImageBox>
          <S.Card>
            <Spin indicator={<Skeleton.Avatar active size={48} shape='circle' />} spinning />
          </S.Card>
        </S.NftImageBox>
        <S.DetailsBox>
          <S.NftDetails>
            <S.TitleArea>
              <S.TitleBox>
                <h1>
                  <Skeleton active paragraph={{ rows: 0 }} />
                  <Skeleton active paragraph={{ rows: 0 }} />
                </h1>
              </S.TitleBox>
            </S.TitleArea>
            <S.ExitPriceArea>
              <div>
                <Skeleton active paragraph={{ rows: 0 }} />
                <Skeleton active paragraph={{ rows: 0 }} />
                <Skeleton active paragraph={{ rows: 0 }} />
              </div>
            </S.ExitPriceArea>
            <div className='description'>
              <Skeleton active title={false} paragraph={{ rows: 4 }} />
            </div>
            <div className='sharedDetail'>
              <Skeleton active paragraph={{ rows: 0, width: '150' }} />
              <Skeleton active paragraph={{ rows: 0, width: '200' }} />
              <Skeleton active paragraph={{ rows: 0, width: '100' }} />
            </div>
            <div>
              <Skeleton.Button active size='large' shape='square' />
            </div>
          </S.NftDetails>
        </S.DetailsBox>
      </S.Nft>
    </DefaultPageTemplate>
  )
}

const S = {
  Main: styled.div`
    width: 100%;
    min-height: calc(100vh - 96px);
    background: ${colorsV2.white};
    display: flex;
    justify-content: center;
  `,
  Nft: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;

    @media (max-width: ${viewport.md}) {
      flex-direction: column;
      justify-content: center;
    }
  `,
  BackBox: styled.div`
    flex-direction: row;
    width: 100%;
    > div {
      margin: 0 0 8px 0;
    }
  `,
  NftDetails: styled.div`
    .description {
      margin: 32px 0;
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
      margin: 32px 0;

      .ant-skeleton-element .ant-skeleton-avatar {
        vertical-align: baseline;
      }
      ul.ant-skeleton-paragraph {
        display: none;
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
  `,
  SharesDetails: styled.div``,
  NftImageBox: styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    margin-right: 128px;
    margin-bottom: 64px;

    @media (max-width: ${viewport.lg}) {
      width: 100%;

      img {
        max-width: 304px;
        max-height: 370px;
      }
    }

    @media (max-width: ${viewport.md}) {
      margin: 0 auto 48px;
      justify-content: center;
    }

    @media (max-width: ${viewport.sm}) {
      margin-bottom: 32px;
    }
  `,
  Card: styled.div`
    width: 100%;
    max-width: 509px;
    height: 544px;
    background: ${colors.white};
    border: 1px solid ${colorsV2.gray['1']};
    box-sizing: border-box;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;

    @media (max-width: ${viewport.xl}) {
      max-width: 304px;
      height: 370px;
    }

    .bg-fail {
      background: ${colors.white2};
    }
  `,
  DetailsBox: styled.div`
    flex: 1;
    max-width: 575px;
    width: 100%;
    margin-bottom: 48px;
  `,
  TitleArea: styled.div`
    display: flex;
    flex-direction: row;
    max-width: 575px;

    max-width: 100%;

    @media (max-width: ${viewport.lg}) {
      max-width: 100%;
    }
  `,
  BuyNft: styled(Button)`
    height: 40px;
    padding: 0 32px;
    border-radius: 8px;
    font-family: ${fonts.nunito};
    font-weight: 500;
    color: ${colors.gray};
    margin: 32px 0;

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
      font-weight: 500;
      font-size: 38px;
      line-height: 40px;
      margin-bottom: 4px;
      color: ${colors.gray2};

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
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        color: ${colors.gray1};
        margin-left: 8px;
        font-weight: 500;
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
      margin: 32px 0;
    }
  `,
  Division: styled.div`
    width: 100%;
    height: 2px;
    background: ${colors.gray3};
    margin: 32px 0;
    @media (max-width: ${viewport.lg}) {
      max-width: 100%;
    }
  `,
  ExitPriceArea: styled.div`
    display: flex;
    flex-direction: row;
    max-width: 575px;
    justify-content: space-between;
    margin: 32px 0;

    max-width: 100%;

    @media (max-width: ${viewport.sm}) {
      flex-direction: column;
    }

    > div {
      width: 200px;
      display: flex;
      flex-direction: column;

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
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: ${viewport.sm}) {
        width: 100%;
      }

      span.ant-skeleton-button.ant-skeleton-button-lg.ant-skeleton-button-square {
        width: 126.22px;
        height: 40px;
        margin-top: 32px;
        @media (max-width: ${viewport.sm}) {
          width: 300px;
        }
      }
      .ant-skeleton.ant-skeleton-element.ant-skeleton-active {
        align-self: flex-end;
        @media (max-width: ${viewport.sm}) {
          align-self: center;
        }
      }
    }

    @media (max-width: ${viewport.lg}) {
      max-width: 100%;
    }
  `
}
