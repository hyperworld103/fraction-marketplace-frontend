import { useReactiveVar } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import bscIcon from '../../assets/multi-wallet/bsc.svg'
import ethereumIcon from '../../assets/multi-wallet/ethereum.svg'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { isAllowedChain } from '../../services/UtilService'

interface NetworkConnectedProps {
  className?: string
}

export const NetworkConnected: React.FC<NetworkConnectedProps> = ({ className }: NetworkConnectedProps) => {
  const chainId = useReactiveVar(chainIdVar)
  const rightChain = isAllowedChain(chainId)

  const [network, setNetwork] = useState('')

  const selectNetwork = useCallback(() => {
    switch (chainId) {
      case 1:
      case 42:
        setNetwork(ethereumIcon)
        break
      case 56:
      case 97:
        setNetwork(bscIcon)
        break
      default:
        break
    }
  }, [chainId])

  useEffect(() => {
    if (chainId) {
      selectNetwork()
    }
  }, [chainId, selectNetwork])

  return (
    <>
      {rightChain && (
        <S.NetworkConnected className={`${className} ${rightChain ? '' : ''}`}>
          <img src={network} alt='' />
        </S.NetworkConnected>
      )}
    </>
  )
}

const S = {
  NetworkConnected: styled.div`
    background: ${props => props.theme.white};
    border: 1px solid ${props => props.theme.gray[0]};
    border-radius: 24px;
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    padding: 8px;
    span {
      font-family: Montserrat;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
    }
    img {
      width: 32px;
      height: 32px;
    }

    @media (max-width: ${props => props.theme.viewport.tablet}) {
      display: none;
    }
  `
}
