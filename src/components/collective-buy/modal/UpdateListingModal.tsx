import { makeVar, useReactiveVar } from '@apollo/client'
import { Button, Input, Modal, Tabs, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import questionIcon from '../../../assets/icons/question-circle-gray.svg'
import { getChainConfigById } from '../../../config'
import { transactionLoadingVar, TransactionType, transactionVar } from '../../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../../../graphql/variables/WalletVariable'
import { collectiveBuyService } from '../../../services/CollectiveBuyService'
import { notifySuccess } from '../../../services/NotificationService'
import { safeIpfsUrl } from '../../../services/UtilService'
import { CollectiveBuyMarketplaceItem } from '../../../types/CollectiveBuyTypes'

export const updateListingModalVar = makeVar<CollectiveBuyMarketplaceItem | undefined>(undefined)

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
      collectiveBuyService().updatePrice(updateListingModal.id, reservePrice, updateListingModal.paymentToken.decimals, account, chainId)
    }
  }

  const cancel = () => {
    if (account && updateListingModal) {
      collectiveBuyService().cancel(updateListingModal.id, account, chainId)
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
    if (!transactionLoading && transaction && transaction.confirmed && transaction.type === TransactionType.collectiveBuyUpdatePrice) {
      notifySuccess('ERC20 reserve price updated successfully')
      updateListingModalVar(undefined)
    }
  }, [transactionLoading, transaction])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.confirmed && transaction.type === TransactionType.collectiveBuyRedeem) {
      notifySuccess('ERC20 redeemed successfully')
      history.push('/wallet/fractionalize')
      updateListingModalVar(undefined)
    }
  }, [transactionLoading, transaction, history])

  useEffect(() => {
    setReservePrice(updateListingModal?.reservePrice || '')
  }, [updateListingModal?.reservePrice])

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
                Since you are the owner of the NFT and this pool doesn&apos;t have any participant yet, you can update the Reserve Price.
                Once someone joins this pool, you won&apos;t be able to change the Reserve Price anymore.
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
              <p>
                Since you are the owner of the NFT and this pool doesn&apos;t have any participant yet, you can redeem the NFT for yourself
                and cancel the listing.
              </p>
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
      font-family: ${props => props.theme.fonts.primary};
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
      color: ${props => props.theme.gray[4]};
      font-weight: normal;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      max-width: 360px;
    }
    @media (max-width: ${props => props.theme.viewport.mobile}) {
      max-width: 320px;
    }
  `,
  Header: styled.div`
    width: 100%;
    height: 66px;
    display: flex;
    justify-content: center;
    background-color: ${props => props.theme.gray[0]};
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
      background-color: ${props => props.theme.blue.main};
      color: ${props => props.theme.white};
      font-size: 14px;
      line-height: 19px;

      &:focus,
      &:active {
        background-color: ${props => props.theme.blue.main};
        color: ${props => props.theme.white};
      }

      &:hover {
        background-color: ${props => props.theme.blue.light};
        color: ${props => props.theme.white};
      }

      &.redeem {
        background-color: ${props => props.theme.green.main};

        &:focus,
        &:active {
          background-color: ${props => props.theme.green.main};
          color: ${props => props.theme.white};
        }

        &:hover {
          background-color: ${props => props.theme.green.light};
          color: ${props => props.theme.white};
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
      color: ${props => props.theme.gray['2']};
      font-size: 24px;

      &.ant-tabs-tab-active {
        color: ${props => props.theme.blue.main};
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
      background-color: ${props => props.theme.gray['0']};
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
          background-color: ${props => props.theme.gray['0']};
        }
      }
    }

    .ant-input-group-addon {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border-right: none;
      background-color: ${props => props.theme.white};
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
      background-color: ${props => props.theme.white};
      border-left: none;
      text-align: right;
      padding-right: 16px;
      height: 40px;

      &:disabled {
        border-radius: 8px;
        border: none;
        box-shadow: none;
        outline: none;
        background-color: ${props => props.theme.gray['0']};
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
      border-color: ${props => props.theme.gray['1']};
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
