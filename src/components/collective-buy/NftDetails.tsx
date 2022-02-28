import { useReactiveVar } from '@apollo/client'
import React from 'react'
import styled from 'styled-components'
import notFound from '../../assets/notfound.svg'
import { ThemeProviderEnum, themeVar } from '../../graphql/variables/Shared'
import { darkTheme, lightTheme } from '../../styles/theme'
import { WalletErc721Item } from '../../types/WalletTypes'
import { Erc721ImageNew } from '../shared/Erc721ImageNew'

interface NftDetailsProps {
  erc721?: WalletErc721Item
  erc20Id?: string
  name?: string
  symbol?: string
}

export const NftDetails = ({ erc721, erc20Id, name, symbol }: NftDetailsProps) => {
  const theme = useReactiveVar(themeVar)

  return (
    <S.Content>
      <S.Name>
        {name || erc721?.name}
        <small>{symbol || erc721?.symbol}</small>
      </S.Name>
      {erc20Id && <small>{erc20Id}</small>}
      {erc721 && (
        <Erc721ImageNew
          image={erc721.metadata?.image || notFound}
          imageFull={erc721.metadata?.imageFull || notFound}
          name={erc721.metadata?.name || `${erc721.name} #${erc721.tokenId}`}
          animation={erc721.metadata?.animation_url}
          backgroundColor={theme === ThemeProviderEnum.dark ? darkTheme.gray[0] : lightTheme.gray[0]}
        />
      )}
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    background: ${props => props.theme.gray[0]};
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 0;
    padding: 0;
    width: 100%;
  `,
  Name: styled.h3`
    font-size: 40px;
    line-height: 54px;
    color: ${props => props.theme.black};
    background: ${props => props.theme.gray[0]};
    font-weight: 400;

    > small {
      margin-left: 12px;
      font-size: 18px;
      line-height: 24px;
    }
  `
}
