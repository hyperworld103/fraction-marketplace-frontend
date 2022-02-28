import { makeVar } from '@apollo/client'

// eslint-disable-next-line no-shadow
export enum TransactionType {
  fractionalize = 'fractionalize',
  fractionalizeApprove = 'fractionalizeApprove',
  mint = 'mint',
  mintApprove = 'mintApprove',
  mintBox = 'mintBox',
  mintBoxApprove = 'mintBoxApprove',
  portfolioClaim = 'portfolioClaim',
  portfolioClaimApprove = 'portfolioClaimApprove',
  boxAddItem = 'boxAddItem',
  setApprovalForAllErc721 = 'setApprovalForAllErc721',
  removeNftInBox = 'removeNftInBox',
  redeem = 'redeem',
  approveErc20Redeem = 'approveErc20Redeem',
  peerToPeerCancelOrder = 'peerToPeerCancelOrder',
  peerToPeerCreateOrder = 'peerToPeerCreateOrder',
  peerToPeerUpdateOrder = 'peerToPeerUpdateOrder',
  peerToPeerDeleteOrder = 'peerToPeerDeleteOrder',
  peerToPeerExecuteOrder = 'peerToPeerExecuteOrder',
  peerToPeerApproveErc20 = 'peerToPeerApproveErc20',
  bid = 'bid',
  bidApprove = 'bidApprove',
  bidUpdate = 'bidUpdate',
  bidCancel = 'bidCancel',
  farmApproveErc20 = 'farmApproveErc20',
  farmWithdraw = 'farmWithdraw',
  farmWithdrawHarverst = 'farmWithdrawHarverst',
  farmDeposit = 'farmDeposit',
  collectiveBuyList = 'collectiveBuyList',
  collectiveBuyJoinGroup = 'collectiveBuyJoinGroup',
  collectiveBuyApproveJoinGroup = 'collectiveBuyApproveJoinGroup',
  collectiveBuyApproveList = 'collectiveBuyApproveList',
  collectiveBuyPayout = 'collectiveBuyPayout',
  collectiveBuyClaim = 'collectiveBuyClaim',
  collectiveBuyAcceptOffer = 'collectiveBuyAcceptOffer',
  collectiveBuyRelist = 'collectiveBuyRelist',
  collectiveBuyRemoveParticipation = 'collectiveBuyRemoveParticipation',
  collectiveBuyCancel = 'collectiveBuyCancel',
  collectiveBuyRedeem = 'collectiveBuyRedeem',
  collectiveBuyUpdatePrice = 'collectiveBuyUpdatePrice'
}

export type Transaction = {
  hash: string
  type: TransactionType
  params?: TransactionParams
  confirmed: boolean
}

export type TransactionParams = {
  address?: string
}

export const transactionModalVar = makeVar<boolean>(false)
export const transactionLoadingVar = makeVar<boolean>(false)
export const transactionVar = makeVar<Transaction | undefined>(undefined)

export const handleTransaction = (hash: string, type: TransactionType, params?: TransactionParams) => {
  const transaction: Transaction = { hash, type, params, confirmed: false }
  transactionVar(transaction)
  transactionLoadingVar(true)
  transactionModalVar(true)
}

export const clearTransaction = () => {
  transactionVar(undefined)
  transactionLoadingVar(false)
  transactionModalVar(false)
}
