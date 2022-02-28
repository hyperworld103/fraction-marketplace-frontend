import { useReactiveVar } from '@apollo/client'
import { Empty, Image, Tooltip } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import styled from 'styled-components'
import *  as FaIcons from 'react-icons/fa';
import notFount from '../../assets/notfound.svg'
import BuyModal from '../../components/marketplace/BuyModal'
import { Auction } from '../../components/marketplace/details/Auction'
import { AuctionDetail } from '../../components/marketplace/details/AuctionDetail'
import { Erc721Loading } from '../../components/marketplace/details/Erc721Loading'
import { PlaceBidModal } from '../../components/marketplace/details/PlaceBidModal'
import { SetPrice } from '../../components/marketplace/details/SetPrice'
import { TradeFractions } from '../../components/marketplace/details/TradeFractions'
import { UpdateListingModal, updateListingModalVar } from '../../components/marketplace/details/UpdateListingModal'
import { PeerToPeerTradeModal } from '../../components/marketplace/PeerToPeerTradeModal'
import { PeerToPeerTradeSaveModal } from '../../components/marketplace/PeerToPeerTradeSaveModal'
import { Erc721Image } from '../../components/shared/Erc721Image'
import { SelectPaymentTokenModal } from '../../components/shared/SelectPaymentTokenModal'
import { getChainConfigById } from '../../config'
import { assetsModalMarketplaceVar, buyModalLiquidityVar, selectedAssetVar } from '../../graphql/variables/MarketplaceVariable'
import { placeBidModalVar } from '../../graphql/variables/PlaceBidVariables'
import { transactionLoadingVar } from '../../graphql/variables/TransactionVariable'
import { useFeatureToggle } from '../../hooks/ConfigHook' 
import { marketplaceService, setMarketplaceItemLiquidity } from '../../services/MarketplaceService'
import { notifySuccess } from '../../services/NotificationService'
import { zeroXQuoteService } from '../../services/QuoteService'
import { formatShortAddress, units } from '../../services/UtilService'
import { getErc20Balance } from '../../services/WalletService'
import { colorsV2, fonts, viewport } from '../../styles/variables'
import { BoxAsset } from '../../types/BoxTypes'
import { MarketplaceERC20Item } from '../../types/MarketplaceTypes'
import { AssetERC20 } from '../../types/WalletTypes'
import { DefaultPageTemplate } from '../shared/templates/DefaultPageTemplate'

export interface DefaultMarketplaceDetailsPageProps {
  address: string
  itemId: string
  account: string | undefined
  selectedChainId: number
}

