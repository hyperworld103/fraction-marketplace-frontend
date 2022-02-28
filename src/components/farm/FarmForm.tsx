import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import iconLink from '../../assets/icons/external-link-gray.svg'
import { stakeModalVar } from '../../graphql/variables/FarmVariable'
import { clearTransaction, transactionLoadingVar, TransactionType, transactionVar } from '../../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar, connectWalletModalVar } from '../../graphql/variables/WalletVariable'
import { farmService } from '../../services/FarmService'
import { notifySuccess } from '../../services/NotificationService'
import { coins } from '../../services/UtilService'
import { colors } from '../../styles/variables'
import { StakeModal } from './StakeModal'

interface FarmFormProps {
  name: string
  rightChainId: number
  contract: string
  contractErc20: string
  contractUrl: string
  contractErc20Url: string
  contractPosition: number
  blockTime: number
  icon: string
}

export const FarmForm = ({
  name,
  rightChainId,
  contract,
  contractErc20,
  contractUrl,
  contractErc20Url,
  contractPosition,
  blockTime,
  icon
}: FarmFormProps) => {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)

  const rightChain = chainId === rightChainId

  const [earned, setEarned] = useState<number>(0)
  const [approved, setApproved] = useState<boolean>(false)
  const [multiplier, setMultiplier] = useState<number>(1)
  const [liquidity, setLiquidity] = useState<number>(0)
  const [staked, setStaked] = useState<number>(0)
  const [apr, setApr] = useState<number>(0)
  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)

  const stakeModal = useReactiveVar(stakeModalVar)

  const {
    approveErc20,
    withdrawHarverst,
    isApprovedErc20,
    earnedBalance,
    bonusMultiplier,
    userPoolBalance,
    getPoolInfo,
    getTotalAllocPoint,
    rewardPerBlock,
    getErc20TotalSupply,
    getErc20Reserves
  } = farmService(rightChainId)

  const enable = async () => {
    if (account && rightChain) {
      approveErc20(account, contract, contractErc20)
      notifySuccess('Confirm the transaction on wallet')
    }
  }

  const stakeLP = async () => {
    stakeModalVar('stake')
  }

  const unstakeLP = async () => {
    stakeModalVar('unstake')
  }

  const connect = async () => {
    connectWalletModalVar(true)
  }

  const harverst = async () => {
    if (account && rightChain) {
      withdrawHarverst(account, contract, contractPosition)
      notifySuccess('Confirm the transaction on wallet')
    }
  }

  const checkApproved = useCallback(async () => {
    if (account && rightChain) {
      const approvedBalance = await isApprovedErc20(account, contract, contractErc20)
      setApproved(approvedBalance > 0)
    } else {
      setApproved(false)
    }
  }, [account, contract, contractErc20, isApprovedErc20, rightChain])

  const checkEarned = useCallback(async () => {
    if (account && rightChain) {
      const earnedValue = await earnedBalance(account, contract, contractPosition)
      setEarned(Number(earnedValue))
    } else {
      setEarned(0)
    }
  }, [account, contract, contractPosition, earnedBalance, rightChain])

  const checkStaked = useCallback(async () => {
    if (account && rightChain) {
      const stakedValue = Number(await userPoolBalance(account, contract, contractPosition))
      setStaked(stakedValue)
    } else {
      setStaked(0)
    }
  }, [account, contract, contractPosition, rightChain, userPoolBalance])

  const checkMultiplier = useCallback(async () => {
    const multiplierValue = await bonusMultiplier(contract)
    setMultiplier(Number(multiplierValue))
  }, [bonusMultiplier, contract])

  const checkApr = useCallback(async () => {
    const pool = await getPoolInfo(contract, contractPosition)
    const masterchefTotalAllocPoint = await getTotalAllocPoint(contract)
    const percentageOfPool = new BigNumber(pool.allocPoint).dividedBy(masterchefTotalAllocPoint)
    const blocksPerYear = new BigNumber(365).multipliedBy(24).multipliedBy(60).multipliedBy(60).dividedBy(blockTime)
    const rewardsPerYear = new BigNumber(blocksPerYear).multipliedBy(await rewardPerBlock(contract))
    const poolRewardPerYear = new BigNumber(rewardsPerYear).multipliedBy(percentageOfPool)
    const totalShares = new BigNumber(await getErc20TotalSupply(contractErc20))
    const percentageOfShares = new BigNumber(pool.amount).dividedBy(totalShares)
    const nftfyReserve = new BigNumber((await getErc20Reserves(contractErc20))[contractPosition]).multipliedBy(2)
    const rewardsLiquidityOfPool = new BigNumber(percentageOfShares).multipliedBy(nftfyReserve)
    const calculatedApr = new BigNumber(poolRewardPerYear).dividedBy(rewardsLiquidityOfPool)
    setApr(calculatedApr.multipliedBy(100).toNumber())
    setLiquidity(Number(coins(pool.amount.toString(), 18)))
  }, [
    blockTime,
    contract,
    contractErc20,
    contractPosition,
    getErc20Reserves,
    getErc20TotalSupply,
    getPoolInfo,
    getTotalAllocPoint,
    rewardPerBlock
  ])

  useEffect(() => {
    !transactionLoading && checkEarned()
  }, [checkEarned, transactionLoading])

  useEffect(() => {
    !transactionLoading && checkStaked()
  }, [checkStaked, transactionLoading])

  useEffect(() => {
    checkApproved()
  }, [checkApproved])

  useEffect(() => {
    checkApr()
  }, [checkApr])

  useEffect(() => {
    checkMultiplier()
  }, [checkMultiplier])

  useEffect(() => {
    if (
      !transactionLoading &&
      transaction &&
      (transaction.type === TransactionType.farmApproveErc20 || transaction.type === TransactionType.farmWithdrawHarverst) &&
      transaction.confirmed
    ) {
      clearTransaction()
    }
  }, [transaction, transactionLoading])

  return (
    <>
      <S.Content>
        <S.Card>
          <div>
            <img alt={name} src={icon} />
            <span>{`Farm ${name}`}</span>
          </div>
          <div>
            <S.BoxInfo>
              <h5>NFTFY EARNED</h5>
              <div>
                <p>{Number(earned).toLocaleString('en-us', { maximumFractionDigits: 2 })}</p>
                <S.ButtonHarvest disabled={!approved || !earned} onClick={harverst}>
                  Harvest
                </S.ButtonHarvest>
              </div>
            </S.BoxInfo>
            {!staked && (
              <S.BoxInfo>
                <h5>{`STAKE ${name}`}</h5>
                {!account && <S.ButtonStakeLP onClick={connect}>Connect Wallet</S.ButtonStakeLP>}
                {account && !approved && (
                  <S.ButtonStakeLP disabled={!rightChain} onClick={enable}>
                    {rightChain ? 'Unlock Farm' : 'Not available on this network'}
                  </S.ButtonStakeLP>
                )}
                {account && approved && <S.ButtonStakeLP onClick={stakeLP}>Stake LP</S.ButtonStakeLP>}
              </S.BoxInfo>
            )}
            {!!staked && (
              <S.BoxInfo>
                <h5>{`${name} STAKED`}</h5>
                <div>
                  <p>{Number(staked).toLocaleString('en-us', { maximumFractionDigits: 2 })}</p>
                  <span>
                    <S.ButtonUnstakeLP onClick={unstakeLP}>-</S.ButtonUnstakeLP>
                    <S.ButtonUnstakeLP onClick={stakeLP}>+</S.ButtonUnstakeLP>
                  </span>
                </div>
              </S.BoxInfo>
            )}
            <ul>
              <li>
                <p>APR</p>
                <p>{`${Number(apr).toLocaleString('en-us', { maximumFractionDigits: 2 })}%`}</p>
              </li>
              <li>
                <p>Multiplier</p>
                <p>{`${multiplier}x`}</p>
              </li>
              <li>
                <p>Locked Liquidity</p>
                <p>{`${Number(liquidity).toLocaleString('en-us', { maximumFractionDigits: 2 })}`}</p>
              </li>
            </ul>
            <S.ListInfo>
              <a target='_blank' rel="noopener noreferrer" href={contractErc20Url}>
                {`Get ${name}`}
                <img src={iconLink} alt='link' />
              </a>
              <a target='_blank' rel="noopener noreferrer" href={contractUrl}>
                View Contract
                <img src={iconLink} alt='link' />
              </a>
            </S.ListInfo>
          </div>
        </S.Card>
      </S.Content>
      <StakeModal
        action={stakeModal}
        onCancel={() => {
          stakeModalVar(undefined)
          checkStaked()
          checkEarned()
        }}
        name={name}
        contract={contract}
        contractErc20={contractErc20}
        contractPosition={contractPosition}
        rightChainId={rightChainId}
      />
    </>
  )
}

