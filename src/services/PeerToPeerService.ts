import axios from 'axios'
import { MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import { now } from 'lodash'
import { AbiItem } from 'web3-utils'
import erc20Abi from '../abi/erc20.json'
import peerToPeerAbi from '../abi/peerToPeerAbi.json'
import { getChainConfigById } from '../config'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { code } from '../messages'
import { initializeWeb3 } from './MultiWalletService'
import { notifyError } from './NotificationService'
import { units } from './UtilService'
import { API } from '../constants/api';

export interface PeerToPeerOrder {
  owner: string
  orderId: string
  bookAmount: string
  execAmount: string
  price: string
}

export interface PeerToPeerTransaction {
  id: string
  orderId: string
  price: number
  side: 'BUY' | 'SELL'
  baseToken: string
  quoteToken: string
  baseAmount: string
  quoteAmount: string
  baseFeeAmount: string | null
  quoteFeeAmount: string | null
  maker: string
  taker: string
  age: string
}

export interface PeerToPeerMarket {
  buyOrders: PeerToPeerOrder[]
  sellOrders: PeerToPeerOrder[]
  transactions: PeerToPeerTransaction[]
}

interface EstimateOrderExecutionByBook {
  _bookFeeAmount: string
  _execAmount: string
}

interface PeerToPeerService {
  cancelOrder(orderId: string, account: string): void
  createOrder(
    payableAmount: string,
    bookToken: string,
    execToken: string,
    bookAmount: string,
    execAmount: string,
    bookTokenDecimals: number,
    execTokenDecimals: number,
    account: string,
    orderType: string
  ): Promise<void>
  updateOrder(
    payableAmount: string,
    orderId: string,
    bookAmount: string,
    execAmount: string,
    bookTokenDecimals: number,
    execTokenDecimals: number,
    account: string,
    orderType: string
  ): Promise<void>
  executeOrder(
    payableAmount: string,
    orderId: string,
    bookAmount: string,
    execAmount: string,
    bookTokenDecimals: number,
    account: string,
    type: string
  ): Promise<void>
  estimateOrderExecutionByBook(orderId: string, bookAmount: string, bookTokenDecimals: number): Promise<EstimateOrderExecutionByBook>
  getMarket(baseToken: string, quoteToken: string): Promise<PeerToPeerMarket>
  isApprovedErc20(erc20Address: string, account: string): Promise<number>
  approveErc20(erc20Address: string, account: string): void
  getTokensPairMarketPrice(bookTokenAddress: string, execTokenAddress: string, bookTokenDecimals?: number): Promise<string | undefined>
  fee(): Promise<string>
}

export const TheGraphPeerToPeerService = (chainId: number): PeerToPeerService => {
  return {
    cancelOrder(orderId: string, account: string): void {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)

        const contractErc20 = new web3.eth.Contract(peerToPeerAbi as AbiItem[], peerToPeerAddress)
        contractErc20.methods.cancelOrder(orderId).send({ from: account }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.peerToPeerCancelOrder) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async createOrder(
      payableAmount: string,
      bookToken: string,
      execToken: string,
      bookAmount: string,
      execAmount: string,
      bookTokenDecimals: number,
      execTokenDecimals: number,
      account: string,
      orderType: string
    ): Promise<void> {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)

        const contractErc20 = new web3.eth.Contract(peerToPeerAbi as AbiItem[], peerToPeerAddress)
        const orderId = await contractErc20.methods.generateOrderId(account, Date.now()).call()

        let cond_data: any = {}
        cond_data['chainId'] = chainId;
        cond_data['typeOrder'] = orderType;
        if(orderType == 'Sell')
        {
          cond_data['baseToken'] = bookToken;
          cond_data['baseTokenDecimal'] = bookTokenDecimals;
          cond_data['quoteToken'] = execToken;
          cond_data['quoteTokenDecimal'] = execTokenDecimals;
          cond_data['baseAmount'] = bookAmount;
          cond_data['quoteAmount'] = execAmount;
        } else {
          cond_data['baseToken'] = execToken;
          cond_data['baseTokenDecimal'] = execTokenDecimals;
          cond_data['quoteToken'] = bookToken;
          cond_data['quoteTokenDecimal'] = bookTokenDecimals;
          cond_data['baseAmount'] = execAmount;
          cond_data['quoteAmount'] = bookAmount;
        }
        cond_data['owner'] = account;
        cond_data['orderId'] = orderId;
        cond_data['price'] = cond_data['quoteAmount'] / cond_data['baseAmount']

        await axios.post(API.server_url + API.item_createOrder, cond_data)

        await contractErc20.methods
          .createOrder(bookToken, execToken, orderId, units(bookAmount, bookTokenDecimals), units(execAmount, execTokenDecimals))
          .send({ from: account, value: payableAmount }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.peerToPeerCreateOrder) : clearTransaction()
          })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async updateOrder(
      payableAmount: string,
      orderId: string,
      bookAmount: string,
      execAmount: string,
      bookTokenDecimals: number,
      execTokenDecimals: number,
      account: string,
      orderType: string
    ): Promise<void> {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)

        let cond_data: any = {}
        cond_data['chainId'] = chainId;
        cond_data['typeOrder'] = orderType;
        if(orderType == 'Sell')
        {
          cond_data['baseAmount'] = bookAmount;
          cond_data['quoteAmount'] = execAmount;
        } else {
          cond_data['baseAmount'] = execAmount;
          cond_data['quoteAmount'] = bookAmount;
        }
        cond_data['owner'] = account;
        cond_data['orderId'] = orderId;
        cond_data['price'] = cond_data['quoteAmount'] / cond_data['baseAmount']

        await axios.post(API.server_url + API.item_updateOrder, cond_data)

        const contractErc20 = new web3.eth.Contract(peerToPeerAbi as AbiItem[], peerToPeerAddress)
        contractErc20.methods
          .updateOrder(orderId, units(bookAmount, bookTokenDecimals), units(execAmount, execTokenDecimals))
          .send({ from: account, value: payableAmount }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.peerToPeerUpdateOrder) : clearTransaction()
          })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async executeOrder(
      payableAmount: string,
      orderId: string,
      bookAmount: string,
      execAmount: string,
      bookTokenDecimals: number,
      account: string,
      type: string
    ): Promise<void> {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)
        const contractPeerToPeer = new web3.eth.Contract(peerToPeerAbi as AbiItem[], peerToPeerAddress)
        const feeAmount = contractPeerToPeer.methods.fee().call()
        let cond_data: any = {}
        cond_data['account'] = account;
        if(type == 'listings')
        {
          cond_data['baseAmount'] = bookAmount;
          cond_data['quoteAmount'] = execAmount;
        } else {
          cond_data['baseAmount'] = execAmount;
          cond_data['quoteAmount'] = bookAmount;
        }
        cond_data['orderId'] = orderId
        cond_data['chainId'] = chainId
        cond_data['fee'] = feeAmount

        await axios.post(API.server_url + API.item_tradeOrder, cond_data)

        contractPeerToPeer.methods
          .executeOrder(orderId, units(bookAmount, bookTokenDecimals), execAmount)
          .send({ from: account, value: payableAmount }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.peerToPeerExecuteOrder) : clearTransaction()
          })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async estimateOrderExecutionByBook(
      orderId: string,
      bookAmount: string,
      bookTokenDecimals: number
    ): Promise<EstimateOrderExecutionByBook> {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)
        const contractPeerToPeer = new web3.eth.Contract(peerToPeerAbi as AbiItem[], peerToPeerAddress)

        return contractPeerToPeer.methods.estimateOrderExecutionByBook(orderId, units(bookAmount, bookTokenDecimals)).call()
      } catch (error) {
        notifyError(code[5011], error)
        return { _bookFeeAmount: '', _execAmount: '' }
      }
    },
    approveErc20(erc20Address: string, account: string): void {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)
        const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
        contractErc20.methods.approve(peerToPeerAddress, MaxUint256.toString()).send({ from: account }, (_error: Error, tx: string) => {
          tx ? handleTransaction(tx, TransactionType.peerToPeerApproveErc20) : clearTransaction()
        })
      } catch (error) {
        notifyError(code[5011], error)
      }
    },
    async isApprovedErc20(erc20Address: string, account: string): Promise<number> {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)
        const contractERC20 = new web3.eth.Contract(erc20Abi as AbiItem[], erc20Address)
        return contractERC20.methods.allowance(account, peerToPeerAddress).call()
      } catch (error) {
        notifyError(code[5011], error)
        return 0
      }
    },
    async getMarket(baseToken: string, quoteToken: string): Promise<PeerToPeerMarket> {
      try {
        const getAge = (timestamp: string): string => {
          const executionTime = Number(timestamp) * 1000
          const diffSeconds = (now() - executionTime) / 1000

          let message = `${diffSeconds} seconds ago`

          if (diffSeconds > 60) {
            const minutes = Math.floor(diffSeconds / 60)
            message = `${minutes} mins ago`
          }

          if (diffSeconds > 3600) {
            const hours = Math.floor(diffSeconds / 3600)
            message = `${hours} hours ago`
          }

          if (diffSeconds > 86400) {
            const days = Math.floor(diffSeconds / 86400)
            message = `${days} days ago`
          }

          return message
        }

        let cond_data: any = {}
        cond_data['baseToken'] = baseToken
        cond_data['quoteToken'] = quoteToken
        const market = await axios.post(API.server_url + API.item_listOrder, cond_data)
        if(market.status != 200){
          return {
            sellOrders: [],
            buyOrders: [],
            transactions: []
          }
        } else if(market.data.market == null) {
          return {
            sellOrders: [],
            buyOrders: [],
            transactions: []
          }
        }

        const buyOrders: PeerToPeerOrder[] = market.data.market.bids.map(bid => {
          return {
            orderId: bid.id,
            owner: bid.owner,
            execAmount: bid.quoteAmount,
            bookAmount: bid.baseAmount,
            price: bid.price
          }
        })

        const sellOrders: PeerToPeerOrder[] = market.data.market.asks.map(ask => {
          return {
            orderId: ask.id,
            owner: ask.owner,
            execAmount: ask.quoteAmount,
            bookAmount: ask.baseAmount,
            price: ask.price
          }
        })

        const transactions: PeerToPeerTransaction[] = market.data.market.trades.map(trade => {
          return {
            ...trade,
            age: getAge(trade.timestamp),
            baseToken: trade.market.baseCurrency.id,
            quoteToken: trade.market.quoteCurrency.id
          }
        })

        return {
          transactions,
          sellOrders,
          buyOrders
        }
      } catch (error) {
        notifyError(code[5011], error)
        return { transactions: [], sellOrders: [], buyOrders: [] }
      }
    },
    async getTokensPairMarketPrice(
      bookTokenAddress: string,
      execTokenAddress: string,
      execTokenDecimals: number
    ): Promise<string | undefined> {
      try {
        let cond_data = {}
        cond_data['bookToken'] = bookTokenAddress
        cond_data['execToken'] = execTokenAddress

        const buyOrder = await axios.post(API.server_url + API.item_listBuyPrices, cond_data)

        const sellOrder = await axios.post(API.server_url + API.item_listSellPrices, cond_data)

        if(buyOrder.status != 200 && sellOrder.status != 200) {
          return undefined
        } else if (buyOrder.status != 200 && sellOrder.status == 200) {
          return sellOrder.data[0]? sellOrder.data[0] : undefined
        } else if (buyOrder.status == 200 && sellOrder.status != 200) {
          return buyOrder.data[0]? buyOrder.data[0] : undefined
        }

        const ordersSum = new BigNumber(sellOrder.data[0] || '0').plus(buyOrder.data[0] || '0')

        return ordersSum.dividedBy(2).toNumber().toLocaleString('en', { maximumFractionDigits: execTokenDecimals })
      } catch (error) {
        notifyError(code[5011], error)
        return undefined
      }
    },
    fee(): Promise<string> {
      try {
        const { peerToPeerAddress } = getChainConfigById(chainId)
        const web3 = initializeWeb3(chainId)
        const contractPeerToPeer = new web3.eth.Contract(peerToPeerAbi as AbiItem[], peerToPeerAddress)

        return contractPeerToPeer.methods.fee().call()
      } catch (error) {
        notifyError(code[5011], error)
        return Promise.resolve('')
      }
    }
  }
}
