import React from 'react'
import styled from 'styled-components'
import { CardTemplate } from '../shared/template/cards/CardTemplate'
import { FooterFractionalize } from '../shared/template/cards/FooterFractionalize'
import { colorsV2, viewportV2 } from '../../styles/variables'
import { NftBoxItems } from '../../types/BoxTypes'

interface FractionalizeBoxItemsProps {
  chainId: number
  nfts: NftBoxItems[]
}

export const FractionalizeBoxItems = ({ chainId, nfts }: FractionalizeBoxItemsProps) => {
  const safeErc721Name = (erc721Name: string, erc721TokenId: string) => {
    const nameWithTokenId = `${erc721Name} #${erc721TokenId}`

    if (nameWithTokenId.length <= 18) {
      return nameWithTokenId
    }

    return `${nameWithTokenId.substr(0, 15)}...`
  }

  return (
    <div>
      <S.BoxContainer>
        <h3>NFTs in this box</h3>
        <div>
          {nfts.map(nft => (
            <CardTemplate
              url={`/wallet/fractionalize/${nft.address}/${nft.tokenId}`}
              key={`${nft.address}-${nft.tokenId}`}
              name={nft.name}
              image={nft.image_url}>
              <FooterFractionalize name={safeErc721Name(nft.name, nft.tokenId)} />
            </CardTemplate>
          ))}
        </div>
      </S.BoxContainer>
    </div>
  )
}

const S = {
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
  `
}
