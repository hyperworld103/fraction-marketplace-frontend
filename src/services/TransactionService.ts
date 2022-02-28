import { Transaction, transactionLoadingVar, transactionModalVar, transactionVar } from '../graphql/variables/TransactionVariable'
import { notifyError } from './NotificationService'
import axios from 'axios';
import { API } from '../constants/api';
import { code } from '../messages'

export interface TransactionService {
  confirm(hash: string, chainId: number, timer?: number, confirmed?: boolean): Promise<void>
  getConfirmations(hash: string, chainId: number): Promise<number>
}

export function transactionService(): TransactionService {
  return {
    confirm: async (txHash: string, chainId: number, timer = 10, confirmed = false) => {
      let confirmedTransaction = confirmed
      setTimeout(async () => {
        const confirmations = await transactionService().getConfirmations(txHash, chainId)

        if (confirmations >= 1) {
          const transaction = transactionVar()
          if (transaction) {
            const { hash, type, params } = transaction
            const transactionItem: Transaction = {
              hash,
              type,
              params,
              confirmed: true
            }
            transactionVar(transactionItem)
            transactionModalVar(false)
            transactionLoadingVar(false)
            confirmedTransaction = true
          } else {
            notifyError('Could not confirm the transaction status')
          }
        } else {
          transactionService().confirm(txHash, chainId, 2, confirmedTransaction)
        }
      }, timer * 1000)
    },
    getConfirmations: async (hash: string, chainId: number) => {

      let w_return = 0;    
      let w_data = { hash: hash }
      await axios.post(API.server_url + API.item_getConfirmations, w_data)
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
  }
}
