import { MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import erc20Abi from '../abi/erc20.json'
import erc20BalancerAbi from '../abi/erc20LPBalancer.json'
import erc20PancakeAbi from '../abi/erc20pancake.json'
import masterChefAbi from '../abi/masterChef.json'
import { getChainConfigById } from '../config'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { code } from '../messages'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { coins, units } from './UtilService'

interface FarmService {
  isApprovedErc20(account: string, contract: string, contractErc20: string): Promise<number>
  approveErc20(account: string, contract: string, contractErc20: string): void
  withdraw(amount: string, account: string, contract: string, contractPosition: number): void
  withdrawHarverst(account: string, contract: string, contractPosition: number): void
  earnedBalance(account: string, contract: string, contractPosition: number): Promise<string>
  bonusMultiplier(contract: string): Promise<string>
  liquidityBalance(contract: string, contractPosition: number): Promise<string>
  userPoolBalance(account: string, contract: string, contractPosition: number): Promise<string>
  getErc20Balance(account: string, contract: string): Promise<string>
  deposit(amount: string, account: string, contract: string, contractPosition: number): void
  rewardPerBlock(contract: string): Promise<BigNumber>
  getPoolInfo(contract: string, contractPosition: number): Promise<{ allocPoint: number; amount: number }>
  getTotalAllocPoint(contract: string): Promise<number>
  getErc20TotalSupply(contract: string): Promise<string>
  getErc20Reserves(contractErc20: string): Promise<BigNumber[]>
}

export const farmService = (chainId: number): FarmService => {
  return {
    isApprovedErc20: async (account, contract, contractErc20) => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractERC20 = new web3.eth.Contract(erc20Abi as AbiItem[], contractErc20)
        return new BigNumber(await contractERC20.methods.allowance(account, contract).call()).toNumber()
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    approveErc20: (account, contract, contractErc20) => {
      try {
        const web3 = initializeWeb3(chainId)
        const contractERC20 = new web3.eth.Contract(erc20Abi as AbiItem[], contractErc20)
        contractERC20.methods.approve(contract, MaxUint256.toString()).send({ from: account }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.farmApproveErc20) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    withdraw: async (amount, account, contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        await contractMasterChef.methods
          .withdraw(contractPosition, units(amount, 18))
          .send({ from: account }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.farmWithdraw) : clearTransaction()
          })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    withdrawHarverst: (account, contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        contractMasterChef.methods.withdraw(contractPosition, units('0', 18)).send({ from: account }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.farmWithdrawHarverst) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    earnedBalance: async (account, contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        const earned = await contractMasterChef.methods.pendingReward(contractPosition, account).call()
        return coins(earned, 18)
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    bonusMultiplier: async contract => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        return contractMasterChef.methods.bonusMultiplier().call()
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    liquidityBalance: async (contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        const result = await contractMasterChef.methods.poolInfo(contractPosition).call()
        return coins(result.amount ? result.amount : '0', 18)
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    userPoolBalance: async (account, contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        const balance = (await contractMasterChef.methods.userInfo(contractPosition, account).call()).amount
        return balance ? coins(balance, 18) : '0'
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    getErc20Balance: async (account, contract) => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], contract)
        const balance = await contractErc20.methods.balanceOf(account).call()
        return coins(balance, 18)
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    deposit: (amount, account, contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        contractMasterChef.methods.deposit(contractPosition, units(amount, 18)).send({ from: account }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.farmDeposit) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    rewardPerBlock: async contract => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        return contractMasterChef.methods.rewardPerBlock().call()
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    getPoolInfo: async (contract, contractPosition) => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        return contractMasterChef.methods.poolInfo(contractPosition).call()
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    getTotalAllocPoint: async contract => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractMasterChef = new web3.eth.Contract(masterChefAbi as AbiItem[], contract)
        return Number(await contractMasterChef.methods.totalAllocPoint().call())
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    getErc20TotalSupply: async contractErc20 => {
      try {
        const web3 = initializeWeb3(chainId, true)
        const contractErc20Item = new web3.eth.Contract(erc20PancakeAbi as AbiItem[], contractErc20)
        return contractErc20Item.methods.totalSupply().call()
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    },
    getErc20Reserves: async contractErc20 => {
      try {
        if (chainId === 1) {
          const web3 = initializeWeb3(chainId, true)
          const { nftfyTokenAddress } = getChainConfigById(chainId)
          const contractErc20Item = new web3.eth.Contract(erc20BalancerAbi as AbiItem[], contractErc20)
          const balance = await contractErc20Item.methods.getBalance(nftfyTokenAddress).call()
          return [balance, balance]
        }

        const web3 = initializeWeb3(chainId, true)
        const contractAbi = new web3.eth.Contract(erc20PancakeAbi as AbiItem[], contractErc20)
        return contractAbi.methods.getReserves().call()
      } catch (error) {
        notifyError(code[5011], error)
        return error
      }
    }
  }
}
