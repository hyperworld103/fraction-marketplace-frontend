import React from 'react'
import { makeVar, useReactiveVar } from '@apollo/client'
import { Modal, Skeleton, Spin } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import GroupIcon from '../../assets/group-icon.svg'
import LinkIcon from '../../assets/link-icon.svg'
import ProfileDefault from '../../assets/profile-default.svg'
import { getChainConfigById } from '../../config'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { collectiveBuyService } from '../../services/CollectiveBuyService'
import { formatShortAddress } from '../../services/UtilService'
import { Buyer } from '../../types/CollectiveBuyTypes'

export const poolParticipantsModalVar = makeVar(false)

interface PoolParticipantsModalProps {
  itemId: string
  paymentTokenSymbol: string
}
export const PoolParticipantsModal = ({ itemId, paymentTokenSymbol }: PoolParticipantsModalProps) => {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const poolParticipantsModal = useReactiveVar(poolParticipantsModalVar)
  const chainId = useReactiveVar(chainIdVar)
  const { etherscanAddress } = getChainConfigById(chainId)

  const getSkeleton = (times = 3) => {
    return [...Array(times)].map(() => {
      return (
        <>
          <S.DivLine>
            <Spin indicator={<Skeleton.Avatar active size={30} shape='square' />} spinning />
            <Skeleton active paragraph={{ rows: 0 }} />
          </S.DivLine>
        </>
      )
    })
  }
  useEffect(() => {
    const handleBuyers = async () => {
      setLoading(true)
      setBuyers(await collectiveBuyService().getBuyersByItemId(itemId, chainId))
      setLoading(false)
    }
    handleBuyers()
  }, [itemId, chainId])

  return (
    <S.Modal visible={poolParticipantsModal} onCancel={() => poolParticipantsModalVar(false)} footer={null} destroyOnClose>
      <S.Content>
        <S.Header>
          <h1>Pool Participants</h1>
          <span>
            <img src={GroupIcon} alt='group' /> {buyers.length}
          </span>
        </S.Header>
        <S.Main>
          {loading && getSkeleton()}
          {!loading && (
            <ul className={buyers?.length >= 10 ? 'scrollable-y' : ''}>
              {buyers.map(buyer => {
                return (
                  <>
                    <li key={buyer.buyer}>
                      <div>
                        <img src={ProfileDefault} alt='profile' />
                        <span>{formatShortAddress(buyer.buyer)}</span>
                      </div>
                      <div>
                        <span>{paymentTokenSymbol}</span>
                        <span>{`${buyer.amount} ${paymentTokenSymbol}`}</span>
                        <S.Link target='_blank' href={`${etherscanAddress}address/${buyer.buyer}`}>
                          <img src={LinkIcon} alt='link' />
                        </S.Link>
                      </div>
                    </li>
                  </>
                )
              })}
            </ul>
          )}
        </S.Main>
      </S.Content>
    </S.Modal>
  )
}
const S = {
  Modal: styled(Modal)`
    width: 100% !important;
    height: 777px;
    max-width: 615px !important;
    .ant-modal-body {
      padding: 0px;
    }
    .ant-modal-close {
      display: none;
    }
    .ant-modal-content {
      border-radius: 16px;
    }
  `,
  Content: styled.div`
    background: ${props => props.theme.white};
    border-radius: 12px;
    padding: 80px;
    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      padding: 24px;
    }
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
          display: flex;
          align-items: flex-start;
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
      li:last-child {
        border-bottom: 1px solid ${props => props.theme.gray[1]} !important;
      }
      &.scrollable-y {
        overflow-y: scroll;
        height: 400px;
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
              font-size: 12px;
              line-height: 25px;
              margin-left: 8px;
            }
          }
          div:nth-child(2) {
            span {
              font-size: 12px;
              line-height: 25px;
              margin-right: 10px;
            }
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
  DivLine: styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
    .ant-spin {
      padding-right: 10px;
      .ant-skeleton {
        .ant-skeleton-avatar {
          border-radius: 8px;
        }
      }
    }
    .ant-skeleton {
      .ant-skeleton-content {
        h3 {
          width: 100% !important;
        }
        display: flex;
        width: 100%;
        align-items: center;
        height: 29px;
        .ant-skeleton-title {
          margin: 0;
        }
      }
    }
  `
}
