import { makeVar, useReactiveVar } from '@apollo/client'
import { Button, Input, Modal, Tabs, Tooltip } from 'antd'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import BigNumber from 'bignumber.js'
import fromExponential from 'from-exponential'
import { useHistory } from 'react-router-dom'
import { MarketplaceERC20Item } from '../../../types/MarketplaceTypes'
import { colorsV2, fonts, viewportV2 } from '../../../styles/variables'
import { safeIpfsUrl, units } from '../../../services/UtilService'
import { getChainConfigById } from '../../../config'
import { accountVar, chainIdVar } from '../../../graphql/variables/WalletVariable'
import questionIcon from '../../../assets/icons/question-circle-gray.svg'
import { transactionLoadingVar, TransactionType, transactionVar } from '../../../graphql/variables/TransactionVariable'
import { notifySuccess } from '../../../services/NotificationService'
import { cancel as cancelAuction, updatePrice } from '../../../services/AuctionService'

export const updateListingModalVar = makeVar<MarketplaceERC20Item | undefined>(undefined)

export const UpdateListingModal = () => {
  const [selectedTab, setSelectedTab] = useState<string>('reserve price')
  const [reservePrice, setReservePrice] = useState<string>('')

  const updateListingModal = useReactiveVar(updateListingModalVar)
  const chainId = useReactiveVar(chainIdVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  const transaction = useReactiveVar(transactionVar)
  const account = useReactiveVar(accountVar)
  const history = useHistory()

  const { TabPane } = Tabs

  const { ethAddress, networkTokenSymbol } = getChainConfigById(chainId)

  const handleClose = () => {
    updateListingModalVar(undefined)
  }

  const handlePriceUpdate = () => {
    if (account && updateListingModal) {
      const fractionPrice = new BigNumber(units(reservePrice, updateListingModal?.paymentToken.decimals))
        .dividedBy(units(updateListingModal?.totalSupply, updateListingModal?.decimals))
        .toNumber()
        .toString(10)

      updatePrice(updateListingModal?.id, account, fromExponential(fractionPrice), chainId)
    }
  }

  const cancel = () => {
    if (account && updateListingModal) {
      cancelAuction(updateListingModal.id, account, chainId)
    }
  }

  const erc20TokenAsset = (addressToImage: string, tokenSymbol: string, type: 'image' | 'jazzIcon') => {
    return (
      <S.TokenAsset>
        {type === 'image' ? (
          <img alt={tokenSymbol} src={safeIpfsUrl(addressToImage)} />
        ) : (
          <Jazzicon diameter={24} seed={jsNumberForAddress(addressToImage)} />
        )}
        <span>{tokenSymbol?.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol || networkTokenSymbol}</span>
      </S.TokenAsset>
    )
  }

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.confirmed && transaction.type === TransactionType.bidUpdate) {
      notifySuccess('ERC20 reserve price updated successfully')
      updateListingModalVar(undefined)
    }
  }, [transactionLoading, transaction])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.confirmed && transaction.type === TransactionType.bidCancel) {
      notifySuccess('ERC20 auction cancelled successfully')
      history.push('/wallet/fractionalize')
      updateListingModalVar(undefined)
    }
  }, [transactionLoading, transaction, history])

  useEffect(() => {
    setReservePrice(updateListingModal?.exitPrice || '')
  }, [updateListingModal?.exitPrice])

  return (
    <S.Modal visible={!!updateListingModal} footer={null} onCancel={handleClose}>
      <S.Header>
        <h3>Update Listing</h3>
      </S.Header>
      <S.Content>
        <S.Tabs onChange={selectedKey => setSelectedTab(selectedKey)}>
          <TabPane key='reserve price' tab='Reserve Price' active={selectedTab === 'reserve price'}>
            <S.TabContent>
              <p>
                Since you are the owner of all the Fractions, you can update the Reserve Price. However, once you sell any Fraction, you
                won&apos;t be able to change it anymore.
              </p>
              <div>
                <span>
                  Reserve Price
                  <Tooltip title='Price to purchase the NFT'>
                    <img src={questionIcon} alt='Helping tip' />
                  </Tooltip>
                </span>
                <S.Input
                  addonBefore={erc20TokenAsset(
                    updateListingModal?.paymentToken.id || ethAddress,
                    updateListingModal?.paymentToken.symbol || networkTokenSymbol,
                    'jazzIcon'
                  )}
                  type='number'
                  onChange={e => setReservePrice(e.target.value)}
                  value={reservePrice}
                />
              </div>
              <Button onClick={handlePriceUpdate}>Update Price</Button>
            </S.TabContent>
          </TabPane>
          <TabPane key='redeem' tab='Redeem' active={selectedTab === 'redeem'}>
            <S.TabContent className='redeem'>
              <p>Since you are the owner of all the Fractions, you can redeem the NFT for yourself and cancel the listing.</p>
              <Button onClick={cancel} className='redeem'>
                Redeem
              </Button>
            </S.TabContent>
          </TabPane>
        </S.Tabs>
      </S.Content>
    </S.Modal>
  )
}

