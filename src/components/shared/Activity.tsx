import React from 'react'
import styled from 'styled-components'
import *  as IoIcons from 'react-icons/io';
import { viewport } from '../../styles/variables'

export const Activity = () => {

  return (
    <S.Row>
      <S.Col>
        <div>
          <div>
            <div>
              <IoIcons.IoIosArrowDown />
              Activity
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Collection</th>
                    <th>Item</th>
                    <th>Event</th>
                    <th>Price</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Transaction Hash</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
              <nav>
                <ul>
                  <li>
                    <a href="#">Loading...</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </S.Col>
    </S.Row>
  )
}

const S = {
  Row: styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
  `,
  Col: styled.div`
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    @media (min-width: ${viewport.md}) {
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    div: nth-child(1) {
      animation-name: fadeIn;
      animation-duration: 1s;

      div: nth-child(1) {
        margin-bottom: 1.5rem;
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background: ${props=>props.theme.gray['0']};
        background-clip: border-box;
        border: 1px solid ${props=>props.theme.gray['2']};
        color: ${props=>props.theme.gray['4']};
        border-radius: 0.25rem;

        div: nth-child(1) {
          border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
          padding: 0.75rem 1.25rem;
          margin-bottom: 0;
          background-color: ${props=>props.theme.gray['1']};
          border-bottom: 1px solid ${props=>props.theme.gray['2']};
          border-top-width: 0px;
          border-left-width: 0px;
          border-right-width: 0px;
          display: inline-block;
          > svg {
            width: 20px;
            height: 20px;
            margin-right: 0.5rem;
            position: relative;
            top: 5px;
          }
        }

        div: nth-child(2) {
          overflow: hidden;
          overflow-x: auto;
          flex: 1 1 auto;
          padding: 1.25rem;
          
          > table {
            border: 1px solid ${props=>props.theme.gray['2']};
            width: 100%;
            margin-bottom: 1rem;
            color: ${props=>props.theme.gray['4']};
            
            th {
              vertical-align: bottom;
              border: 1px solid ${props=>props.theme.gray['2']};
              border-bottom-width: 2px;
              padding: 0.3rem;
            }
          }

          > nav {
            > ul {
              display: flex;
              padding-left: 0;
              list-style: none;
              border-radius: 0.25rem;
              a {
                border-radius: 0.25rem;
                margin-left: 0;
                position: relative;
                display: block;
                padding: 0.5rem 0.75rem;
                line-height: 1.25;
                color: #ee294f;
                background-color: ${props=>props.theme.gray['0']};
                border: 1px solid ${props=>props.theme.gray['2']};
              }
            }
          }
        }
      }
    }
  `,
}
