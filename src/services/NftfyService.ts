import { MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import erc20Abi from '../abi/erc20.json'
import erc20SharesAbi from '../abi/erc20shares.json'
import erc721Abi from '../abi/erc721.json'
import nftfyAbi from '../abi/nftfy.json'
import { getChainConfigById } from '../config'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { accountVar } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { AssetERC20 } from '../types/WalletTypes'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError, notifySuccess } from './NotificationService'
import { coins, scale, units } from './UtilService'
import { getErc20Balance } from './WalletService'
import axios from 'axios';
import Cookies from 'universal-cookie';
import { API } from '../constants/api';

export const getApproved721 = async (erc721Address: string, erc721TokenId: number, chainId: number) => {

  let w_return = false;
  const cookies = new Cookies()
  const headers = {
      headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ cookies.get('token')
      }
  };

  let w_data = { address: erc721Address, tokenId: erc721TokenId, auction: false}
  await axios.post(API.server_url + API.item_getFracApprove, w_data, headers)
    .then(response => {
        if(response.status == 200){
            let data:any = response.data;
            if(data.status){
              w_return = data.result;
            }
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

export const approveErc721 = (erc721Address: string, erc721TokenId: number, chainId: number): void => {
  const cookies = new Cookies()
  const headers = {
      headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ cookies.get('token')
      }
  };

  let w_data = { address: erc721Address, tokenId: erc721TokenId, auction: false }
  console.log(w_data);
  axios.post(API.server_url + API.item_fracApprove, w_data, headers)
    .then(response => {
        if(response.status == 200){
            let data:any = response.data;
            if(data.status){
              handleTransaction(data.result, TransactionType.fractionalizeApprove)
            } else {
              clearTransaction()
            }
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
}

export const fractionalizeErc721 = async (
  erc721Address: string,
  erc721Id: number,
  name: string,
  symbol: string,
  fractionPrice: string,
  fractionCount: string,
  fractionDecimals: number,
  paymentTokenAddress: string,
  chainId: number,
  itemId: string
) => {
  //fractionalize request
  let unit = units(fractionCount, fractionDecimals);

  let w_data = {erc721Address: erc721Address, erc721Id: erc721Id, unit: unit, name: name, symbol: symbol, decimals: fractionDecimals, price: fractionPrice, paymentToken: paymentTokenAddress, type:'set_price', chainId: chainId}
  const cookies = new Cookies()
  const headers = {
      headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ cookies.get('token')
      }
  };

  await axios.post(API.server_url + API.item_fractionalize, w_data, headers)
  .then(response => {
      if(response.status == 200){
          let data:any = response.data;
          if(data.status){
            handleTransaction(data.result, TransactionType.fractionalize);               
          } else {
            clearTransaction()
          }
      }
  })
  .catch(error => {
      notifyError(code[5011], error)
  })

  // add fraction data request
  let data = {item_id: itemId, name: name, symbol: symbol, decimals: fractionDecimals, totalSupply: fractionCount, price: fractionPrice, paymentToken: paymentTokenAddress, type:'set_price', chainId: chainId}
  let w_return;

  // console.log(data)
  // await axios.post(API.server_url + API.item_fractionAdd, data, headers)
  // .then(response => {
  //     if(response.status == 200){
  //         let data:any = response.data;
  //         if(data.status){
  //             w_return = data.result;               
  //         }
  //         notifySuccess(data.message)
  //     }
  // })
  // .catch(error => {
  //     notifyError(code[5011], error)
  // })

  return w_return;
}

export const approveErc20 = async (erc20ShareAddress: string, account: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20ShareAddress)
    await contractErc20.methods.approve(account, MaxUint256.toString()).send({ from: account })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const approveErc20Redeem = (erc20ShareAddress: string, erc20PaymentAddress: string, account: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20PaymentAddress)
    contractErc20.methods.approve(erc20ShareAddress, MaxUint256.toString()).send({ from: account }, (_error: Error, tx: string) => {
      tx ? handleTransaction(tx, TransactionType.approveErc20Redeem) : clearTransaction()
    })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const approveErc20Bridge = async (
  erc20Address: string,
  erc20Decimals: number,
  erc20Amount: string,
  chainId: number,
  spenderAddress?: string
) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
    await contractErc20.methods.approve(spenderAddress || accountVar(), erc20Amount).send({ from: accountVar() })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const isApprovedErc20 = async (erc20Address: string, account: string, chainId: number) => {
  const { nftfyTokenAddress } = getChainConfigById(chainId)
  const web3 = initializeWeb3(chainId)
  const contractERC20 = new web3.eth.Contract(erc20Abi as AbiItem[], nftfyTokenAddress)
  return contractERC20.methods.allowance(account, erc20Address).call()
}

export const isApprovedErc20Redeem = async (erc20ShareAddress: string, erc20PaymentAddress: string, account: string, chainId: number) => {
  const web3 = initializeWeb3(chainId)
  const contractERC20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20PaymentAddress)
  return contractERC20.methods.allowance(account, erc20ShareAddress).call()
}

export const setApprovalForAllErc721 = async (erc721Address: string, ownerAddress: string, operatorAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc721 = new web3.eth.Contract(erc721Abi as AbiItem[], erc721Address)
    await contractErc721.methods.setApprovalForAll(operatorAddress, true).send({ from: ownerAddress }, (_error: Error, tx: string) => {
      tx ? handleTransaction(tx, TransactionType.setApprovalForAllErc721) : clearTransaction()
    })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const isApprovedForAllErc721 = async (erc721Address: string, ownerAddress: string, operatorAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc721 = new web3.eth.Contract(erc721Abi as AbiItem[], erc721Address)

    return contractErc721.methods.isApprovedForAll(ownerAddress, operatorAddress).call()
  } catch (error) {
    notifyError(code[5011], error)
    return false
  }
}
export const getWrapperERC721 = async (erc721Address: string, chainId: number) => {
  const { nftfyAddress } = getChainConfigById(chainId)
  const web3 = initializeWeb3(chainId)
  const contractNftfy = new web3.eth.Contract(nftfyAbi as AbiItem[], nftfyAddress)
  const wrapperERC721 = contractNftfy.methods.wrappers(erc721Address).call()

  return wrapperERC721
}

export const isRedeemableErc20 = async (erc20Address: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], erc20Address)
    return !(await contractErc20Shares.methods.released().call())
  } catch (error) {
    notifyError(code[5011], error)
    return false
  }
}