export default function DefaultMarketplaceDetailsPage({ address, itemId, selectedChainId, account }: DefaultMarketplaceDetailsPageProps) {
  const isVisible = useReactiveVar(assetsModalMarketplaceVar)
  const placeBidModal = useReactiveVar(placeBidModalVar)

  const history = useHistory()

  const [erc20, setErc20] = useState<MarketplaceERC20Item | null | undefined>(undefined)
  const [isBox, setIsBox] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nftsIntroBox, setNftsIntroBox] = useState<BoxAsset | undefined>(undefined)
  const [erc20PaymentBalance, setErc20PaymentBalance] = useState<string | undefined>(undefined)
  const [participation, setParticipation] = useState<BigNumber>(new BigNumber(0))
  const [exitPriceDollar, setExitPriceDollar] = useState<string | undefined>(undefined)

  const { boxAddress } = getChainConfigById(selectedChainId)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const featureToggle = useFeatureToggle()
  const updateListingModal = useReactiveVar(updateListingModalVar)

  const settingsSlider = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 13,
    slidesToScroll: 13,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 10,
          slidesToScroll: 10
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 8
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ],
    nextArrow: <S.ArrowSlick />,
    prevArrow: <S.ArrowSlick />
  }

  useEffect(() => {
    const getNft = async () => {
      if (address && selectedChainId && !updateListingModal) {
        setIsLoading(true)
        const nft = await marketplaceService(selectedChainId, 2).getMarketplaceItemByAddress(address, itemId)
        if (!nft) {
          setErc20(null)
          setIsLoading(false)
          return
        }
        const nftWithLiquidity = await setMarketplaceItemLiquidity(nft, selectedChainId)

        setErc20(nftWithLiquidity)
        setIsLoading(false)
      }
    }
    if (!placeBidModal) {
      getNft()
    }
  }, [address, boxAddress, selectedChainId, placeBidModal, updateListingModal])

  useEffect(() => {
    const getExitPriceDollar = async () => {
      const exitAmount = units(erc20?.exitPrice || '1', erc20?.paymentToken.decimals || 6)

      const quoteDollar = await zeroXQuoteService().quoteToStablecoin(
        erc20?.paymentToken.id || '',
        exitAmount,
        erc20?.paymentToken.decimals || 6,
        selectedChainId
      )

      const exitPriceDollarValue = quoteDollar.priceDollar === '' ? '0' : quoteDollar.priceDollar.replaceAll(',', '')

      setExitPriceDollar(exitPriceDollarValue)
    }

    const checkLiquidity = async () => {
      if (!erc20 || !erc20.liquidity) {
        return
      }

      buyModalLiquidityVar(erc20.liquidity.hasLiquidity)
    }
    featureToggle?.marketplaceDetails.priceQuotation && getExitPriceDollar()
    checkLiquidity()
  }, [selectedChainId, erc20, featureToggle?.marketplaceDetails.priceQuotation, transactionLoading])

  useEffect(() => {
    const getShareBalance = async () => {
      if (account && erc20?.id) {
        const balance = await getErc20Balance(erc20?.id, erc20?.decimals, selectedChainId)
        setParticipation(new BigNumber(balance).div(new BigNumber(erc20?.totalSupply)).multipliedBy(100))
      }
    }
    getShareBalance()
  }, [account, address, selectedChainId, erc20?.id, erc20?.decimals, transactionLoading, erc20?.totalSupply])

  useEffect(() => {
    const getPaymentTokenBalance = async () => {
      if (account && erc20?.paymentToken?.id && erc20?.paymentToken?.decimals) {
        const balance = await getErc20Balance(erc20?.paymentToken.id, erc20?.paymentToken.decimals, selectedChainId)
        setErc20PaymentBalance(balance.toString())
      }
    }
    getPaymentTokenBalance()
  }, [account, address, selectedChainId, erc20?.paymentToken.id, erc20?.paymentToken.decimals, transactionLoading])

  if (isLoading) {
    return <Erc721Loading />
  }

  if (!erc20) {
    return <DefaultPageTemplate>{!erc20 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</DefaultPageTemplate>
  }

  const copyAddress = () => {
    notifySuccess('Address copied!')
  }

  const isAudioType = (): boolean => {
    if (!erc20) {
      return true
    }

    return (
      !!erc20.metadata?.animationType?.includes('audio') ||
      !!erc20.metadata?.animationType?.includes('mp3') ||
      !!erc20.metadata?.animationType?.includes('mpeg') ||
      !!erc20.metadata?.animation_url?.includes('.mp3') ||
      !erc20.metadata?.animation_url
    )
  }

  const goBack = () => {
    history.push('/marketplace')
  }

  const image = String(erc20.metadata?.image)

  return (
    <DefaultPageTemplate>
      <div id='details'>
        <div>
          <S.GoBack type='button' onClick={() => goBack()}>
            <FaIcons.FaArrowLeft style={{marginRight: '0.5rem'}}/>
            <span>Back</span>
          </S.GoBack>
        </div>
        <S.SectionMetadata>
          <article>
            {erc20 && (
              <Erc721Image
                image={image.includes('https://lh3?') ? `${image}-=s550-c` : image}
                name={erc20.metadata?.name || ''}
                animation={!isAudioType() ? erc20.metadata?.animation_url : ''}
                animationType={erc20.metadata?.animationType}
              />
            )}
          </article>
          <article>
            <header>
              <h3>
                <span>{erc20?.metadata?.name}</span>
                <small>{erc20?.symbol}</small>
              </h3>
              {erc20?.id && (
                <S.CopyToClipboard onCopy={copyAddress} text={erc20?.target.collection.id}>
                  <Tooltip placement='bottomLeft' title='Click to copy ERC721 address'>
                    <small>{formatShortAddress(erc20?.target.collection.id)}</small>
                    <FaIcons.FaCopy style={{marginLeft: '0.5rem'}}/>
                  </Tooltip>
                </S.CopyToClipboard>
              )}
            </header>
            {(erc20.type === 'SET_PRICE' || (erc20.type === 'AUCTION' && erc20.bids?.length === 0)) && <SetPrice erc20={erc20} />}
            {erc20.type === 'AUCTION' && erc20?.bids && erc20.bids?.length > 0 && <Auction erc20={erc20} />}
          </article>
        </S.SectionMetadata>
      </div>
      <div id='trade'>
        {(erc20.type === 'SET_PRICE' || (erc20.type === 'AUCTION' && !erc20.bids?.length)) && <TradeFractions erc20={erc20} />}
        {erc20.type === 'AUCTION' && erc20?.bids && erc20.bids?.length > 0 && <AuctionDetail erc20={erc20} />}
      </div>

      <PeerToPeerTradeModal />
      <PeerToPeerTradeSaveModal />
      {erc20 && <BuyModal />}
      {erc20 && (
        <SelectPaymentTokenModal
          location='marketplace'
          visible={isVisible}
          onCancel={() => assetsModalMarketplaceVar(false)}
          onSelect={(erc20Item: AssetERC20) => {
            selectedAssetVar(erc20Item)
            assetsModalMarketplaceVar(false)
          }}
        />
      )}
      {erc20 && placeBidModal && (
        <PlaceBidModal
          erc20={erc20}
          firstBid={erc20.bids?.length === 0}
          erc20PaymentBalance={String(erc20PaymentBalance)}
          participationInErc20={String(participation)}
          exitPriceDollar={String(exitPriceDollar)}
          account={String(account)}
          chainId={selectedChainId}
        />
      )}
      {erc20 && <UpdateListingModal />}
    </DefaultPageTemplate>
  )
}

