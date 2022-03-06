import { useReactiveVar } from '@apollo/client'
import { Button, Input, Select, Slider, Tooltip } from 'antd'
import { SelectValue } from 'antd/lib/select'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import *  as FaIcons from 'react-icons/fa';
import { getFeatureToggleByChainId } from '../../featureToggle'
import { paymentTokenVar, selectPaymentTokenModalVar } from '../../graphql/variables/FractionalizeVariables'
import { clearTransaction, transactionLoadingVar, transactionVar } from '../../graphql/variables/TransactionVariable'
import { accountVar } from '../../graphql/variables/WalletVariable'
import {
  approveErc721 as approveErc721Auction,
  fractionalizeErc721 as fractionalizeErc721AsAuction,
  getApproved721 as getApproved721Auction
} from '../../services/AuctionService'
import { approveErc721, fractionalizeErc721, getApproved721 } from '../../services/NftfyService'
import { notifySuccess } from '../../services/NotificationService'
import { formatShortAddress, scale } from '../../services/UtilService'
import { colorsV2, fonts, viewport, viewportV2 } from '../../styles/variables'
import { WalletErc721Item } from '../../types/WalletTypes'
import { Erc721Image } from '../shared/Erc721Image'
import { ImageToken } from '../shared/ImageToken'
import { API } from '../../constants/api'

interface FractionalizeERC721Props {
  chainId: number
  erc721: WalletErc721Item
  itemId: string
}

