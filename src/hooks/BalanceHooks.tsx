import { useEffect, useState } from 'react'
import { userService } from '../services/UserService'
import { Balances } from '../types/WalletTypes'

export function useBalances(user) {
  const [balances, setBalances] = useState<Balances>({eth: 0, usdc: 0})

  useEffect(() => {
    const getBalances = async () => {
      const w_balances = await userService().getBalances()
      setBalances(w_balances)
    }
    getBalances()
  }, [user])

  return { balances }
}
