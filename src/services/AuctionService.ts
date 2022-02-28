import { MaxUint256 } from '@ethersproject/constants'
import { AbiItem } from 'web3-utils'
import nftfyErc20AuctionAbi from '../abi/erc20NftfyAuction.json'
import erc721Abi from '../abi/erc721.json'
import nftfyAuctionAbi from '../abi/nftfyAuction.json'
import { getChainConfigById } from '../config'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { code } from '../messages'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError, notifySuccess } from './NotificationService'
import { units } from './UtilService'
import axios from 'axios';
import Cookies from 'universal-cookie';
import { API } from '../constants/api';

export const fractionalizeErc721 = async (
  erc721Address: string,
  erc721Id: number,
  name: string,
  symbol: string,
  fractionPrice: string,
  fractionCount: string,
  fractionDecimals: number,
  paymentTokenAddress: string,
  fee: string,
  numberOfDays: number,
  chainId: number,
  itemId: string
) => {
    const kickoff = 0
    // 24 hours in seconds
    const duration = 60 * 60 * 24 * numberOfDays
    const unit1 = units(fractionCount, fractionDecimals);
    const unit2 = units(fee, 16);

    let w_data = {erc721Address: erc721Address, erc721Id: erc721Id, unit1: unit1, kickoff: kickoff, duration: duration, unit2: unit2, name: name, symbol: symbol, decimals: fractionDecimals, price: fractionPrice, paymentToken: paymentTokenAddress, type:'auction', chainId: chainId}
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
              console.log('++++++++++++++++++++++++++++' + data.result)
              handleTransaction(data.result, TransactionType.fractionalize);               
            } else {
              clearTransaction()
            }
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    let data = {fee: fee, days: numberOfDays, item_id: itemId, name: name, symbol: symbol, decimals: fractionDecimals, totalSupply: fractionCount, price: fractionPrice, paymentToken: paymentTokenAddress, type:'auction', chainId: chainId}
    let w_return;
    await axios.post(API.server_url + API.item_fractionAdd, data, headers)
    .then(response => {
        if(response.status == 200){
            let data:any = response.data;
            if(data.status){
                w_return = data.result;               
            }
            notifySuccess(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

export const approveErc721 = (erc721Address: string, erc721TokenId: number): void => {
  const cookies = new Cookies()
  const headers = {
      headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ cookies.get('token')
      }
  };

  let w_data = { address: erc721Address, tokenId: erc721TokenId, auction: true }
  axios.post(API.server_url + API.item_fracApprove, w_data, headers)
    .then(response => {
        if(response.status == 200){
            let data:any = response.data;
            if(data.status){
              handleTransaction(data.tx, TransactionType.fractionalizeApprove)
            } else {
              clearTransaction()
            }
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
  }

export const getApproved721 = async (erc721Address: string, erc721TokenId: number, chainId: number) => {

  let w_return = false;

  const cookies = new Cookies()
  const headers = {
      headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ cookies.get('token')
      }
  };

  let w_data = { address: erc721Address, tokenId: erc721TokenId, auction: true}
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

export const isApprovedErc20 = async (erc20Address: string, spenderAddress: string, accountAddress: string, chainId: number) => {
  const web3 = initializeWeb3(chainId)
  const contractERC20 = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)

  return contractERC20.methods.allowance(accountAddress, spenderAddress).call()
}

export const approveErc20 = (erc20Address: string, erc20SpenderAddress: string, accountAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)
    contractErc20Fraction.methods
      .approve(erc20SpenderAddress, MaxUint256.toString())
      .send({ from: accountAddress }, (_error: Error, tx: string) => {
        tx ? handleTransaction(tx, TransactionType.bidApprove) : clearTransaction()
      })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const bidAmountOf = async (erc20Address: string, accountAddress: string, fractionPrice: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)

    return contractErc20Fraction.methods.bidAmountOf(accountAddress, fractionPrice).call()
  } catch (error) {
    return error
  }
}

export const bidRangeOf = async (erc20Address: string, accountAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)

    return contractErc20Fraction.methods.bidRangeOf(accountAddress).call()
  } catch (error) {
    notifyError(code[5011], error)
    return error
  }
}

export const bid = async (
  erc20Address: string,
  paymentTokenDecimals: number,
  accountAddress: string,
  fractionPrice: string,
  isNetworkToken: boolean,
  chainId: number
) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)
    const payableAmount = isNetworkToken ? await bidAmountOf(erc20Address, accountAddress, fractionPrice, chainId) : 0

    await contractErc20Fraction.methods
      .bid(fractionPrice)
      .send({ from: accountAddress, value: payableAmount }, (_error: Error, tx: string) => {
        tx ? handleTransaction(tx, TransactionType.bid) : clearTransaction()
      })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const getStatusOffer = async (erc20Address: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)
    const result = contractErc20Fraction.methods.status().call()
    return result
  } catch (error) {
    notifyError(code[5011], error)
    return error
  }
}

export const isOwner = async (erc20Address: string, accountAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)

    return contractErc20Fraction.methods.isOwner(accountAddress).call()
  } catch (error) {
    notifyError(code[5011], error)
    return error
  }
}

export const redeem = async (erc20Address: string, accountAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)
    contractErc20Fraction.methods.redeem().send({ from: accountAddress }, (_error: Error, tx: string) => {
      tx ? handleTransaction(tx, TransactionType.redeem) : clearTransaction()
    })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const cancel = async (erc20Address: string, accountAddress: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)
    contractErc20Fraction.methods.cancel().send({ from: accountAddress }, (_error: Error, tx: string) => {
      tx ? handleTransaction(tx, TransactionType.bidCancel) : clearTransaction()
    })
  } catch (error) {
    notifyError(code[5011], error)
  }
}

export const updatePrice = async (erc20Address: string, accountAddress: string, fractionPrice: string, chainId: number) => {
  try {
    const web3 = initializeWeb3(chainId)
    const contractErc20Fraction = new web3.eth.Contract(nftfyErc20AuctionAbi as AbiItem[], erc20Address)
    contractErc20Fraction.methods.updatePrice(fractionPrice).send({ from: accountAddress }, (_error: Error, tx: string) => {
      tx ? handleTransaction(tx, TransactionType.bidUpdate) : clearTransaction()
    })
  } catch (error) {
    notifyError(code[5011], error)
  }
}
