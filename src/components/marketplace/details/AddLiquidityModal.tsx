import React from 'react'
import { makeVar, useReactiveVar } from '@apollo/client'
import { Modal } from 'antd'
import styled from 'styled-components'
import iconBalancer from '../../../assets/icons/icon-balancer.svg'
import iconSushi from '../../../assets/icons/icon-sushi.svg'
import iconUniswap from '../../../assets/icons/icon-uniswap.svg'

export const LiquidityModalVar = makeVar(false)

interface AddLiquidityModalProps {
  address: string
  addressTokenSymbol?: string
  chainId: number
}
export default function AddLiquidityModal({ address, addressTokenSymbol, chainId }: AddLiquidityModalProps) {
  const LiquidityModal = useReactiveVar(LiquidityModalVar)

  return (
    <S.Modal visible={LiquidityModal} onCancel={() => LiquidityModalVar(false)} footer={null} destroyOnClose>
      <S.Header>
        <h1>Add Liquidity</h1>
      </S.Header>
      <S.Content>
        <p>Choose one of AMM to launch your token</p>
        <ul>
          {chainId !== 56 && chainId !== 97 && (
            <>
              <li>
                <S.Link target='_blank' rel='noreferrer' href={`https://pools.balancer.exchange/#/pool/new `}>
                  <img src={iconBalancer} alt='Balancer' />
                  <span>Balancer</span>
                </S.Link>
              </li>
              <li>
                <S.Link target='_blank' rel='noreferrer' href={`https://app.uniswap.org/#/add/v2/${addressTokenSymbol}/${address}`}>
                  <img src={iconUniswap} alt='Balancer' />
                  <span>Uniswap V2</span>
                </S.Link>
              </li>
              <li>
                <S.Link target='_blank' rel='noreferrer' href={`https://app.uniswap.org/#/add/${addressTokenSymbol}/${address}`}>
                  <img src={iconUniswap} alt='Balancer' />
                  <span>Uniswap V3</span>
                </S.Link>
              </li>
            </>
          )}
          <li>
            <S.Link target='_blank' rel='noreferrer' href={`https://app.sushi.com/add/${addressTokenSymbol}/${address}`}>
              <img src={iconSushi} alt='Balancer' />
              <span>Sushi Swap</span>
            </S.Link>
          </li>
        </ul>
      </S.Content>
    </S.Modal>
  )
}

const S = {
  Modal: styled(Modal)`
    &.ant-modal {
      width: 100% !important;
      max-width: 776px !important;
    }
    .ant-modal-body {
      padding: 0px;
    }
    .ant-modal-close-x {
      display: none;
    }
  `,
  Header: styled.header`
    width: 100%;
    height: 65px;
    background-color: ${props => props.theme.gray[0]};
    text-align: center;
    padding: 16px 0px;
    h1 {
      font-weight: normal;
      font-size: 24px;
      line-height: 33px;
      color: ${props => props.theme.gray[4]};
    }
  `,
  Content: styled.div`
    padding: 48px;
    p {
      font-weight: normal;
      font-size: 18px;
      line-height: 25px;
      color: ${props => props.theme.black};
      text-align: center;
      margin-bottom: 24px;
    }

    ul {
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      li {
        width: 110px;
        border: 1px solid ${props => props.theme.gray[1]};
        padding: 20px;
        border-radius: 8px;
      }
    }

    @media (max-width: ${props => props.theme.viewport.desktop}) {
      ul {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 20px;
      }
    }
    @media (max-width: ${props => props.theme.viewport.tablet}) {
      ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
    }
  `,
  Link: styled.a`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
    }
    span {
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      color: ${props => props.theme.gray[3]};
    }
  `
}