export const FractionalizeERC721 = ({ chainId, erc721, itemId }: FractionalizeERC721Props) => {
  const [communityFee, setCommunityFee] = useState<number>(1)
  const [reservePrice, setReservePrice] = useState('')
  const [fractionsTotal, setFractions] = useState('1000000')
  const [selectedTime, setSelectedTime] = useState<number>(1)
  const [releaseFractionalize, setReleaseFractionalize] = useState(true)
  const [approved, setApproved] = useState(false)
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [isInvalidSymbol, setIsInvalidSymbol] = useState<boolean>(false)
  const [isInvalidReservePrice, setIsInvalidReservePrice] = useState<boolean>(false)
  const [type, setType] = useState<'price' | 'bid'>('price')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const paymentToken = useReactiveVar(paymentTokenVar)

  const history = useHistory()
  const featureToggle = getFeatureToggleByChainId(chainId)
  const { Option } = Select

  const fractionDecimals = paymentToken.decimals < 8 ? 4 : 6
  const _reservePrice = scale(new BigNumber(reservePrice), paymentToken.decimals)
  const _fractionCount = scale(new BigNumber(fractionsTotal), fractionDecimals)
  console.log(paymentToken);
  console.log(_reservePrice, _fractionCount);

  const fractionPrice = _reservePrice.dividedBy(_fractionCount).toString()
  const fractionPriceMod = _reservePrice.modulo(_fractionCount).toNumber()

  const goBack = () => {
    history.push('/fractionalize')
  }

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 1 && e.target.value.length <= 40) {
      setName(e.target.value)
    } else {
      setName('')
    }
  }

  const handleSymbol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lettersOnly = new RegExp(/^[a-zA-Z\s]*$/)

    if (e.target.value && lettersOnly.test(e.target.value)) {
      setSymbol(e.target.value.toUpperCase())
    } else {
      setSymbol('')
    }
  }

  const handleReservePrice = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = event.target.value.replace(',', '.')

    if (price.length > 0) setReleaseFractionalize(true)
    if (!price.length || price === '0') setReleaseFractionalize(false)

    if (price.match(/^\d+([.]\d{0,18})?$/g) || !price.length) {
      setReservePrice(price)
    }
  }

  const handleFractionsAmount = (event: SelectValue) => {
    setFractions(event.toString())
  }

  const handleSelectedTime = (event: SelectValue) => {
    setSelectedTime(Number(event.toString()))
  }

  const approve = () => {
    if ( chainId && erc721) {
      let res = type === 'bid'
        ? approveErc721Auction(erc721?.address, Number(erc721?.tokenId))
        : approveErc721(erc721?.address, Number(erc721?.tokenId), chainId);
    }
  }

  const fractionalizeAsSetPrice = async () => {
    if ( chainId && erc721) {
      setIsLoading(true)
      await fractionalizeErc721(
        erc721.address,
        Number(erc721.tokenId),
        name,
        symbol,
        fractionPrice,
        fractionsTotal,
        fractionDecimals,
        paymentToken.address,
        chainId,
        itemId
      )
      setIsLoading(false)
    }
  }

  const fractionalizeAsAuction = async () => {
    if ( chainId && erc721) {
      setIsLoading(true)
      await fractionalizeErc721AsAuction(
        erc721.address,
        Number(erc721.tokenId),
        name,
        symbol,
        fractionPrice,
        fractionsTotal,
        fractionDecimals,
        paymentToken.address,
        communityFee.toString(10),
        selectedTime,
        chainId,
        itemId
      )
      setIsLoading(false)
    }
  }

  const tokenButton = (
    <S.TokenButton onClick={() => selectPaymentTokenModalVar(true)}>
      <div>
        <ImageToken address={paymentToken.address} symbol={paymentToken.symbol} input />
        <span>{paymentToken.symbol}</span>
      </div>
      <FaIcons.FaArrowDown style={{marginRight: '0.5rem', color: 'inherit'}}/>
    </S.TokenButton>
  )

  const canFractionalize = () => {
    return (
      !releaseFractionalize ||
      reservePrice === '' ||
      reservePrice === '0' ||
      fractionPriceMod > 0 ||
      name.length < 2 ||
      symbol.length < 2
    )
  }

  const copyAddress = () => {
    notifySuccess('Address copied!')
  }

  useEffect(() => {
    if (symbol) {
      setIsInvalidSymbol(symbol.length < 2 || symbol.length > 5)
    }
  }, [symbol])

  useEffect(() => {
    if (reservePrice) {
      setIsInvalidReservePrice(reservePrice === '0')
    }
  }, [reservePrice])

  useEffect(() => {
    const checkApproved = async () => {
      console.log("approved==========")
      if (chainId && !transactionLoading && erc721 && !isLoading) {
        const isApproved =
          type === 'bid'
            ? await getApproved721Auction(erc721?.address, Number(erc721?.tokenId), chainId)
            : await getApproved721(erc721?.address, Number(erc721?.tokenId), chainId);
            console.log(isApproved);
        setApproved(isApproved)
      }
    }
    checkApproved()
  }, [chainId, erc721, transactionLoading, type])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'fractionalize' && transaction.confirmed && !isLoading) {
      history.push(`/wallet/portfolio`)
      clearTransaction()
    }
  }, [transaction, transactionLoading, history, isLoading])

  useEffect(() => {
    if (fractionPriceMod > 0) {
      setReservePrice(Math.round(Number(reservePrice)).toString())
    }
  }, [_fractionCount, _reservePrice, fractionDecimals, fractionPriceMod, reservePrice])

  return (
    <S.Container>
      <div>
      <S.GoBack type='button' onClick={() => goBack()}>
          <FaIcons.FaArrowLeft style={{marginRight: '0.5rem'}}/>
          <span>Back</span>
        </S.GoBack>
      </div>
      <S.Content>
        <S.NftDetails>
          <span>
            <h2>
              {erc721.metadata?.name || `${erc721.name} #${erc721.tokenId}`}
            </h2>
            <S.CopyToClipboard onCopy={copyAddress} text={erc721.address}>
              <Tooltip placement='bottomLeft' title='Click to copy ERC721 address'>
                <small>{formatShortAddress(erc721.address)}</small>
                <FaIcons.FaCopy style={{marginLeft: '0.5rem'}}/>
              </Tooltip>
            </S.CopyToClipboard>
          </span>
          <div>
            <Erc721Image
                image={erc721.metadata?.imageFull || ''}
                name={erc721.metadata?.name || `${erc721.name} #${erc721.tokenId}`}
                animation={erc721.metadata?.animation_url}
                animationType={erc721.metadata?.animationType}          
            />
          </div>
          <div>
            <span>
              Token ID:
              {erc721.tokenId}
            </span>
            
            <a href={API.etherscan_url + erc721.address} target='_blank' rel='noopener noreferrer'>
              View on Etherscan
              <FaIcons.FaLink style={{marginLeft: '0.5rem'}}/>
            </a>
          </div>
        </S.NftDetails>
        <S.Fractionalize>
          <div>
            <h4>Fractionalize</h4>
          </div>
          <div>
            {featureToggle?.fractionalizeDetails.auction && (
              <S.FractionalizeItem>
                <span>Select your sell method</span>
                <div>
                  <S.FractionalizeTypeBox className={`${type === 'price' ? 'active' : ''}`} onClick={() => setType('price')}>
                    <h6>Set price</h6>
                    <small>Sell at a fixed price</small>
                  </S.FractionalizeTypeBox>
                  <S.FractionalizeTypeBox className={`${type === 'bid' ? 'active' : ''}`} onClick={() => setType('bid')}>
                    <h6>Highest bid</h6>
                    <small>Auction to the highest bidder</small>
                  </S.FractionalizeTypeBox>
                </div>
              </S.FractionalizeItem>
            )}
            {featureToggle?.fractionalizeDetails.auction && (
              <S.FractionalizeItem>
                <span className={`${type === 'price' ? 'disabled' : ''}`}>
                  <span>Community Fee</span>
                  <Tooltip title='Please choose how many fractions you want to airdrop to our community (min:1% / max: 20%)'>
                    <FaIcons.FaQuestion style={{margin: '0.5rem 0'}}/>
                  </Tooltip>
                </span>
                <S.SliderContainer>
                  <span>1%</span>
                  <Slider
                    tooltipVisible
                    value={communityFee}
                    onChange={(value: number) => setCommunityFee(value)}
                    className={`${type === 'price' ? 'disabled' : ''}`}
                    disabled={type === 'price'}
                    max={20}
                    min={1}
                  />
                  <span>20%</span>
                </S.SliderContainer>
              </S.FractionalizeItem>
            )}
            {featureToggle?.fractionalizeDetails.auction && (
              <S.FractionalizeItem>
                <span className={`${type === 'price' ? 'disabled' : ''}`}>
                  <span>Timer</span>
                  <Tooltip title='Time that the auction will last once the Reserve Price is met.'>
                    <FaIcons.FaQuestion style={{margin: '0.5rem 0'}}/>
                  </Tooltip>
                </span>
                <Select disabled={type === 'price'} onSelect={handleSelectedTime} defaultValue={1}>
                  <Option value={1} className='select-open'>24H</Option>
                  {[...Array(13)].map((val, index) => (
                    <Option key={Math.random()} value={index + 2} className='select-open'>{`${index + 2} days`}</Option>
                  ))}
                </Select>
              </S.FractionalizeItem>
            )}
            <S.FractionalizeItem>
              <span>
                <span>Name</span>
                <Tooltip title='Name of your Fractions'>
                  <FaIcons.FaQuestion style={{margin: '0.5rem 0'}}/>
                </Tooltip>
              </span>
              <Input name='name' onChange={event => handleName(event)} value={name} />
            </S.FractionalizeItem>
            <S.FractionalizeItem>
              <span>
                <span>Symbol</span>
                <Tooltip title='Symbol of your Fractions(up to 5 letters)'>
                  <FaIcons.FaQuestion style={{margin: '0.5rem 0'}}/>
                </Tooltip>
              </span>
              <Input maxLength={5} className={`${isInvalidSymbol ? 'error' : ''}`} onChange={event => handleSymbol(event)} value={symbol} />
              <small className='error'>{isInvalidSymbol && `The symbol must have between 2 and 5 characters`}</small>
            </S.FractionalizeItem>
            <S.FractionalizeItem>
              <span>
                <span>Fractions</span>
                <Tooltip title='Fractions Total Supply'>
                  <FaIcons.FaQuestion style={{margin: '0.5rem 0'}}/>
                </Tooltip>
              </span>

              <S.Select defaultValue='1000000' onChange={handleFractionsAmount}>
                <Option value='10' className='select-open'>10</Option>
                <Option value='100' className='select-open'>100</Option>
                <Option value='1000' className='select-open'>1.000</Option>
                <Option value='10000' className='select-open'>10.000</Option>
                <Option value='100000' className='select-open'>100.000</Option>
                <Option value='1000000' className='select-open'>1.000.000</Option>
              </S.Select>
            </S.FractionalizeItem>
            <S.FractionalizeItem>
              <span>
                <span>Reserve Price</span>
                <Tooltip title='Price to purchase the NFT'>
                  <FaIcons.FaQuestion style={{margin: '0.5rem 0'}}/>
                </Tooltip>
              </span>
              <Input
                className={`${isInvalidReservePrice ? 'error' : ''}`}
                addonBefore={tokenButton}
                onChange={event => handleReservePrice(event)}
                value={reservePrice}
              />
              <small className='error'>{isInvalidReservePrice && `The reserve price must be bigger than 0`}</small>
            </S.FractionalizeItem>
            <S.FractionalizeItem>
              {!approved && <Button onClick={approve}>Unlock Fractionalize</Button>}
              {approved && (
                <Button
                  loading={isLoading}
                  onClick={() => (type === 'bid' ? fractionalizeAsAuction() : fractionalizeAsSetPrice())}
                  disabled={canFractionalize()}>
                  Fractionalize
                </Button>
              )}
            </S.FractionalizeItem>
          </div>
        </S.Fractionalize>
      </S.Content>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    color: ${props=>props.theme.gray['4']}
  `,
  Content: styled.div`
    display: flex;

    flex-direction: column;
    align-items: center;

    @media (min-width: ${viewportV2.desktop}) {
      flex-direction: row;
      align-items: flex-start;
    }

    div {
      flex: 1;
    }
  `,
  Fractionalize: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 2rem;
    max-width: 460px;

    @media (max-width: ${viewportV2.tablet}) {
      max-width: 100%;
      margin-bottom: 48px;
    }

    @media (max-width: ${props=>props.theme.viewport.desktop}) {
      margin-left: 1rem;
      margin-right: 0;
    }
    @media (max-width: ${props=>props.theme.viewport.tablet}) {
      margin-left: 0px;
      margin-right: 0;
    }

    > div {
      width: 100%;

      &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        background-color: ${props=>props.theme.gray['0']};
        border: 1px solid ${props=>props.theme.gray['2']};
        height: 66px;
        display: flex;
        justify-content: center;
        align-items: center;

        > h4 {
          color: ${props=>props.theme.gray['4']};
          font-weight: 600;
          font-size: 24px;
          line-height: 64px;
        }
      }

      &:last-child {
        border: 1px solid ${colorsV2.gray['1']};
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
        border-top: none;
        padding: 24px 40px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    }
  `,
  NftDetails: styled.div`
    display: flex;
    flex-direction: column;
    gap: 22px;
    color: ${props=>props.theme.black};
    padding: 2rem;

    @media (max-width: ${props=>props.theme.viewport.desktop}) {
      padding-right: 1rem;
      padding-left: 0px;
    }
    @media (max-width: ${props=>props.theme.viewport.tablet}) {
      padding-right: 0px;
      padding-left: 0px;
    }
    a,
    span {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      width: fit-content;
    }

    a {
      color: ${colorsV2.blue.main};
      transition: color 250ms ease-in;
      display: flex;
      gap: 6px;
      align-items: center;

      &:hover {
        color: ${colorsV2.blue.lighter};
      }
    }

    span {
      color: ${props=>props.theme.black};

      > h2 {
        font-size: 40px;
        line-height: 54px;
        display: flex;
        align-items: center;
        gap: 24px;
        color: ${props=>props.theme.black};

        > button {
          background-color: ${props=>props.theme.black};
          cursor: default;
          border-radius: 16px;
          color: ${props=>props.theme.white};
          height: 32px;

          &:hover,
          &:active,
          &:focus {
            outline: none;
            box-shadow: none;
            border: none;
            background-color: ${props=>props.theme.black};
            color: ${props=>props.theme.white};
          }

          > span {
            color: ${props=>props.theme.white};
            font-size: 12px;
            line-height: 16px;
            font-weight: 600;
          }
        }
      }

      > span {
        font-size: 12px;
      }
    }

    > h4 {
      font-size: 20px;
      font-weight: 600;
      color: ${props=>props.theme.white};
    }

    > div {
      display: flex;
      flex-direction: column;
    }
  `,
  FractionalizeItem: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    > div {
      display: flex;
      gap: 16px;

      .ant-slider-track {
        background-color: ${colorsV2.blue.main} !important;
      }

      .ant-slider-handle {
        background-color: ${colorsV2.blue.darker};
        border-color: ${colorsV2.blue.darker};
      }

      .disabled {
        .ant-slider-rail {
          background-color: ${props=>props.theme.gray['0']} !important;

          &:hover {
            background-color: ${props=>props.theme.gray['0']} !important;
          }
        }

        > .ant-slider-handle {
          display: none;
        }
      }
    }

    > span {
      font-size: 18px;
      line-height: 24px;
      color: ${props=>props.theme.gray['4']};
      font-weight: 400;
      display: flex;
      justify-content: space-between;

      &.disabled {
        color: ${props=>props.theme.gray['2']};
      }

      > img {
        cursor: pointer;
      }
    }

    .error {
      border-color: ${colorsV2.red.main} !important;

      .ant-input-group-addon,
      .ant-input {
        border-color: ${colorsV2.red.main} !important;
      }
    }

    small {
      &.error {
        color: ${colorsV2.red.main} !important;
        height: 10px;
      }
    }

    input {
      height: 40px;
      border-radius: 8px;
      background: ${props=>props.theme.gray['0']} !important;
      border: 1px solid ${props=>props.theme.gray['2']} !important;
      color: ${props=>props.theme.gray['4']} !important;
    }

    .ant-select-selector {
      height: 40px !important;
      border-radius: 8px !important;
      background: ${props=>props.theme.gray['0']} !important;
      border: 1px solid ${props=>props.theme.gray['2']} !important;
      color: ${props=>props.theme.gray['4']} !important;
    }

    .ant-select-arrow {
      color: ${props=>props.theme.gray['3']};
    }

    .ant-select-selection-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .ant-input-group-addon {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border-right: ${props=>props.theme.gray['0']};
      background-color: ${props=>props.theme.white};
      padding: 0 16px;
      height: 40px;

      &:active,
      &:focus,
      &:hover {
        background-color: ${props=>props.theme.gray['1']};
      }

      > span {
        > img {
          height: 24px;
          width: 24px;
        }
      }
    }

    .ant-input {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      background-color: ${props=>props.theme.white};
      padding-right: 16px;
      height: 40px;

      &:disabled {
        border-radius: 8px;
        border: none;
        box-shadow: none;
        outline: none;
        background-color: ${props=>props.theme.gray['0']};
        padding-right: 16px;
        height: 40px;
      }

      &:active,
      &:focus,
      &:hover {
        box-shadow: none;
        outline: none;
      }
    }

    .ant-input-group {
      display: flex;
    }

    .ant-input-group-addon {
      width: 145px;
      > span {
        justify-content: flex-start;
      }
    }

    .ant-input-group-addon,
    .ant-input {
      border-color: ${props=>props.theme.gray['1']};
    }

    > button {
      border-radius: 8px;
      border: none;
      background-color: ${props=>props.theme.blue.dark};
      height: 40px;
      transition: 250ms background-color ease-in;

      &:focus {
        background-color: ${props=>props.theme.blue.main};
        > span {
          color: ${props=>props.theme.black};
          font-weight: 500;
          font-size: 16px;
          line-height: 20px;
        }
      }

      &:active,
      &:hover {
        background-color: ${props=>props.theme.blue.lighter};
        > span {
          color: ${props=>props.theme.white};
          font-weight: 500;
          font-size: 16px;
          line-height: 20px;
        }
      }

      &:disabled {
        background-color: ${colorsV2.blue.light};
        > span {
          color: ${props=>props.theme.black};
          font-weight: 500;
          font-size: 16px;
          line-height: 20px;
        }

        &:active,
        &:hover {
          background-color: ${colorsV2.blue.light};
          > span {
            color: ${props=>props.theme.white};
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
          }
        }
      }

      > span {
        color: ${props=>props.theme.black};
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
      }
    }
  `,
  SliderContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 8px !important;

    > span {
      font-size: 12px;
      line-height: 16px;
      color: ${props=>props.theme.gray['2']};
    }

    > div {
      width: 100%;
    }
  `,
  FractionalizeTypeBox: styled.div`
    cursor: pointer;
    border: 1px solid ${props=>props.theme.gray['2']};
    border-radius: 8px;
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: background-color 250ms ease-in;
    text-align: center;
    padding: 0 16px;

    > h6 {
      color: ${props=>props.theme.gray['4']};
      font-size: 14px;
      line-height: 20px;
      font-weight: 600;
    }

    > small {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: ${props=>props.theme.gray['3']};
    }

    &:hover {
      background-color: ${props=>props.theme.gray['1']};
    }

    &.active {
      background-color: ${props=>props.theme.gray['1']};
      border-color: ${colorsV2.blue.main};
    }
  `,
  BoxContainer: styled.div`
    flex-direction: column;

    > h3 {
      color: ${colorsV2.black};
      font-size: 32px;
      line-height: 44px;
      margin: 64px 0 32px;
      font-weight: 400;
    }
    > div {
      display: flex;
      width: 100%;
      gap: 30px 10px;
      flex-wrap: wrap;

      @media (max-width: ${viewportV2.desktop}) {
        gap: 20px;
      }

      @media (max-width: ${viewportV2.tablet}) {
        gap: 20px 10px;
        justify-content: center;
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
  Select: styled(Select)`
    width: 100%;
    max-width: none !important;
    height: 40px;

    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    .ant-select-selector {
      width: 100%;
      height: 40px !important;

      background: ${props=>props.theme.white};
      border-radius: 8px !important;
      border: none;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-family: ${fonts.nunito} !important;
      color: ${props=>props.theme.gray[3]};
      padding-right: 15px;
      outline: none !important;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ant-select-arrow {
      color: ${props=>props.theme.gray['3']};
    }
  `,
  TokenButton: styled.div`
    cursor: pointer;
    width: 128px;
    height: 40px;
    border: none;
    display: flex;
    align-items: center;
    user-select: none;
    justify-content: space-around !important;
    transition: background-color 0.5s;
    color: ${props=>props.theme.gray['4']};

    span {
      margin-right: 8px;
      font-family: ${fonts.nunito};
      font-weight: 400;
      color: ${props=>props.theme.gray['4']};
      font-size: 14px;
    }

    img:nth-child(3) {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: ${props=>props.theme.white};
      cursor: pointer;
    }

    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 4px;
      }
    }
  `,
  GoBack: styled.button`
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background: none;
    margin-top: 1rem;
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
