import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import { now } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { successClaimModalVar } from '../../graphql/variables/CollectiveBuying'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { collectiveBuyService } from '../../services/CollectiveBuyService'
import { CollectiveBuyMarketplaceItem, CollectiveBuyStatus } from '../../types/CollectiveBuyTypes'
import { CountdownDisplay } from '../shared/CountdownDisplay'
import { AcceptOffer } from './AcceptOffer'
import JoinGroup from './JoinGroup'
import { SuccessClaimModal } from './modal/SuccessClaimModal'
import { UpdateListingModal, updateListingModalVar } from './modal/UpdateListingModal'
import { NftSold } from './NftSold'
import PoolParticipants from './PoolParticipants'
import { PoolProgress } from './PoolProgress'
import { ReservePrice } from './ReservePrice'
import { SignToUnlock } from './SignToUnlock'
import { TotalSupply } from './TotalSupply'

interface PurchaseProps {
  item: CollectiveBuyMarketplaceItem
}

export function Purchase({ item }: PurchaseProps) {
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const successClaimModal = useReactiveVar(successClaimModalVar)
  const updateListingModal = useReactiveVar(updateListingModalVar)

  const isOwner = (accountAddress: string) => {
    if (account === '') {
      return false
    }

    return Web3.utils.toChecksumAddress(item.seller) === Web3.utils.toChecksumAddress(accountAddress)
  }

  const handleOwnerClaim = async () => {
    account && (await collectiveBuyService().payout(item.id, account, chainId))
  }

  const handleOwnerEdit = async () => {
    updateListingModalVar(item)
  }

  const hasEnded = (item.cutoff && now() / 1000 > item.cutoff) || item.status === 'ENDED'
  const signToUnlock = hasEnded && (item.status === CollectiveBuyStatus.ENDING || item.status === CollectiveBuyStatus.STARTING_OR_ENDING)
  const timeToUnlock = item.cutoff && !hasEnded
  const hasBeenSold = item.status === CollectiveBuyStatus.ENDED && hasEnded
  const poolProgress = item.status === CollectiveBuyStatus.CREATED || item.status === CollectiveBuyStatus.FUNDED
  const isEditable = account && isOwner(account.toLowerCase()) && item.status === CollectiveBuyStatus.CREATED
  const isRedeemed = !item.cutoff && hasEnded
  const canJoinGroup = account && !isOwner(account.toLowerCase()) && !hasEnded
  const canAcceptOffer = account && isOwner(account.toLowerCase()) && item.status === CollectiveBuyStatus.FUNDED

  return (
    <S.Container>
      {!signToUnlock && (
        <S.SellingInfo>
          <ReservePrice item={item} chainId={chainId} isRedeemed={isRedeemed} hasEnded={hasEnded} />
          {timeToUnlock && <CountdownDisplay smallGap cutoff={item.cutoff || 0} />}
          {account && !isOwner(account.toLowerCase()) && hasBeenSold && <TotalSupply item={item} chainId={chainId} />}
          {account && isOwner(account.toLowerCase()) && hasBeenSold && <S.Claim onClick={handleOwnerClaim}>Claim</S.Claim>}
          {poolProgress && <PoolProgress chainId={chainId} item={item} />}
        </S.SellingInfo>
      )}
      {isEditable && <S.Edit onClick={handleOwnerEdit}>Edit</S.Edit>}
      {canJoinGroup && <JoinGroup item={item} pathImage={item.paymentToken.id} typeImage='jazzIcon' />}
      {canAcceptOffer && <AcceptOffer itemAmount={item.amount} itemId={item.id} itemReservePrice={item.reservePrice} />}
      {!hasEnded && <PoolParticipants item={item} />}
      {signToUnlock && <SignToUnlock chainId={chainId} account={account || ''} item={item} />}
      {hasBeenSold && <NftSold isOwner={isOwner(account || '')} chainId={chainId} account={account} item={item} />}
      {successClaimModal && <SuccessClaimModal isOwner={isOwner(account || '')} fractionAddress={item.fractions} />}
      {updateListingModal && <UpdateListingModal />}
    </S.Container>
  )
}
const S = {
  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,
  SellingInfo: styled.div`
    flex: 1;
    width: 100%;
    background: ${props => props.theme.gray[0]};
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      gap: 18px;
    }

    section {
      font-style: normal;
      font-weight: normal;
      h4 {
        font-size: 14px;
        line-height: 19px;
        color: ${props => props.theme.gray[4]};
      }
      span {
        font-weight: 600;
        font-size: 40px;
        line-height: 55px;
        color: ${props => props.theme.black};
      }
      h3 {
        font-size: 12px;
        line-height: 16px;
        color: ${props => props.theme.gray[4]};
      }
    }
    > section:nth-child(1) {
      > div {
        display: flex;
        gap: 8px;
        align-items: baseline;
        small {
          font-style: normal;
          font-weight: normal;
          font-size: 18px;
          line-height: 25px;
        }
      }
    }
  `,
  Claim: styled(Button)`
    height: 48px;
    width: 100px;
    background-color: ${props => props.theme.green.main};
    border-radius: ${props => props.theme.borderRadius.small};
    align-self: center;
    border: none;
    outline: none;
    box-shadow: none;

    > span {
      font-weight: 600;
      font-size: 20px;
      line-height: 27px;
      color: ${props => props.theme.white};
    }

    &:hover,
    &:focus,
    &:active {
      border: none;
      box-shadow: none;
      outline: none;
      background-color: ${props => props.theme.green.light};
    }
  `,
  Edit: styled(Button)`
    height: 48px;
    width: 100%;
    background-color: ${props => props.theme.blue.main};
    border-radius: ${props => props.theme.borderRadius.small};
    align-self: center;
    border: none;
    outline: none;
    box-shadow: none;

    > span {
      font-weight: 600;
      font-size: 20px;
      line-height: 27px;
      color: ${props => props.theme.white};
    }

    &:hover,
    &:focus,
    &:active {
      border: none;
      box-shadow: none;
      outline: none;
      background-color: ${props => props.theme.blue.light};
    }
  `
}