export const isClaimableErc20 = async (erc20Address: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], erc20Address)
    return contractErc20Shares.methods.released().call()
  } catch (error) {
    notifyError(code[5011], error)
    return false
  }
}

export const claimErc20 = (erc20Address: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], erc20Address)
    // contractErc20Shares.methods.claim().send({ from: account }, (_error: Error, tx: string) => {
    //   tx ? handleTransaction(tx, TransactionType.portfolioClaim) : clearTransaction()
    // })--------------------------------------------------------------------------------------------------------------------------------------------

    return true
  } catch (error) {
    notifyError(code[5011], error)
    return false
  }
}

export const redeemErc20 = async (erc20Address: string, account: string, chainId: number) => {
  try {
    const { ethAddress } = getChainConfigById(chainId)

    const web3 = initializeWeb3(chainId)
    const contractErc20Shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], erc20Address)

    const paymentToken = await contractErc20Shares.methods.paymentToken().call()
    const redeemAmount = await getAccountRedeemAmount(erc20Address, account, chainId)

    if (paymentToken === ethAddress) {
      contractErc20Shares.methods.redeem().send({ from: account, value: units(redeemAmount, 18) }, (_error: Error, tx: string) => {
        tx ? handleTransaction(tx, TransactionType.redeem) : clearTransaction()
      })
    } else {
      contractErc20Shares.methods.redeem().send({ from: account }, (_error: Error, tx: string) => {
        tx ? handleTransaction(tx, TransactionType.redeem) : clearTransaction()
      })
    }

    return true
  } catch (error) {
    notifyError(code[5011], error)
    return false
  }
}
export const getAccountRedeemAmount = async (erc20Address: string, account: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], erc20Address)
    const redeemAmountOf = await contractErc20Shares.methods.redeemAmountOf(account).call()
    return coins(redeemAmountOf, 18)
  } catch (error) {
    notifyError(code[5011], error)
    return '0'
  }
}

export const getAccountClaimAmount = async (erc20Address: string, chainId: number) => {
  try {
    const { ethAddress } = getChainConfigById(chainId)

    const web3 = initializeWeb3(chainId)
    const contractErc20Shares = new web3.eth.Contract(erc20SharesAbi as AbiItem[], erc20Address)

    let decimals = 18
    const paymentToken = await contractErc20Shares.methods.paymentToken().call()

    if (paymentToken !== ethAddress) {
      const contractPayment = new web3.eth.Contract(erc20Abi as AbiItem[], paymentToken)
      decimals = Number(await contractPayment.methods.decimals().call())
    }

    // const vaultBalance = await contractErc20Shares.methods.vaultBalanceOf(account).call()---------------------------------------------

    // return scale(new BigNumber(vaultBalance), -decimals)----------------------------------------------------------------------------
  } catch (error) {
    notifyError(code[5011], error)
    return '0'
  }
}

export const getFractionalizeAssetsList = async (chainId: number) => {
  const { ethAddress, balancer, erc20List } = getChainConfigById(chainId)
  const { eth } = balancer
  
  const erc20Promises: Promise<AssetERC20>[] = erc20List.map(async erc20 => {
    const balance = await getErc20Balance(erc20.address === eth ? ethAddress : erc20.address, erc20.decimals, chainId)
    return { ...erc20, balance: balance.toString() }
  })
  return Promise.all(erc20Promises)
}
