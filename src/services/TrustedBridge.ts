import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import erc20Abi from '../abi/erc20.json'
import trustedBridgeAbi from '../abi/trustedBridge.json'
import { getChainConfigById } from '../config'
import { chainIdVar } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { scale } from './UtilService'

const { bridge } = getChainConfigById(chainIdVar())
const { trustedBridge } = bridge

export const deposit = async (
  targetBridge: string,
  targetChainId: number,
  server: string,
  sourceAmount: string,
  targetAmount: string,
  timestamp: string,
  transferId: string,
  accountAddress: string
) => {
  try {
    const web3 = initializeWeb3(chainIdVar())
    const contractTrustedBridgeAbi = new web3.eth.Contract(trustedBridgeAbi as AbiItem[], trustedBridge)

    await contractTrustedBridgeAbi.methods
      .deposit(targetBridge, targetChainId, server, sourceAmount, targetAmount, timestamp, transferId)
      .send({ from: accountAddress })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const getErc20TotalSupply = async (erc20Address: string, chainId: number, useQuicknode?: boolean): Promise<BigNumber> => {
  try {
    const decimals = 18
    const web3 = useQuicknode ? initializeWeb3(chainId, 'quicknode') : initializeWeb3(chainId, 'infura')
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
    const totalSupply = await contractErc20.methods.totalSupply().call()
    return scale(new BigNumber(totalSupply), -decimals)
  } catch (error) {
    notifyError(code[5011], error)
    return error
  }
}

export const getErc20BalanceOf = async (
  erc20Address: string,
  balanceOfAddress: string,
  chainId: number,
  useQuicknode?: boolean
): Promise<BigNumber> => {
  try {
    const web3 = useQuicknode ? initializeWeb3(chainId, 'quicknode') : initializeWeb3(chainId, 'infura')
    const decimals = 18
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
    const balance = await contractErc20.methods.balanceOf(balanceOfAddress).call()
    return scale(new BigNumber(balance), -decimals)
  } catch (error) {
    notifyError(code[5011], error)
    return error
  }
}
