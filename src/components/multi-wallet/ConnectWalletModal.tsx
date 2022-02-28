import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Checkbox, Modal } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import bscIcon from '../../assets/multi-wallet/bsc.svg'
import ethereumIcon from '../../assets/multi-wallet/ethereum.svg'
import metamaskIcon from '../../assets/multi-wallet/metamask.svg'
import walletConnectIcon from '../../assets/multi-wallet/walletConnect.svg'
import { accountVar, connectWalletModalVar, MultiWalletProvider } from '../../graphql/variables/WalletVariable'
import { multiWalletService } from '../../services/MultiWalletService'
import { colorsV2, fonts } from '../../styles/variables'

interface Wallet {
  key: number
  name: string
  code: MultiWalletProvider
  image: string
  active: boolean
  loading: boolean
  disabled: boolean
}
interface Network {
  key: number
  name: string
  image: string
  active: boolean
  chainId: number
}

export const ConnectWalletModal = () => {
  const account = useReactiveVar(accountVar)
  const connectWalletModal = useReactiveVar(connectWalletModalVar)
  const [networkSelected, setNetworkSelected] = useState<Network | undefined>(undefined)
  const [walletList, setWalletList] = useState<Wallet[]>([
    {
      key: 0,
      name: 'MetaMask',
      code: MultiWalletProvider.metaMask,
      image: metamaskIcon,
      active: false,
      loading: false,
      disabled: true
    },
    {
      key: 1,
      name: 'Wallet Connect',
      code: MultiWalletProvider.walletConnect,
      image: walletConnectIcon,
      active: false,
      loading: false,
      disabled: true
    }
  ])
  const [networkList, setNetworkList] = useState<Network[]>(
    [
      {
        key: 0,
        name: 'Ethereum',
        image: ethereumIcon,
        active: false,
        chainId: 1
      },
      {
        key: 1,
        name: 'Binance',
        image: bscIcon,
        active: false,
        chainId: 56
      }
    ].sort()
  )

  const setLoading = (key: number | undefined) => {
    const newWalletList: Wallet[] = []
    walletList.forEach(wallet => {
      if (wallet.key === key) {
        const walletUpdate = {
          ...wallet,
          loading: true
        }
        newWalletList.push(walletUpdate)
      } else {
        const walletUpdate = {
          ...wallet,
          loading: false
        }
        newWalletList.push(walletUpdate)
      }
    })
    setWalletList(newWalletList)
  }

  const selectWallet = async (wallet: Wallet) => {
    setLoading(wallet.key)
    if (networkSelected) {
      await multiWalletService(wallet.code, networkSelected.chainId).connect()
    }
    setLoading(undefined)
  }

  const enableWallets = () => {
    const newWalletList: Wallet[] = []
    walletList.forEach(wallet => {
      const walletUpdate = {
        ...wallet,
        disabled: false
      }
      newWalletList.push(walletUpdate)
    })
    setWalletList(newWalletList)
  }

  const selectNetWork = (networkItem: Network) => {
    enableWallets()
    const newNetworkList: Network[] = []
    networkList.forEach(network => {
      if (network.key === networkItem?.key) {
        const networkUpdate = {
          ...network,
          active: true
        }
        newNetworkList.push(networkUpdate)
        setNetworkSelected(network)
      } else {
        const networkUpdate = {
          ...network,
          active: false
        }
        newNetworkList.push(networkUpdate)
      }
    })
    setNetworkList(newNetworkList)
  }

  useEffect(() => {
    if (account) {
      handleCancel()
    }
  }, [account])

  const handleCancel = () => {
    connectWalletModalVar(false)
  }
  return (
    <S.Modal title='Connect Wallet' onCancel={handleCancel} visible={!!connectWalletModal} footer={null} destroyOnClose>
      <div>
        <S.BoxContainer>
          <S.ContainerCards>
            <h1>Choose Network</h1>
            <div>
              {networkList.map(network => (
                <S.CardButton key={network.key} onClick={() => selectNetWork(network)} className={`${network.active ? 'active' : ''}`}>
                  <div>
                    <img alt={network.name} src={network.image} />
                    <span>{network.name}</span>
                  </div>
                </S.CardButton>
              ))}
            </div>
          </S.ContainerCards>
          <S.ContainerCards>
            <h1>Choose Provider</h1>
            <div>
              {walletList.map(wallet => (
                <S.CardButton
                  key={wallet.key}
                  onClick={() => selectWallet(wallet)}
                  loading={wallet.loading}
                  disabled={wallet.disabled}
                  className={`${wallet.disabled ? 'disabled' : ''}`}>
                  <div>
                    <img alt={wallet.name} src={wallet.image} />
                    <span>{wallet.name}</span>
                  </div>
                </S.CardButton>
              ))}
            </div>
          </S.ContainerCards>
        </S.BoxContainer>
      </div>
    </S.Modal>
  )
}
const S = {
  Modal: styled(Modal)`
    .ant-modal-content {
      border-radius: 16px;
      width: 320px;
      margin: auto;
    }
    .ant-modal-body {
      display: flex;
      padding: 32px 32px;
      padding-top: 0px;
      flex-direction: column;
      > div {
        display: flex;
        flex-direction: column;
        > h4 {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 1.4rem;
          line-height: 1.6rem;
          font-weight: 400;
          color: ${colorsV2.gray[4]};
        }
        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
    .ant-modal-header {
      padding: 16px 32px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
    .ant-modal-title {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 20px;
      padding-bottom: 16px;
      color: ${colorsV2.gray[4]};
      text-align: center;
      margin-top: 4px;
    }
    .ant-modal-close-x {
      display: flex;
      justify-content: center;
      align-items: center;
      display: none;
      height: 48px;
    }
  `,
  BoxContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px 0px;
  `,
  ContainerCards: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: ${colorsV2.gray[2]};
      line-height: 18px;
      margin-bottom: 16px;
    }

    div {
      display: flex;
      gap: 0px 16px;
    }
  `,
  CardButton: styled(Button)`
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 8px;
    background: ${colorsV2.white};
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 80px;
    cursor: pointer;
    white-space: normal;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 120%;
    color: ${colorsV2.gray[4]};
    box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    &::after {
      display: none;
    }
    &.active {
      border: 1px solid;
      border-color: ${colorsV2.secondary.main};
      background: ${colorsV2.gray[0]};
      box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    }
    &.disabled {
      background: ${colorsV2.gray[0]};
      cursor: not-allowed;
    }
    &:hover {
      background: ${colorsV2.gray[0]};
      color: ${colorsV2.gray[4]};
    }
    &:focus {
      border-color: ${colorsV2.secondary.main};
      color: ${colorsV2.gray[4]};
    }
    div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        height: 30px;
        width: 30px;
        margin-bottom: 4px;
      }
      span {
        font-size: 1.2rem;
        line-height: 1.4rem;
        margin-top: 4px;
      }
    }
  `,
  Checkbox: styled(Checkbox)`
    color: ${colorsV2.gray[4]};
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    margin-top: 8px;
    a {
      color: ${colorsV2.blue.main};
      &:hover {
        opacity: 0.7;
      }
    }
  `
}