const S = {
  SectionMetadata: styled.section`
    margin: 4px 0 62px;
    display: grid;
    gap: 128px;
    grid-template-columns: 1fr 1fr;
    @media (max-width: ${viewport.xl}) {
      margin: 48px 0;
    }
    @media (max-width: ${viewport.md}) {
      gap: 32px;
    }
    @media (max-width: ${viewport.sm}) {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    > article {
      &:first-child {
        height: 544px;
        width: 544px;
        @media (max-width: ${viewport.xl}) {
          width: 350px;
          height: 350px;
        }
        @media (max-width: ${viewport.md}) {
          align-self: center;
        }

        > img {
          width: 100%;
          height: 100%;
        }
      }

      &:last-child {
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        width: 100%;

        > header {
          margin-bottom: 24px;

          > h3 {
            font-weight: 400;
            font-size: 28px;
            line-height: 54px;
            color: ${props=>props.theme.black};

            > small {
              margin-left: 10px;
              font-size: 16px;
              font-weight: 400;
              line-height: 20px;
            }

            @media (min-width: ${viewport.md}) {
              font-size: 34px;
            }

            @media (min-width: ${viewport.lg}) {
              font-size: 36px;
            }
          }
        }
      }
    }
  `,
  Slider: styled(Slider)`
    height: 80px;
    margin-bottom: 70px;
    .slick-next {
      right: 0px !important;
    }
  `,
  CardBox: styled.div`
    img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
    }
  `,
  TitleBoxContent: styled.h1`
    font-weight: normal;
    font-size: 32px;
    line-height: 44px;
    margin-top: 27px;
    margin-bottom: 23px;
    color: ${props => props.theme.black};
  `,
  ArrowSlick: styled.div`
    &.slick-disabled {
      display: none !important;
    }
    ::before {
      color: ${props => props.theme.black};
    }
    ::after {
      color: ${props => props.theme.black};
    }
  `,
  SectionTrade: styled.section`
    display: flex;
    width: 100%;
    flex-direction: column;
    margin: 48px 0;

    > article {
      &:nth-child(1) {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 48px;
        @media (max-width: ${viewport.md}) {
          justify-content: center;
          flex-direction: column;
          gap: 32px;
        }
      }

      &:nth-child(2) {
        display: grid;
        margin-bottom: 24px;
      }

      &:nth-child(3) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        margin-bottom: 32px;
        @media (max-width: ${viewport.md}) {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      }

      &:nth-child(4) {
        > h3 {
          margin-bottom: 6px;
          color: ${props=>props.theme.black};
          font-size: 20px;
          font-weight: 500;
          line-height: 26px;
          @media (max-width: ${viewport.md}) {
            margin-bottom: 12px;
          }
        }
      }
    }
  `,
  ItemDetailsInfo: styled.div`
    > h3 {
      color: ${props=>props.theme.gray['4']};
      font-size: 32px;
      line-height: 42px;
      font-weight: 500;

      > small {
        margin-left: 10px;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: ${props=>props.theme.gray['3']};
      }
    }

    > div {
      > span {
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${props=>props.theme.gray['3']};
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;

        button {
          text-decoration: none;
          color: ${props=>props.theme.gray['3']};
          background: none;
          border: none;
          outline: none;
          cursor: pointer;
          height: 16px;
          width: 16px;

          > img {
            height: 16px;
            width: 16px;
          }
        }
      }
    }
  `,
  CopyToClipboard: styled(CopyToClipboard)`
    font-size: 12px;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 500;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${props=>props.theme.gray['3']};

    h6 {
      color: ${props=>props.theme.gray['3']};
      font-size: 14px;
      line-height: 18px;
    }

    img {
      margin-left: 8px;
      width: 12px;
      height: 12px;
    }

    &:hover {
      opacity: 0.8;
    }

    @media (max-width: ${viewport.sm}) {
      h6 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `,
  GoBack: styled.button`
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background: none;
    color: ${props=>props.theme.gray['4']};
    cursor: pointer;
    > img {
      height: 8px;
      width: 9px;
      margin-right: 6px;
    }
    span {
      font-size: 14px;
      line-height: 18px;
    }
  `
}
