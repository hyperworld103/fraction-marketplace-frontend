import { Button } from 'antd'
import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import iconBsc from '../assets/transparency/iconBsc.svg'
import iconEth from '../assets/transparency/iconEth.svg'
import imgGraphicBsc from '../assets/transparency/imgGraphicBsc.png'
import imgGraphicEth from '../assets/transparency/imgGraphicEth.png'
import iconLink from '../assets/transparency/link.svg'
import nftfyIcon from '../assets/transparency/nftfyIcon.svg'
import { getChainConfigById } from '../config'
import { getErc20BalanceOf, getErc20TotalSupply } from '../services/TrustedBridge'
import { formatShortAddress } from '../services/UtilService'
import { colors, fonts, viewport } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

interface TokenChartData {
  tokens: number
  date: string
}

export default function TransparencyPage() {
  const { nftfyTokenAddress, bridge } = getChainConfigById(1)
  const { bsc, ethereum } = bridge.networks

  const [circulatingSupply, setCirculatingSupply] = useState<BigNumber | undefined>(undefined)
  const [totalSupply, setTotalSupply] = useState<BigNumber | undefined>(undefined)

  const [ethCirculatingSupply, setEthCirculatingSupply] = useState<BigNumber | undefined>(undefined)
  const [bscCirculatingSupply, setBscCirculatingSupply] = useState<BigNumber | undefined>(undefined)

  const [angelAndSeedLockedValue, setAngelAndSeedLockedValue] = useState<BigNumber | undefined>(undefined)
  const [strategicLockedValue, setStrategicLockedValue] = useState<BigNumber | undefined>(undefined)
  const [privateLockedValue, setPrivateLockedValue] = useState<BigNumber | undefined>(undefined)
  const [vestingLockedValue, setVestingLockedValue] = useState<BigNumber | undefined>(undefined)
  const [dexLockedValue, setDexLockedValue] = useState<BigNumber | undefined>(undefined)
  const [advisorsLockedValue, setAdvisorsLockedValue] = useState<BigNumber | undefined>(undefined)
  const [farmingLockedValue, setFarmingLockedValue] = useState<BigNumber | undefined>(undefined)
  const [partnershipsLockedValue, setPartnershipsLockedValue] = useState<BigNumber | undefined>(undefined)

  const [vestingBalanceValue, setVestingBalanceValue] = useState<BigNumber | undefined>(undefined)

  const [privateCirculatingValue, setPrivateCirculatingValue] = useState<BigNumber | undefined>(undefined)
  const [strategicCirculatingValue, setStrategicCirculatingValue] = useState<BigNumber | undefined>(undefined)
  const [seedCirculatingValue, setSeedCirculatingValue] = useState<BigNumber | undefined>(undefined)
  const [angelCirculatingValue, setAngelCirculatingValue] = useState<BigNumber | undefined>(undefined)
  const [vestingCirculatingValue, setVestingCirculatingValue] = useState<BigNumber | undefined>(undefined)

  const [liquidityMiningLockedValue, setLiquidityMiningLockedValue] = useState<BigNumber | undefined>(undefined)
  const [daoTreasuryLockedValue, setDaoTreasuryLockedValue] = useState<BigNumber | undefined>(undefined)
  const [ecosystemFundLockedValue, setEcosystemFundLockedValue] = useState<BigNumber | undefined>(undefined)
  const [operationsLockedValue, setOperationsLockedValue] = useState<BigNumber | undefined>(undefined)
  const [teamLockedValue, setTeamLockedValue] = useState<BigNumber | undefined>(undefined)

  const [tokenChartData, setTokenChartData] = useState<TokenChartData[]>([])
  const [graphicHeight, setGraphicHeight] = useState({
    eth: 70,
    bsc: 30
  })

  const viewportWidth = window.visualViewport.width

  const privateSalesCirculatingSupply = (monthIndex: number, type: 'private' | 'strategic' | 'seed' | 'angel') => {
    switch (type) {
      case 'angel':
        if (monthIndex === 0) {
          return 0
        }

        return monthIndex < 16 ? (monthIndex - 1) * 63250 + 88000 : 15 * 63250 + 88000
      case 'private':
        return monthIndex < 8 ? monthIndex * 548999.9988 + 598909.09 : 8 * 548999.9988 + 598909.09
      case 'seed':
        if (monthIndex === 0) {
          return 0
        }

        return monthIndex < 16 ? (monthIndex - 1) * 230000 + 320000 : 15 * 230000 + 320000
      case 'strategic':
        if (monthIndex === 0) {
          return 0
        }

        return monthIndex < 12 ? (monthIndex - 1) * 368181.819 + 490909.092 : 11 * 368181.819 + 490909.092
      default:
        return 0
    }
  }

  const vestingCirculatingSupply = (weekIndex: number) => {
    const firstYearReward = 369230.77
    const secondYearReward = 338461.54
    const thirdYearReward = 276923.08
    const fourthYearReward = 246153.85
    const fifthYearReward = 184615.38
    const sixthYearReward = 123076.92

    // First year
    if (weekIndex < 52) {
      return firstYearReward * weekIndex
    }

    // Second year
    if (weekIndex >= 52 && weekIndex < 105) {
      return firstYearReward * 52 + secondYearReward * (weekIndex - 52)
    }

    // Third year
    if (weekIndex >= 105 && weekIndex < 158) {
      return firstYearReward * 52 + secondYearReward * 52 + thirdYearReward * (weekIndex - 52 * 2)
    }

    // Fourth year
    if (weekIndex >= 158 && weekIndex < 211) {
      return firstYearReward * 52 + secondYearReward * 52 + thirdYearReward * 52 + fourthYearReward * (weekIndex - 52 * 3)
    }

    // Fifth year
    if (weekIndex >= 211 && weekIndex < 264) {
      return (
        firstYearReward * 52 + secondYearReward * 52 + thirdYearReward * 52 + fourthYearReward * 52 + fifthYearReward * (weekIndex - 52 * 4)
      )
    }

    // Last year
    return (
      firstYearReward * 52 +
      secondYearReward * 52 +
      thirdYearReward * 52 +
      fourthYearReward * 52 +
      fifthYearReward * 52 +
      sixthYearReward * (weekIndex - 52 * 5)
    )
  }

  const projectVestingWeekAndMonthIndex = (desiredDate: Date) => {
    let currentWeek = 0
    let currentMonth = 0

    const projectLaunchingDate = new Date(Date.UTC(2021, 4, 13, 0, 0, 0, 0)).getTime() / 1000 / 60 / 60 / 24
    let projectVestingDate = new Date(Date.UTC(2021, 5, 13, 0, 0, 0, 0)).getTime() / 1000 / 60 / 60 / 24
    const currentUnix = desiredDate.getTime() / 1000 / 60 / 60 / 24

    currentMonth = Math.floor(currentUnix / 30 - projectLaunchingDate / 30)

    while (projectVestingDate < currentUnix) {
      currentWeek += 1
      projectVestingDate += 7
    }

    return { weekIndex: currentWeek, monthIndex: currentMonth }
  }

  const formatToken = (token: number) => {
    return token.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  }

  const checkCirculatingSupply = useCallback(async () => {
    const initTokenChart = () => {
      const dataList: TokenChartData[] = []

      const setTokensOnPeriod = (week: number, month: number, date: Date) => {
        const vestingCirculating = vestingCirculatingSupply(week - 1)

        const bscPrivateCirculatingValue = privateSalesCirculatingSupply(month, 'private')
        const ethAngelCirculatingValue = privateSalesCirculatingSupply(month, 'angel')
        const ethSeedCirculatingValue = privateSalesCirculatingSupply(month, 'seed')
        const ethStrategicCirculatingValue = privateSalesCirculatingSupply(month, 'strategic')

        const ethCirculatingSupplyValue = new BigNumber(5000000)
          .plus(new BigNumber(vestingCirculating))
          .plus(new BigNumber(ethStrategicCirculatingValue))
          .plus(new BigNumber(ethAngelCirculatingValue))
          .plus(new BigNumber(ethSeedCirculatingValue))

        const bscCirculatingSupplyValue = new BigNumber(bscPrivateCirculatingValue)
        const circulatingSupplyValue = bscCirculatingSupplyValue.plus(ethCirculatingSupplyValue)

        const monthString = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`

        dataList.push({
          date: `12/${monthString}/${date.getFullYear()}`,
          // tokens: circulatingSupplyValue.toNumber().toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
          tokens: circulatingSupplyValue.toNumber()
        })
      }

      let iteratingDate = new Date(Date.UTC(2021, 4, 13, 0, 0, 0, 0))
      const endingDate = new Date(Date.UTC(2027, 4, 13, 0, 0, 0, 0))

      while (iteratingDate.getTime() / 1000 / 60 / 60 / 24 < endingDate.getTime() / 1000 / 60 / 60 / 24) {
        // NECESSARY DO THIS TO WORK THE DAYS ADDITION IN A DATE
        const newDate = new Date(iteratingDate)
        newDate.setMonth(newDate.getMonth() + 1)

        iteratingDate = newDate

        const { weekIndex, monthIndex } = projectVestingWeekAndMonthIndex(iteratingDate)

        setTokensOnPeriod(weekIndex, monthIndex, iteratingDate)
      }

      setTokenChartData(dataList)
    }

    const { weekIndex, monthIndex } = projectVestingWeekAndMonthIndex(new Date())

    initTokenChart()

    const bscTotalSupply = await getErc20TotalSupply(nftfyTokenAddress, 56, true)
    const bscOperatorBalance = await getErc20BalanceOf(nftfyTokenAddress, bsc.operator, 56, true)
    const bscVaultBalance = await getErc20BalanceOf(nftfyTokenAddress, bsc.vault, 56, true)
    const bscMultisigBalance = await getErc20BalanceOf(nftfyTokenAddress, bsc.multisig, 56, true)

    const ethTotalSupply = await getErc20TotalSupply(nftfyTokenAddress, 1)
    const ethOperatorBalance = await getErc20BalanceOf(nftfyTokenAddress, ethereum.operator, 1)
    const ethVaultBalance = await getErc20BalanceOf(nftfyTokenAddress, ethereum.vault, 1)
    const ethMultisigBalance = await getErc20BalanceOf(nftfyTokenAddress, ethereum.multisig, 1)

    // Contracts locked value
    const ethDexLockedValue = await getErc20BalanceOf(nftfyTokenAddress, '0x8117Fd6572E2bB2de773145C55d9576dfc6786f9', 1)
    const ethFarmingLockedValue = await getErc20BalanceOf(nftfyTokenAddress, '0x662eca0a01173232cc9F537c5F7E6823B728A871', 1)
    const ethPartnershipsLockedValue = await getErc20BalanceOf(nftfyTokenAddress, '0xFd438F05d92540433c26B216238f1Eb2e11cf320', 1)
    const ethAdvisorsLockedValue = await getErc20BalanceOf(nftfyTokenAddress, '0x50161995Ba19aF305f88BBDdE33D9e03cBBb49ba', 1)
    const ethVestingBalanceValue = await getErc20BalanceOf(nftfyTokenAddress, '0xC841052b1C22059beF16A216a7488b39393B1126', 1)
    // const bscPrivateBalanceValue = await getErc20BalanceOf(nftfyTokenAddress, '0x7fB884c0E59008E7d1f8193Bd88CaB01ABE4f6f4', 56, true)

    const issuedTokens = new BigNumber(100000000)

    const ethBurnedValue = issuedTokens.minus(ethTotalSupply)
    const ethLockedValue = ethOperatorBalance.plus(ethVaultBalance).plus(ethMultisigBalance)
    const ethSupplyValue = issuedTokens.minus(new BigNumber(ethBurnedValue.plus(ethLockedValue)))

    const bscBurnedValue = issuedTokens.minus(bscTotalSupply)
    const bscLockedValue = bscOperatorBalance.plus(bscVaultBalance).plus(bscMultisigBalance)
    const bscSupplyValue = issuedTokens.minus(new BigNumber(bscBurnedValue.plus(bscLockedValue)))

    const totalSupplyValue = ethSupplyValue.plus(bscSupplyValue)

    const vestingCirculating = vestingCirculatingSupply(weekIndex - 1)

    const bscPrivateCirculatingValue = privateSalesCirculatingSupply(monthIndex, 'private')
    const ethAngelCirculatingValue = privateSalesCirculatingSupply(monthIndex, 'angel')
    const ethSeedCirculatingValue = privateSalesCirculatingSupply(monthIndex, 'seed')
    const ethStrategicCirculatingValue = privateSalesCirculatingSupply(monthIndex, 'strategic')

    const ethCirculatingSupplyValue = new BigNumber(5000000)
      .plus(new BigNumber(vestingCirculating))
      .plus(new BigNumber(ethStrategicCirculatingValue))
      .plus(new BigNumber(ethAngelCirculatingValue))
      .plus(new BigNumber(ethSeedCirculatingValue))

    const bscCirculatingSupplyValue = new BigNumber(bscPrivateCirculatingValue)
    const circulatingSupplyValue = bscCirculatingSupplyValue.plus(ethCirculatingSupplyValue)
    const ethVestingLockedValue = ethVestingBalanceValue.minus(new BigNumber(vestingCirculating))

    const liquidityAvailable = new BigNumber(vestingCirculating).multipliedBy(0.2)
    const daoAvailable = new BigNumber(vestingCirculating).multipliedBy(0.3)
    const ecosystemAvailable = new BigNumber(vestingCirculating).multipliedBy(0.05)
    const operationsAvailable = new BigNumber(vestingCirculating).multipliedBy(0.05)
    const teamAvailable = new BigNumber(vestingCirculating).multipliedBy(0.2)

    setTotalSupply(totalSupplyValue)
    setEthCirculatingSupply(ethCirculatingSupplyValue)
    setBscCirculatingSupply(bscCirculatingSupplyValue)
    setCirculatingSupply(circulatingSupplyValue)

    setAngelAndSeedLockedValue(
      new BigNumber(5100000).minus(new BigNumber(ethAngelCirculatingValue)).minus(new BigNumber(ethSeedCirculatingValue))
    )
    setStrategicLockedValue(new BigNumber(4909090.92).minus(ethStrategicCirculatingValue))
    setPrivateLockedValue(new BigNumber(4990909.08).minus(bscPrivateCirculatingValue))
    setVestingLockedValue(ethVestingLockedValue)
    setDexLockedValue(ethDexLockedValue)
    setAdvisorsLockedValue(ethAdvisorsLockedValue)
    setFarmingLockedValue(ethFarmingLockedValue)
    setPartnershipsLockedValue(ethPartnershipsLockedValue)

    setVestingBalanceValue(ethVestingBalanceValue)

    setPrivateCirculatingValue(new BigNumber(bscPrivateCirculatingValue))
    setAngelCirculatingValue(new BigNumber(ethAngelCirculatingValue))
    setSeedCirculatingValue(new BigNumber(ethSeedCirculatingValue))
    setStrategicCirculatingValue(new BigNumber(ethStrategicCirculatingValue))

    setVestingCirculatingValue(new BigNumber(vestingCirculating))

    setLiquidityMiningLockedValue(new BigNumber(20000000).minus(liquidityAvailable))
    setDaoTreasuryLockedValue(new BigNumber(30000000).minus(daoAvailable))
    setEcosystemFundLockedValue(new BigNumber(5000000).minus(ecosystemAvailable))
    setOperationsLockedValue(new BigNumber(5000000).minus(operationsAvailable))
    setTeamLockedValue(new BigNumber(20000000).minus(teamAvailable))

    setGraphicHeight({
      bsc: bscCirculatingSupplyValue.div(circulatingSupplyValue).multipliedBy(100).toNumber(),
      eth: ethCirculatingSupplyValue.div(circulatingSupplyValue).multipliedBy(100).toNumber()
    })
  }, [bsc.multisig, bsc.operator, bsc.vault, ethereum.multisig, ethereum.operator, ethereum.vault, nftfyTokenAddress])

  useEffect(() => {
    checkCirculatingSupply()
  }, [checkCirculatingSupply])

  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.CardTitle>
          <span>NFTFY Transparency</span>
        </S.CardTitle>
        <S.Info>
          <div>
            <img src={nftfyIcon} alt='NFTFY' />
            <ul>
              <li>
                <strong>{`Circulating Supply `}</strong>
                <span>{circulatingSupply?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
              </li>
              <li>
                <strong>{`Max Supply `}</strong>
                <span>100,000,000.00</span>
              </li>
              <li>
                <strong>{`Total Supply `}</strong>
                <span>{totalSupply?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
              </li>
            </ul>
          </div>
          <div>
            <S.ActionButton href='https://medium.com/nftfy/introducing-nftfy-token-f2b2b1f4a0fa'>Introducing $NFTFY Token</S.ActionButton>
            <S.ActionButton href='/#/token/bridge'>$NFTFY bridge</S.ActionButton>
          </div>
        </S.Info>
        <S.Graphic>
          <h2>Token Release</h2>
          <ResponsiveContainer width='100%' height={500}>
            <AreaChart
              width={600}
              height={400}
              data={tokenChartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <CartesianGrid strokeDasharray='1 1' />
              <XAxis interval={viewportWidth > 768 ? 2.5 : 20} dataKey='date' />
              <YAxis />
              <Tooltip formatter={formatToken} />
              <Area type='monotone' dataKey='tokens' stroke={colors.gray5} fill={colors.gray10} />
            </AreaChart>
          </ResponsiveContainer>
        </S.Graphic>
        <S.GraphicSupply>
          <h2>Circulating Supply</h2>
          <p>Current supply is the amount issued on each network deducting funds burned or locked by bridge contracts:</p>
          <section>
            <div className='card'>
              <div>
                <img src={iconEth} alt='ETH' />
                <h4>Ethereum Mainnet</h4>
              </div>
              <div>
                <img src={imgGraphicEth} alt='gray' />
                <div className='info eth' style={{ height: `${graphicHeight.eth < 30 ? 30 : graphicHeight.eth}%` }}>
                  <h3>{`${graphicHeight.eth.toLocaleString('en', { maximumFractionDigits: 2 })}%`}</h3>
                  <span>{Number(ethCirculatingSupply).toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={iconBsc} alt='BSC' />
                <h4>Binance Smart Chain</h4>
              </div>
              <div>
                <img src={imgGraphicBsc} alt='gray' />
                <div className='info bsc' style={{ height: `${graphicHeight.bsc < 30 ? 30 : graphicHeight.bsc}%` }}>
                  <h3>{`${graphicHeight.bsc.toLocaleString('en', { maximumFractionDigits: 2 })}%`}</h3>
                  <span>{Number(bscCirculatingSupply).toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </section>
        </S.GraphicSupply>
        <S.TablesContent>
          <h2>Address</h2>
          <p>
            The following contract addresses hold funds associated to the vesting and sales schedule currently locked and
            out-of-circulation.
          </p>
          <p>
            Read more about the tokenomics on our
            <a href='https://medium.com/nftfy/introducing-nftfy-token-f2b2b1f4a0fa'> Medium article</a>
          </p>
          <div className='table'>
            <h3>Strategic</h3>
            <ul>
              <li>
                <small>Description</small>
                <small>Address</small>
                <small>Allocation</small>
                <small>Available</small>
              </li>
              <li>
                <span>DEX</span>
                <span>
                  <a href='https://etherscan.io/address/0x8117Fd6572E2bB2de773145C55d9576dfc6786f9' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x8117Fd6572E2bB2de773145C55d9576dfc6786f9</span>
                    <span className='mobile'>{formatShortAddress('0x8117Fd6572E2bB2de773145C55d9576dfc6786f9')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>2,000,000.00</span>
                <span>{dexLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>Farming</span>
                <span>
                  <a href='https://etherscan.io/address/0x662eca0a01173232cc9F537c5F7E6823B728A871' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x662eca0a01173232cc9F537c5F7E6823B728A871</span>
                    <span className='mobile'>{formatShortAddress('0x662eca0a01173232cc9F537c5F7E6823B728A871')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>1,000,000.00</span>
                <span>{farmingLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>Partnerships</span>
                <span>
                  <a href='https://etherscan.io/address/0xFd438F05d92540433c26B216238f1Eb2e11cf320' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0xFd438F05d92540433c26B216238f1Eb2e11cf320</span>
                    <span className='mobile'>{formatShortAddress('0xFd438F05d92540433c26B216238f1Eb2e11cf320')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>1,000,000.00</span>
                <span>{partnershipsLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>Advisors</span>
                <span>
                  <a href='https://etherscan.io/address/0x50161995Ba19aF305f88BBDdE33D9e03cBBb49ba' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x50161995Ba19aF305f88BBDdE33D9e03cBBb49ba</span>
                    <span className='mobile'>{formatShortAddress('0x50161995Ba19aF305f88BBDdE33D9e03cBBb49ba')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>1,000,000.00</span>
                <span>{advisorsLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>
            </ul>

            <h3>Private Sales Vesting Schedule</h3>
            <ul className='vesting'>
              <li>
                <small className='expansive'>
                  Description
                  <br />
                  <small>Vesting</small>
                </small>
                <small>Vesting</small>
                <small>Address</small>
                <small>Allocation</small>
                <small>Locked</small>
                <small>Available</small>
              </li>
              <li>
                <span className='expansive'>
                  Private (BSC)
                  <br />
                  <span>9 months</span>
                </span>
                <span className='months'>9 months</span>
                <span>
                  <a href='https://bscscan.com/address/0x7fb884c0e59008e7d1f8193bd88cab01abe4f6f4' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x7fb884c0e59008e7d1f8193bd88cab01abe4f6f4</span>
                    <span className='mobile'>{formatShortAddress('0x7fb884c0e59008e7d1f8193bd88cab01abe4f6f4')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>4,990,909.08</span>
                <span>{privateLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{privateCirculatingValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span className='expansive'>
                  Strategic
                  <br />
                  <span>14 months</span>
                </span>
                <span className='months'>14 months</span>
                <span>
                  <a href='https://etherscan.io/address/0x0fD1847691627b27F6ce7Ec40F623CB9C9E8FCf3' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x0fD1847691627b27F6ce7Ec40F623CB9C9E8FCf3</span>
                    <span className='mobile'>{formatShortAddress('0x0fD1847691627b27F6ce7Ec40F623CB9C9E8FCf3')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>4,909,090.92</span>
                <span>{strategicLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{strategicCirculatingValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span className='expansive'>
                  Angel & Seed
                  <br />
                  <span>18 months</span>
                </span>
                <span className='months'>18 months</span>
                <span>
                  <a href='https://etherscan.com/address/0xc5F34066D3f89A638E8398Fa23C6fEC60438F402' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0xc5F34066D3f89A638E8398Fa23C6fEC60438F402</span>
                    <span className='mobile'>{formatShortAddress('0xc5F34066D3f89A638E8398Fa23C6fEC60438F402')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>5,100,000.00</span>
                <span>{angelAndSeedLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>
                  {angelCirculatingValue && seedCirculatingValue
                    ? angelCirculatingValue?.plus(seedCirculatingValue)?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })
                    : 0}
                </span>
              </li>
            </ul>

            <h3>6 - Year Vesting Schedule (weekly Release)</h3>
            <ul>
              <li>
                <small>Description</small>
                <small>Address</small>
                <small>Allocation</small>
                <small>Locked</small>
                <small>Available</small>
              </li>
              <li>
                <span>Vesting Schedule Contract</span>
                <span>
                  <a href='https://etherscan.io/address/0xC841052b1C22059beF16A216a7488b39393B1126' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0xC841052b1C22059beF16A216a7488b39393B1126</span>
                    <span className='mobile'>{formatShortAddress('0xC841052b1C22059beF16A216a7488b39393B1126')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>{vestingBalanceValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingCirculatingValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>
            </ul>
            <h3>Breakdown</h3>
            <ul>
              <li>
                <small>Description</small>
                <small>Address</small>
                <small>% Supply</small>
                <small>Locked</small>
                <small>Available</small>
              </li>
              <li>
                <span>Liquidity Mining</span>
                <span>
                  <a href='https://etherscan.io/address/0xa0F0aB47c528d318b26E793E3Ab32446a4dE05a4' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0xa0F0aB47c528d318b26E793E3Ab32446a4dE05a4</span>
                    <span className='mobile'>{formatShortAddress('0xa0F0aB47c528d318b26E793E3Ab32446a4dE05a4')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>20%</span>
                <span>{liquidityMiningLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingCirculatingValue?.multipliedBy(0.2).toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>DAO Treasury</span>
                <span>
                  <a href='https://etherscan.io/address/0x317F96aa282262074d977bcA1b34E629f8A3Cb7b' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x317F96aa282262074d977bcA1b34E629f8A3Cb7b</span>
                    <span className='mobile'>{formatShortAddress('0x317F96aa282262074d977bcA1b34E629f8A3Cb7b')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>30%</span>
                <span>{daoTreasuryLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingCirculatingValue?.multipliedBy(0.3).toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>Ecosystem Fund</span>
                <span>
                  <a href='https://etherscan.io/address/0x0E59da47900cC881cB39A15A090cB0cD15cCCae1' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x0E59da47900cC881cB39A15A090cB0cD15cCCae1</span>
                    <span className='mobile'>{formatShortAddress('0x0E59da47900cC881cB39A15A090cB0cD15cCCae1')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>5%</span>
                <span>{ecosystemFundLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingCirculatingValue?.multipliedBy(0.05).toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>Operations</span>
                <span>
                  <a href='https://etherscan.io/address/0x786DeCF86520EC3ae799ff610ddF9120ACF5F9Ce' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0x786DeCF86520EC3ae799ff610ddF9120ACF5F9Ce</span>
                    <span className='mobile'>{formatShortAddress('0x786DeCF86520EC3ae799ff610ddF9120ACF5F9Ce')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>5%</span>
                <span>{operationsLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingCirculatingValue?.multipliedBy(0.05).toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>

              <li>
                <span>Team</span>
                <span>
                  <a href='https://etherscan.io/address/0xCd717ec655f57ddBA70c8Ee078A84399908330fD' target='_blank' rel="noopener noreferrer">
                    <span className='desktop'>0xCd717ec655f57ddBA70c8Ee078A84399908330fD</span>
                    <span className='mobile'>{formatShortAddress('0xCd717ec655f57ddBA70c8Ee078A84399908330fD')}</span>
                    <img src={iconLink} alt='icon' />
                  </a>
                </span>
                <span>20%</span>
                <span>{teamLockedValue?.toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
                <span>{vestingCirculatingValue?.multipliedBy(0.2).toNumber().toLocaleString('en-us', { maximumFractionDigits: 2 })}</span>
              </li>
            </ul>
          </div>
        </S.TablesContent>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  Container: styled.div`
    flex: 1;
    margin: 0 auto;
    min-height: calc(100vh - 96px);
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%), #f5f5f5;

    .recharts-cartesian-axis-tick-value {
      font-size: 9px;
    }

    .recharts-default-tooltip {
      font-size: 14px;
      text-transform: capitalize;
    }
  `,
  CardTitle: styled.div`
    width: 100%;
    background: ${colors.white5};
    height: 344px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 64px;
    span {
      font-size: 52px;
      font-weight: 400;
      font-family: ${fonts.nunito};
      color: ${colors.gray11};
    }

    @media (max-width: ${viewport.lg}) {
      height: 144px;
      margin-bottom: 44px;
      span {
        font-size: 30px;
      }
    }
  `,
  Info: styled.div`
    width: 100%;
    max-width: ${viewport.xl};
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 64px;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;

      &:nth-child(2) {
        flex-direction: column;
        > a:first-child {
          margin-bottom: 16px;
        }
      }

      img {
        width: 88px;
        height: 88px;
      }

      ul {
        width: auto;
        min-width: 300px;
        padding-left: 24px;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          font-family: ${fonts.nunito};
          padding-bottom: 8px;
          strong {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: ${colors.gray11};
            img {
              width: 13px;
              height: 13px;
              cursor: pointer;
              margin-left: 4px;
            }
          }
          span {
            font-weight: normal;
            font-size: 16px;
            line-height: 20px;
          }
        }
      }
    }

    @media (max-width: ${viewport.lg}) {
      flex-direction: column;
      padding: 15px;
      margin-bottom: 44px;

      div {
        flex-direction: column;
        img {
          margin-bottom: 44px;
        }

        ul {
          padding-left: 0px;
          li {
            justify-content: space-between;
            strong {
              font-size: 14px;
              align-items: center;
              img {
                margin: 0;
              }
            }
            span {
              font-size: 14px;
            }
          }
        }
      }
    }
  `,
  ActionButton: styled(Button)`
    width: 100%;
    max-width: 225px;
    height: 32px;
    background: ${colors.blue1};
    border-radius: 8px;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    font-family: ${fonts.nunito};
    color: ${colors.white1};
    border: none;

    &:hover,
    &:focus,
    &:active {
      background: ${colors.blue2};
      color: ${colors.white1};
    }

    @media (max-width: ${viewport.lg}) {
      margin-top: 44px;
    }
  `,
  Graphic: styled.div`
    width: 100%;
    max-width: ${viewport.xl};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 64px;
    h2 {
      text-align: center;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 26px;
      color: ${colors.gray11};
      margin-bottom: 25px;
    }
    img {
      width: 100%;
      height: auto;
    }
    @media (max-width: ${viewport.lg}) {
      padding: 15px;
      margin-bottom: 44px;
      h2 {
        margin-bottom: 44px;
      }
    }
  `,
  GraphicSupply: styled.div`
    width: 100%;
    max-width: ${viewport.xl};
    margin: 0 auto;
    margin-bottom: 64px;
    h2 {
      text-align: center;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 26px;
      color: ${colors.gray11};
      padding-bottom: 8px;
    }
    p {
      text-align: center;
      color: ${colors.gray11};
      font-weight: normal;
      font-size: 12px;
      font-family: ${fonts.nunito};
      margin-bottom: 27px;
    }

    section {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .card {
        width: 320px;
        height: 288px;
        border: 1px solid #dedede;
        box-sizing: border-box;
        border-radius: 8px;
        margin: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        div:nth-child(1) {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 16px;
          h4 {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: ${colors.gray11};
            padding-left: 16px;
          }
        }
        div:nth-child(2) {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 180px;
          img {
            width: 100%;
            margin-bottom: -5px;
          }
          .info {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            &.eth {
              background: ${colors.gray11};
            }
            &.bsc {
              background: #e3a940;
            }
            h3 {
              font-weight: normal;
              font-size: 32px;
              color: ${colors.white};
            }
            span {
              color: ${colors.white};
              font-size: 16px;
            }
          }
        }
      }
    }
    @media (max-width: ${viewport.lg}) {
      padding: 15px;
      margin-bottom: 44px;
      section {
        flex-direction: column;
        align-items: center;
        align-self: center;
      }
    }

    @media (max-width: ${viewport.sm}) {
      section {
        .card {
          width: 100%;
        }
      }
    }
  `,
  TablesContent: styled.div`
    width: 100%;
    max-width: ${viewport.xl};
    margin: 0 auto;

    h2 {
      text-align: center;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 26px;
      color: ${colors.gray11};
      padding-bottom: 8px;
    }
    p {
      text-align: center;
      color: ${colors.gray11};
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
      font-family: ${fonts.nunito};

      &:last-of-type {
        margin-bottom: 40px;
      }
    }

    .table {
      word-break: break-all;

      h3 {
        font-weight: 400;
        font-size: 20px;
        line-height: 26px;
        color: ${colors.gray11};
        margin-bottom: 30px;
      }

      ul {
        margin-bottom: 60px;

        li {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: 1px solid #dedede;

          &.clear {
            border-bottom: 0;
            margin-bottom: 16px;
          }

          small {
            font-weight: 400;
            font-size: 12px;
            color: ${colors.gray11};
          }
          span {
            font-weight: normal;
            font-size: 16px;
            line-height: 20px;
            color: ${colors.gray11};
            a {
              img {
                padding-left: 5px;
              }
              span {
                color: ${colors.blue1};
                &.mobile {
                  display: none;
                }
              }
            }
          }

          small:nth-child(1) {
            width: 25%;
          }
          small:nth-child(2) {
            width: 40%;
          }
          small:nth-child(3) {
            width: 12%;
          }
          small:nth-child(4) {
            width: 13%;
          }

          span:nth-child(1) {
            width: 25%;
          }
          span:nth-child(2) {
            width: 40%;
          }
          span:nth-child(3) {
            width: 12%;
          }
          span:nth-child(4) {
            width: 13%;
          }
        }

        &.vesting {
          li {
            small:nth-child(1) {
              width: 13%;
            }
            small:nth-child(2) {
              width: 12%;
            }
            small:nth-child(3) {
              width: 40%;
            }
            small:nth-child(4) {
              width: 12%;
            }
            small:nth-child(5) {
              width: 13%;
            }

            span:nth-child(1) {
              width: 13%;
            }
            span:nth-child(2) {
              width: 12%;
            }
            span:nth-child(3) {
              width: 40%;
            }
            span:nth-child(4) {
              width: 12%;
            }
            span:nth-child(5) {
              width: 13%;
            }
          }
          .expansive {
            small {
              display: none;
            }
            span {
              display: none;
            }
          }
        }
      }
    }

    @media (max-width: ${viewport.lg}) {
      padding: 15px;
      .table {
        ul {
          li {
            small:nth-child(1) {
              width: 22% !important;
            }
            small:nth-child(2) {
              width: 18% !important;
            }
            small:nth-child(3) {
              width: 20% !important;
            }
            small:nth-child(4) {
              width: 20% !important;
            }
            small:nth-child(5) {
              width: 20% !important;
            }
            span:nth-child(1) {
              width: 22% !important;
            }
            span:nth-child(2) {
              width: 18% !important;
            }
            span:nth-child(3) {
              width: 20% !important;
            }
            span:nth-child(4) {
              width: 20% !important;
            }
            span:nth-child(5) {
              width: 20% !important;
            }
            small {
              font-size: 9px;
            }
            span {
              font-size: 11px;
              a {
                span {
                  color: ${colors.blue1};
                  &.mobile {
                    display: initial;
                  }
                  &.desktop {
                    display: none;
                  }
                }
              }
            }
          }
          &.vesting {
            small:nth-child(2) {
              display: none;
            }

            .expansive {
              small {
                display: initial;
                margin-top: 5px;
              }
              span {
                display: initial !important;
              }
            }
            .months {
              display: none;
            }
          }
        }
      }
    }
  `
}
