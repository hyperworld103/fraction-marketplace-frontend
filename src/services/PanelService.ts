import { AbiItem } from 'web3-utils'
import panelAbi from '../abi/panel.json'
import { getChainConfigById } from '../config'
import { chainIdVar } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { units } from './UtilService'

const { bridge } = getChainConfigById(chainIdVar())
const { panel } = bridge

export const getFee = async (chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const panelContract = new web3.eth.Contract(panelAbi as AbiItem[], panel)
    return panelContract.methods.fees(chainId).call()
  } catch (error) {
    notifyError(code[5011], error)
    return '0'
  }
}

export const calculateNetAmount = async (amount: string, decimals: number, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const panelContract = new web3.eth.Contract(panelAbi as AbiItem[], panel)

    return panelContract.methods.calcNetAmount(units(amount, decimals), chainId).call()
  } catch (error) {
    notifyError(code[5011], error)
    return '0'
  }
}

export const calculateDepositParams = async (account: string, amount: string, decimals: number, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const panelContract = new web3.eth.Contract(panelAbi as AbiItem[], panel)
    return panelContract.methods.calcDepositParams(account, units(amount, decimals), chainId).call()
  } catch (error) {
    notifyError(code[5011], error)
    return '0'
  }
}