const S = {
  Modal: styled(Modal)`
    width: 100%;
    max-width: 480px;
    box-sizing: border-box;
    border-radius: 8px;

    * {
      font-family: ${fonts.nunito};
    }
    .ant-modal-content {
      border-radius: 8px;
    }
    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-close {
      display: none;
    }

    .ant-skeleton-title {
      width: 40px !important;
      margin-top: 4px !important;
      margin-left: auto;
    }

    .ant-skeleton-paragraph {
      margin: 0 !important;
      margin-left: auto;
    }

    header {
      height: 66px;
      font-size: 24px;
      line-height: 33px;
      color: ${colorsV2.gray[4]};
      font-weight: normal;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (min-width: ${viewportV2.mobile}) and (max-width: ${viewportV2.tablet}) {
      max-width: 360px;
    }
    @media (max-width: ${viewportV2.mobile}) {
      max-width: 320px;
    }
  `,
  Header: styled.div`
    width: 100%;
    height: 66px;
    display: flex;
    justify-content: center;
    background-color: ${colorsV2.gray[0]};
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    align-items: center;

    > h3 {
      font-size: 24px;
      line-height: 32px;
      font-weight: 400;
    }
  `,
  Content: styled.div`
    padding: 56px;
  `,
  TabContent: styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;

    > div {
      display: flex;
      flex-direction: column;
      gap: 20px;

      > span {
        display: flex;
        gap: 10px;

        > img {
          cursor: pointer;
        }
      }
    }

    > button {
      height: 40px;
      border-radius: 8px;
      border: none;
      box-shadow: none;
      outline: none;
      background-color: ${colorsV2.blue.main};
      color: ${colorsV2.white};
      font-size: 14px;
      line-height: 19px;

      &:focus,
      &:active {
        background-color: ${colorsV2.blue.main};
        color: ${colorsV2.white};
      }

      &:hover {
        background-color: ${colorsV2.blue.light};
        color: ${colorsV2.white};
      }

      &.redeem {
        background-color: ${colorsV2.green.main};

        &:focus,
        &:active {
          background-color: ${colorsV2.green.main};
          color: ${colorsV2.white};
        }

        &:hover {
          background-color: ${colorsV2.green.light};
          color: ${colorsV2.white};
        }
      }
    }
  `,
  Tabs: styled(Tabs)`
    .ant-tabs-nav-list {
      width: 100%;
      justify-content: space-around;
    }

    .ant-tabs-tab {
      margin: 0;
      color: ${colorsV2.gray['2']};
      font-size: 24px;

      &.ant-tabs-tab-active {
        color: ${colorsV2.blue.main};
      }
    }

    .ant-tabs-ink-bar {
      display: none;
    }
  `,
  Input: styled(Input)`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    height: 40px;
    box-shadow: none;
    outline: none;

    &:active,
    &:focus,
    &:hover {
      box-shadow: none;
      outline: none;
      border-color: #e7e7e7 !important;
    }

    &:disabled {
      border-radius: 8px;
      border: none;
      box-shadow: none;
      outline: none;
      background-color: ${colorsV2.gray['0']};
      text-align: right;
      padding-right: 16px;
      height: 40px;
    }

    &.disabled {
      > span {
        > span,
        > input {
          border: none;
          box-shadow: none;
          outline: none;
          background-color: ${colorsV2.gray['0']};
        }
      }
    }

    .ant-input-group-addon {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border-right: none;
      background-color: ${colorsV2.white};
      padding-left: 16px;
      height: 40px;

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
      background-color: ${colorsV2.white};
      border-left: none;
      text-align: right;
      padding-right: 16px;
      height: 40px;

      &:disabled {
        border-radius: 8px;
        border: none;
        box-shadow: none;
        outline: none;
        background-color: ${colorsV2.gray['0']};
        text-align: right;
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

    .ant-input-group-addon {
      width: 145px;
      > span {
        justify-content: flex-start;
      }
    }

    .ant-input-group-addon,
    .ant-input {
      border-color: ${colorsV2.gray['1']};
    }
  `,
  TokenAsset: styled.span`
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;

    > span {
      font-size: 16px;
      line-height: 20px;
    }
  `
}
