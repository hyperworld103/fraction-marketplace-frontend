import React from 'react'
import styled from 'styled-components'

interface FooterCardMarketplaceLoadingProps {
  loading?: boolean
}

export const FooterCardMarketplaceLoading = ({ loading }: FooterCardMarketplaceLoadingProps) => {
  return (
    <S.Content>
    </S.Content>
  )
}

const S = {
  Content: styled.div`
    height: 0px;
  `
}
