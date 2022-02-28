import { AbiItem } from 'web3-utils'
import salesAbi from '../abi/salesAbi.json'
import { code } from '../messages'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { coins } from './UtilService'

export const getAvailable = async (salesAddress: string, accountAddress: string, chainId: number): Promise<string> => {
  try {
    const web3 = initializeWeb3(chainId)
    const salesContract = new web3.eth.Contract(salesAbi as AbiItem[], salesAddress)
    return coins(await salesContract.methods.available(accountAddress).call(), 18)
  } catch (error) {
    return '0'
  }
}

export const withdraw = async (salesAddress: string, accountAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const salesContract = new web3.eth.Contract(salesAbi as AbiItem[], salesAddress)
    return salesContract.methods.withdraw().send({ from: accountAddress })
  } catch (error) {
    notifyError(code[5011], error)
    return error
  }
}