export const S = {
  Content: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  Title: styled.h3`
    padding: 30px 0;
    font-weight: 400;
    font-size: 26px;
    line-height: 130%;
    text-align: center;
    color: ${colors.gray12};
  `,
  Card: styled.div`
    height: 560px;
    min-width: 370px;
    max-width: 400px;

    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
    border: 1px solid ${colors.gray11};

    > div:nth-child(1) {
      width: 100%;
      height: 95px;
      background-color: ${colors.black1};
      color: ${colors.orange};
      display: flex;
      font-size: 20px;
      align-items: center;
      padding: 0 25px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);

      > img {
        padding: 0 20px;
        max-width: 90px;
        max-height: 50px;
      }
    }

    > div:nth-child(2) {
      padding: 24px;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;

      > ul {
        > li {
          width: 100%;
          display: flex;
          font-size: 16px;
          font-weight: 400;
          color: ${colors.gray12};
          justify-content: space-between;
          line-height: 24px;
        }
      }

      > div:last-child {
        font-weight: 400;
        font-size: 14px;
        text-decoration: none;
        color: ${colors.gray};
        line-height: 22px;
      }
    }
  `,
  BoxInfo: styled.div`
    border: 1px solid #dedede;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    padding: 16px;

    > h5 {
      font-size: 16px;
      color: ${colors.gray};
      margin-bottom: 10px;
    }
    > div {
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      word-break: break-all;

      > p {
        font-weight: 400;
      }

      > span {
        min-width: 112px;
        span {
          font-weight: 400;
          font-size: 32px;
          line-height: 32px;
        }
      }
    }
  `,
  ButtonHarvest: styled(Button)`
    font-weight: 600;
    height: 48px;
    width: 142px;
    border: none;
    background: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    border-radius: 8px;
    color: white;

    &:hover,
    &:focus,
    &:active {
      background: linear-gradient(90deg, #f86e4f 5.73%, #fc5f74 100%);
      color: ${colors.white};
    }
  `,
  ButtonUnstakeLP: styled(Button)`
    font-weight: 600;
    height: 48px;
    width: 48px;
    border: none;
    background: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    border-radius: 8px;
    color: white;
    margin-left: 8px;

    &:hover,
    &:focus,
    &:active {
      background: linear-gradient(90deg, #f86e4f 5.73%, #fc5f74 100%);
      color: ${colors.white};
    }
  `,
  ButtonStakeLP: styled(Button)`
    height: 48px;
    width: 100%;
    background: white;
    color: ${colors.orange};
    border: 2px solid ${colors.orange};
    font-size: 16px;
    border-radius: 8px;
    font-weight: 600;

    &:hover,
    &:focus,
    &:active {
      border: 2px solid #fc5f74;
      color: #fc5f74;
    }
  `,
  ListInfo: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    a {
      color: ${colors.gray};
      font-size: 14px;
      line-height: 160%;
      img {
        margin-left: 5px;
      }
    }
  `
}
