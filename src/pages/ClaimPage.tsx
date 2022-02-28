import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import iconLink from '../assets/icons/external-link-blue.svg'
import iconNftfy from '../assets/icons/nftfy.svg'
import bscIcon from '../assets/networks/bsc.svg'
import ethereumIcon from '../assets/networks/ethereum.svg'
import { accountVar, chainIdVar } from '../graphql/variables/WalletVariable'
import { getAvailable, withdraw } from '../services/SalesService'
import { colors, fonts, viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function ClaimPage() {
  const angelAddress = '0xc5F34066D3f89A638E8398Fa23C6fEC60438F402'
  const strategicAddress = '0x0fD1847691627b27F6ce7Ec40F623CB9C9E8FCf3'
  const privateAddress = '0x7fB884c0E59008E7d1f8193Bd88CaB01ABE4f6f4'

  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)

  const [connectedEthereum, setConnectedEthereum] = useState(false)
  const [connectedBSC, setConnectedBSC] = useState(false)
  const [availableAngel, setAvailableAngel] = useState('')
  const [availableStrategic, setAvailableStrategic] = useState('')
  const [availablePrivate, setAvailablePrivate] = useState('')

  useEffect(() => {
    setConnectedEthereum(chainId === 1)
    setConnectedBSC(chainId === 56)

    const getAvailableBalance = async () => {
      if (account) {
        const angelBalance = await getAvailable(angelAddress, account, 1)
        const strategicBalance = await getAvailable(strategicAddress, account, 1)
        const privateBalance = await getAvailable(privateAddress, account, 56)

        setAvailableAngel(angelBalance)
        setAvailableStrategic(strategicBalance)
        setAvailablePrivate(privateBalance)
      }
    }
    getAvailableBalance()
  }, [account, chainId])

  const withdrawAngel = async () => {
    if (account && chainId === 1) {
      await withdraw(angelAddress, account, chainId)
    }
  }
  const withdrawStrategic = async () => {
    if (account && chainId === 1) {
      await withdraw(strategicAddress, account, chainId)
    }
  }
  const withdrawPrivate = async () => {
    if (account && chainId === 56) {
      await withdraw(privateAddress, account, chainId)
    }
  }

  return (
    <DefaultPageTemplate>
      <S.Section>
        <h2>
          <img src={ethereumIcon} alt='network' />
          Claim on Ethereum Mainnet
        </h2>
        <ul>
          <li>
            <S.SubTitles>
              Angel & Seed Round
              <S.Link href='https://etherscan.io/address/0xc5F34066D3f89A638E8398Fa23C6fEC60438F402' target='_blank' rel='noreferrer'>
                Etherscan
                <img src={iconLink} alt='icon' />
              </S.Link>
            </S.SubTitles>
            <S.Card>
              {/* <div>
                    <S.Labels>Locked Amount</S.Labels>
                    <S.ValuesInfo>
                      <img src={iconNftfy} alt='nftfyicon' />
                      <strong>{lockedAngel ? Number(lockedAngel).toLocaleString('en-us', { maximumFractionDigits: 2 }) : 0}</strong>
                      <span>$NFTFY</span>
                    </S.ValuesInfo>
                  </div> */}
              <div>
                <S.Labels>Available to Withdraw</S.Labels>
                <S.ValuesInfo>
                  <img src={iconNftfy} alt='nftfyicon' />
                  <strong>{availableAngel ? Number(availableAngel).toLocaleString('en-us', { maximumFractionDigits: 2 }) : 0}</strong>
                  <span>$NFTFY</span>
                </S.ValuesInfo>
              </div>
              <div>
                <S.ButtonAction
                  disabled={!connectedEthereum || !account}
                  className={connectedEthereum && account ? '' : 'disabled'}
                  onClick={withdrawAngel}>
                  {connectedEthereum ? 'Withdraw' : 'Ethereum'}
                </S.ButtonAction>
              </div>
            </S.Card>
          </li>

          <li>
            <S.SubTitles>
              Strategic Round
              <S.Link href='https://etherscan.io/address/0x0fD1847691627b27F6ce7Ec40F623CB9C9E8FCf3' target='_blank' rel='noreferrer'>
                Etherscan
                <img src={iconLink} alt='icon' />
              </S.Link>
            </S.SubTitles>
            <S.Card>
              {/* <div>
                    <S.Labels>Locked Amount</S.Labels>
                    <S.ValuesInfo>
                      <img src={iconNftfy} alt='nftfyicon' />
                      <strong>{lockedStrategic ? Number(lockedStrategic).toLocaleString('en-us', { maximumFractionDigits: 2 }) : 0}</strong>
                      <span>$NFTFY</span>
                    </S.ValuesInfo>
                  </div> */}
              <div>
                <S.Labels>Available to Withdraw</S.Labels>
                <S.ValuesInfo>
                  <img src={iconNftfy} alt='nftfyicon' />
                  <strong>
                    {availableStrategic ? Number(availableStrategic).toLocaleString('en-us', { maximumFractionDigits: 2 }) : 0}
                  </strong>
                  <span>$NFTFY</span>
                </S.ValuesInfo>
              </div>
              <div>
                <S.ButtonAction
                  disabled={!connectedEthereum || !account}
                  className={connectedEthereum && account ? '' : 'disabled'}
                  onClick={withdrawStrategic}>
                  {connectedEthereum ? 'Withdraw' : 'Ethereum'}
                </S.ButtonAction>
              </div>
            </S.Card>
          </li>
        </ul>
      </S.Section>

      {/* bsc */}
      <S.Section>
        <h2>
          <img src={bscIcon} alt='network' />
          Claim on Binance Smart Chain
        </h2>
        <ul>
          <li>
            <S.SubTitles>
              Private Round
              <S.Link href='https://bscscan.com/address/0x7fB884c0E59008E7d1f8193Bd88CaB01ABE4f6f4' rel='noreferrer'>
                Bscscan
                <img src={iconLink} alt='icon' />
              </S.Link>
            </S.SubTitles>
            <S.Card>
              {/* <div>
                    <S.Labels>Locked Amount</S.Labels>
                    <S.ValuesInfo>
                      <img src={iconNftfy} alt='nftfyicon' />
                      <strong>{lockedPrivate ? Number(lockedPrivate).toLocaleString('en-us', { maximumFractionDigits: 2 }) : 0}</strong>
                      <span>$NFTFY</span>
                    </S.ValuesInfo>
                  </div> */}
              <div>
                <S.Labels>Available to Withdraw</S.Labels>
                <S.ValuesInfo>
                  <img src={iconNftfy} alt='nftfyicon' />
                  <strong>{availablePrivate ? Number(availablePrivate).toLocaleString('en-us', { maximumFractionDigits: 2 }) : 0}</strong>
                  <span>$NFTFY</span>
                </S.ValuesInfo>
              </div>
              <div>
                <S.ButtonAction
                  disabled={!connectedBSC || !account}
                  className={connectedBSC && account ? '' : 'disabled'}
                  onClick={withdrawPrivate}>
                  {connectedBSC ? 'Withdraw' : 'BSC'}
                </S.ButtonAction>
              </div>
            </S.Card>
          </li>
        </ul>
      </S.Section>
    </DefaultPageTemplate>
  )
}

