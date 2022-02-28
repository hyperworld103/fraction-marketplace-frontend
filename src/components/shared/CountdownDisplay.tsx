import React from 'react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

type CountdownData = {
  days: string
  hours: string
  minutes: string
  seconds: string
}

type CountdownAuctionProps = {
  cutoff: number
  smallGap?: boolean
}
export function CountdownDisplay({ cutoff, smallGap = false }: CountdownAuctionProps) {
  const [countdownData, setCountdownData] = useState<CountdownData | undefined>(undefined)

  useEffect(() => {
    const finishAuctionDate = moment.unix(cutoff)
    const launchInterval = setInterval(() => updateCountdown(), 1000)

    const updateCountdown = () => {
      const currentTime = moment.utc()
      const diff = moment(finishAuctionDate.diff(currentTime)).utc()
      const diffDays = finishAuctionDate.diff(currentTime, 'days')

      if (currentTime.isSameOrAfter(finishAuctionDate)) {
        setCountdownData({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        })

        clearInterval(launchInterval)
        return
      }

      setCountdownData({
        days: diffDays > 9 ? diffDays.toString(10) : `0${diffDays.toString(10)}`,
        hours: diff.format('HH'),
        minutes: diff.format('mm'),
        seconds: diff.format('ss')
      })
    }
  }, [cutoff])
  return (
    <S.Section smallGap={smallGap}>
      <h4>Auction ending in</h4>
      <div>
        <div>
          <span>{countdownData?.days}</span>
          <h3>Days</h3>
        </div>
        <div>
          <span>{countdownData?.hours}</span>
          <h3>Hours</h3>
        </div>
        <div>
          <span>{countdownData?.minutes}</span>
          <h3>Minutes</h3>
        </div>
        <div>
          <span>{countdownData?.seconds}</span>
          <h3>Seconds</h3>
        </div>
      </div>
    </S.Section>
  )
}

const S = {
  Section: styled.section<{ smallGap: boolean }>`
    font-style: normal;
    font-weight: normal;

    @media (min-width: ${props => props.theme.viewport.mobile}) and (max-width: ${props => props.theme.viewport.tablet}) {
      margin-left: 0;
    }

    > div {
      display: flex;
      ${props =>
        css`
          gap: ${props.smallGap ? 16 : 24}px;
        `}

      h4 {
        font-size: 14px;
        line-height: 19px;
        color: ${props => props.theme.gray[4]};
      }
      span {
        font-weight: 600;
        font-size: 40px;
        line-height: 55px;
        color: ${props => props.theme.black};
      }
      h3 {
        font-size: 12px;
        line-height: 16px;
        color: ${props => props.theme.gray[4]};
        text-align: center;
      }
    }
  `
}
