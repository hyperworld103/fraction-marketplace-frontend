import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import GroupIcon from '../../assets/group-icon.svg'
import LinkIcon from '../../assets/link-icon.svg'
import ProfileDefault from '../../assets/profile-default.svg'
import { getChainConfigById } from '../../config'
import { chainConfig } from '../../configV2'
import { removeParticipationModalVar, successRemovedParticipationModalVar } from '../../graphql/variables/CollectiveBuying'
import { accountVar, chainIdVar } from '../../graphql/variables/WalletVariable'
import { formatShortAddress } from '../../services/UtilService'
import { Buyer, CollectiveBuyMarketplaceItem } from '../../types/CollectiveBuyTypes'
import { RemoveParticipationModal } from './modal/RemoveParticipationModal'
import { SuccessRemovedParticipationModal } from './modal/SuccessRemovedParticipationModal'
import { PoolParticipantsModal, poolParticipantsModalVar } from './PoolParticipantsModal'

interface PoolParticipantsProps {
  item: CollectiveBuyMarketplaceItem
}

export default function PoolParticipants({ item }: PoolParticipantsProps) {
  const [userParticipant, setUserParticipant] = useState<Buyer | undefined>(undefined)

  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const removeParticipationModal = useReactiveVar(removeParticipationModalVar)
  const successRemovedParticipationModal = useReactiveVar(successRemovedParticipationModalVar)
  const poolParticipantsModal = useReactiveVar(poolParticipantsModalVar)

  const { etherscanAddress, networkTokenSymbol } = getChainConfigById(chainId)
  const config = chainConfig(chainId)

  useEffect(() => {
    const getUserParticipantAmount = () => {
      const user = item.buyers.find(buyer => buyer.buyer === account)
      if (user) {
        setUserParticipant(user)
      }
    }
    getUserParticipantAmount()
  }, [account, item.buyers])

  return (
    <S.Content>
      <S.Header>
        <h1>Pool Participants</h1>
        <span>
          <img src={GroupIcon} alt='group' />
          {item.buyers.length}
        </span>
      </S.Header>
      {item && item.buyers.length > 0 && (
        <>
          <S.Main>
            <ul>
              {userParticipant && (
                <li>
                  <span>Your Participation</span>
                  <span>{`${userParticipant?.amount} ${item.paymentToken.symbol || networkTokenSymbol}`}</span>
                  {(item.status === 'CREATED' || item.status === 'FUNDED') && (
                    <S.ButtonRemoveParticipation onClick={() => removeParticipationModalVar(true)}>Remove</S.ButtonRemoveParticipation>
                  )}
                </li>
              )}
              {item.buyers.map(buyer => (
                <li key={buyer.buyer}>
                  <div>
                    <img src={ProfileDefault} alt='profile' />
                    <span>{formatShortAddress(buyer.buyer)}</span>
                  </div>
                  <div>
                    <span>{`${buyer.amount} ${item.paymentToken.symbol || networkTokenSymbol}`}</span>
                    <S.Link target='_blank' href={`${etherscanAddress}address/${config?.collectiveBuy.contract}#readContract`}>
                      <img src={LinkIcon} alt='link' />
                    </S.Link>
                  </div>
                </li>
              ))}
            </ul>
          </S.Main>
          <S.ButtonSeeAll onClick={() => poolParticipantsModalVar(true)}>See All</S.ButtonSeeAll>
          {poolParticipantsModal && (
            <PoolParticipantsModal itemId={item.id} paymentTokenSymbol={item.paymentToken.symbol || networkTokenSymbol} />
          )}
          {removeParticipationModal && userParticipant && (
            <RemoveParticipationModal
              listingId={item.id}
              buyer={userParticipant}
              paymentTokenSymbol={item.paymentToken.symbol || networkTokenSymbol}
            />
          )}
          {successRemovedParticipationModal && <SuccessRemovedParticipationModal />}
        </>
      )}
      {item && item.buyers.length === 0 && (
        <S.NoParticipants>
          <span>This pool is still empty.</span>
          <span>Get it started!</span>
        </S.NoParticipants>
      )}
    </S.Content>
  )
}
const S = {
  Content: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `,
  Header: styled.header`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    h1 {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 33px;
      color: ${props => props.theme.black};
    }
    span {
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: ${props => props.theme.black};
      img {
        width: 21px;
        height: 17px;
        margin-right: 9px;
      }
    }

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      h1 {
        font-size: 18px;
      }
      span {
        font-size: 16px;
        line-height: 18px;
      }
    }
  `,
  Main: styled.div`
    margin-bottom: 24px;
    ul {
      display: flex;
      flex-direction: column;
      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid ${props => props.theme.gray[1]};
        padding: 12px 0px;
        div {
          display: flex;
          align-items: center;
        }
        div:nth-child(1) {
          span {
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 25px;
            color: ${props => props.theme.black};
            margin-left: 8px;
          }
        }
        div:nth-child(2) {
          span {
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 25px;
            color: ${props => props.theme.black};
            margin-right: 10px;
          }
        }
      }
      li:first-child {
        border-top: none;
        span {
          font-style: normal;
          font-weight: 600;
          font-size: 18px;
          line-height: 25px;
          color: ${props => props.theme.black};
        }
      }
    }

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      ul {
        li {
          padding: 6px 0px;
          div:nth-child(1) {
            img {
              width: 20px;
              height: 20px;
            }
            span {
              font-size: 14px;
              line-height: 25px;
              margin-left: 8px;
            }
          }
          div:nth-child(2) {
            span {
              font-size: 14px;
              line-height: 25px;
              margin-right: 10px;
            }
          }
        }
        li:first-child {
          span {
            font-size: 14px;
          }
        }
      }
    }
  `,
  Link: styled.a`
    img {
      width: 20px;
      height: 20px;
    }
    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      img {
        width: 15px;
        height: 15px;
      }
    }
  `,
  ButtonSeeAll: styled(Button)`
    max-width: 70px;
    border: none;
    background: none;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 27px;
    color: ${props => props.theme.blue.main};
    padding: 0px;
    &:hover,
    &:active,
    &:focus {
      color: ${props => props.theme.blue.light};
    }
  `,
  ButtonRemoveParticipation: styled(Button)`
    height: 32px;
    width: 84px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.gray['2']};
    background-color: ${props => props.theme.white};
    &:hover,
    &:focus {
      border-color: ${props => props.theme.gray[3]};
      background-color: ${props => props.theme.gray[1]};
      span {
        color: ${props => props.theme.gray[5]} !important;
      }
    }
    > span {
      font-size: 14px !important;
      line-height: 18px !important;
      font-weight: 600;
    }
  `,
  NoParticipants: styled.div`
    width: 100%;
    padding: 16px;
    background-color: ${props => props.theme.gray[0]};
    border-radius: ${props => props.theme.borderRadius.small};
    text-align: center;
    display: flex;
    flex-direction: column;

    > span {
      color: ${props => props.theme.gray[3]};
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
    }
  `
}