export const S = {
  Link: styled.a`
    font-family: ${fonts.nunito};
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${colors.blue1};
    img {
      width: 15px;
      margin-left: 5px;
    }
  `,
  Title: styled.h1`
    font-family: ${fonts.nunito};
    font-weight: 400;
    font-size: 40px;
    line-height: 130%;
    color: ${colors.gray2};

    @media (max-width: ${viewport.sm}) {
      font-size: 30px;
    }
  `,
  Section: styled.div`
    margin-top: 50px;
    h2 {
      display: flex;
      align-items: center;
      font-family: ${fonts.nunito};
      font-weight: 400;
      font-size: 26px;
      line-height: 130%;
      color: ${colors.gray2};
      margin-bottom: 30px;
      img {
        width: 45px;
        margin-right: 15px;
      }
    }
    ul {
      li {
        margin-bottom: 25px;
      }
    }

    @media (max-width: ${viewport.sm}) {
      h2 {
        font-size: 20px;
      }
    }
  `,
  SubTitles: styled.span`
    font-family: ${fonts.nunito};
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    color: ${colors.gray2};
    a {
      margin-left: 30px;
    }
  `,
  Labels: styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: ${colors.gray2};
    margin-bottom: 10px;
    display: flex;
    padding-top: 8px;
  `,
  ValuesInfo: styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-family: ${fonts.nunito};
    img {
      width: 16px;
      margin-right: 10px;
    }
    strong {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: ${colors.gray2};
    }
    span {
      color: #dedede;
      font-size: 16px;
      line-height: 24px;
      margin-left: 10px;
    }
  `,
  Card: styled.div`
    width: 100%;

    height: 96px;
    border: 1px solid #dedede;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 16px 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 20px;

    div:nth-child(2) {
      display: flex;
      align-items: center;
    }

    @media (max-width: ${viewport.sm}) {
      flex-direction: column;
      align-items: center;
      height: auto;
      div {
        margin-bottom: 15px;
        width: 180px;
      }
    }
  `,
  ButtonAction: styled(Button)`
    border: none;
    background: ${colors.blue1};
    border-radius: 8px;
    width: 153px;
    height: 40px;
    color: ${colors.white};
    font-family: ${fonts.nunito};
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;

    &:hover,
    &:active,
    &:focus {
      background: ${colors.blue2};
      color: ${colors.white};
    }

    &.disabled,
    &.disabled:hover {
      background: ${colors.gray1};
      cursor: default;
      color: ${colors.white};
    }
  `
}
