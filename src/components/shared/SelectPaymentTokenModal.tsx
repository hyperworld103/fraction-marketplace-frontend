import { LoadingOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { Button, Modal } from 'antd'
import Fuse from 'fuse.js'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { selectPaymentTokenModalLoadingVar } from '../../graphql/variables/FractionalizeVariables'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { getMarketplaceAssetsList, marketplaceService } from '../../services/MarketplaceService'
import { getFractionalizeAssetsList } from '../../services/NftfyService'
import { getErc20Balance } from '../../services/WalletService'
import { colors, fonts } from '../../styles/variables'
import { AssetERC20 } from '../../types/WalletTypes'
import { ImageToken } from './ImageToken'

export interface AssetsTokenModalProps {
  visible: boolean
  onCancel: () => void
  onSelect: (erc20: AssetERC20) => void
  location: 'marketplace' | 'fractionalize'
}

export const SelectPaymentTokenModal = ({ visible, onCancel, onSelect, location }: AssetsTokenModalProps) => {
  const [assetsFilter, setAssetsFilter] = useState<AssetERC20[]>()
  const assetsModalLoading = useReactiveVar(selectPaymentTokenModalLoadingVar)

  const chainId = useReactiveVar(chainIdVar)
  const [value, setValue] = useState('')

  const getAssetsTokens = useCallback(async () => {
    const erc20 =
        location === 'marketplace' ? await getMarketplaceAssetsList(chainId) : await getFractionalizeAssetsList(chainId)
    setAssetsFilter(erc20)
  }, [chainId, location])

  useEffect(() => {
    if (!value) {
      getAssetsTokens()
    }
  }, [getAssetsTokens, value])

  const handleCancel = () => {
    onCancel()
  }

  const handleSelect = (erc20: AssetERC20) => {
    onSelect(erc20)
  }

  const SearchForm = async (e: React.ChangeEvent<HTMLInputElement>) => {
    selectPaymentTokenModalLoadingVar(true)
    setValue(e.target.value)

    if (!e.target.value) {
      await getAssetsTokens()
    } else {
      const tokens: AssetERC20[] = []

      if (assetsFilter && e.target.value) {
        const options = {
          includeMatches: true,
          keys: ['name', 'symbol', 'address']
        }
        const list = new Fuse(assetsFilter, options)
        const results = list.search(e.target.value)
        results.map(resultItem => tokens.push(resultItem.item))

        if (!tokens.length) {
          const token = await marketplaceService(chainId, 2).getAsset(e.target.value)

          if (token) {
            if (token?.decimals) {
              token.decimals = Number(token?.decimals)
            }

            const balance = await getErc20Balance(token.address, token.decimals, chainId)
              setAssetsFilter([{ ...token, balance: balance.toString() }])
          } else {
            setAssetsFilter([])
          }
        } else {
          setAssetsFilter(tokens)
        }
      }
    }

    selectPaymentTokenModalLoadingVar(false)
  }

  console.log(assetsFilter);
  return (
    <S.Modal visible={visible} onCancel={handleCancel} footer={null} destroyOnClose>
      <S.TitleContent>Select Asset</S.TitleContent>
      <S.ContentForm>
        <S.Search
          type='text'
          hidden={location === 'fractionalize'}
          placeholder='Search by symbol, name, or address'
          onChange={SearchForm}
          value={value}
        />
      </S.ContentForm>
      <S.ListAssets>
        {assetsModalLoading && (
          <li key='loading'>
            <S.Loading>
              <LoadingOutlined />
              <span>Loading</span>
            </S.Loading>
          </li>
        )}
        {assetsFilter &&
          !assetsModalLoading &&
          assetsFilter.map(asset => (
            <li key={asset.id}>
              <S.ButtonToken onClick={() => handleSelect(asset)}>
                <div>
                  <S.ImageToken address={asset.address} symbol={asset.symbol} />
                  <span>{asset.symbol}</span>
                </div>
                <span>{asset.balance && Number(asset.balance).toLocaleString('en-us', { maximumFractionDigits: 6 })}</span>
              </S.ButtonToken>
            </li>
          ))}
      </S.ListAssets>
    </S.Modal>
  )
}

export const S = {
  Modal: styled(Modal)`
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    .ant-modal-body {
      padding: 25;
    }

    .ant-modal-content {
      background: ${props=>props.theme.white};
      border-radius: 16px;
      max-width: 440px;
    }

    .ant-modal-close-x {
      display: none;
    }

    .ant-modal-footer {
      display: none;
    }
  `,
  TitleContent: styled.div`
    font-family: ${fonts.nunito};
    font-size: 22px;
    font-weight: 400;
    line-height: 24px;
    color: ${props=>props.theme.gray['3']};
    margin-bottom: 8px;
  `,
  ContentForm: styled.div`
    margin-top: 10px;
  `,
  Search: styled.input`
    width: 100%;
    height: 40px;
    border-radius: 8px;
    padding-left: 8px;
    border: 1px solid ${props=>props.theme.gray['3']};
    outline: none;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    margin: 8px 0px 8px;
    color: ${props=>props.theme.gray['1']};
  `,
  ListAssets: styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;

    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: center;
      align-items: center;

      cursor: pointer;

      &:hover {
        background: ${props=>props.theme.gray['0']};
      }
    }
  `,
  ButtonToken: styled(Button)`
    width: 100%;
    height: 50px;
    border: none !important;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: none;
    transition: background-color 0.5s;
    display: flex;
    align-items: center;

    span:first-child {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: ${props=>props.theme.gray['3']};
    }

    span:last-child {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: ${props=>props.theme.gray['3']};
    }

    &:hover {
      background: ${props=>props.theme.gray['0']};
    }

    > div {
      display: flex;
      align-items: center;
    }
  `,
  ImageToken: styled(ImageToken)`
    margin-right: 8px;
  `,
  Loading: styled.span`
    > span {
      margin-left: 16px;
    }
  `
}
