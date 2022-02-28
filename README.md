

## Available Scripts

In the project directory, you can run:

### `yarn`

installs the required dependices.


### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# ZAI

ZAI is an experimental, VAI-pegged algorithmic stablecoin built on bsc designed to enable open market activities and capital efficient supply dynamics. At its core, ZAI is a fork of Empty Set Dollar (ESD) with mechanics evolving the fundamental components of Stability, Composability, and Decentralisation

![unknown (1)](https://user-images.githubusercontent.com/75070913/108617079-57b6eb80-740b-11eb-8298-ecd086f664a8.png)

With ZAI, Open Market Operations (OMO) can be performed not by selling external assets, but synthetic assets (coupons) generated within the ZAI ecosystem. In essence, ZAI is a synthetic token as a tool for more rapidly responding to market conditions. Similar to ESD, the ZAI token can expand supply to ultimately satisfy elastic market demand for VAI. As ZAI tokens are created, by proxy the effective collateralisation ratio of VAI continues to decrease, potentially to create a functional ecosystem where synthetic dynamics can enable sustainable, under-collateralised lending.

ZAI serves a hedge against VAI migrating from its 1 USD peg:

 - If VAI-USD peg decreases, (VAI < 1 USD) the ZAI protocol incurs debt and coupons are available for purchase
 - If VAI-USD peg increases, (VAI > 1 USD) ZAI is minted to repay previously issued coupons and distributed to bonded LPs and DAO participants

This counterbalance creates a hedge against VAI deviating from 1 USD, and can reduce future volatility exposure. In the example of a price shock, a borrower can burn ZAI for coupons, and when VAI returns to 1 USD, expansion of ZAI (corresponding to increased market demand for a DeFi stablecoin) allows coupons to be redeemed at a premium against liquidation loss. Through these mechanisms, ZAI fulfills the aggregate demand for VAI, without requiring additional VAI (and compounded liquidation risk) to be created. ZAI is capital efficient synthetic VAI, generating increased market liquidity and enabling additional OMO processes.

![unknown (2)](https://user-images.githubusercontent.com/75070913/108617206-46221380-740c-11eb-9d05-967582d06fe3.png)


# ZAI Parameters

ZAI will launch with on-chain decentralised governance so adjustments and upgrades can continuously be made to the protocol with token holder voting.
The most relevant parameters specific to ZAI include:
  
- Initial ZAI oracle constructed from ZAI-VAI CAKE LP
- 30-minute epochs, 48 epochs per cycle (24 hours)
- Coupon expiry length: 365 cycles
- Bonding length 5 cycles (DAO), 3 cycles (LP)
  
30-minute epochs allow for quick responses to market demand, either via expansion or redemption of coupons to immediately inject supply into the market when it is most critical. Longer coupon duration is intended for greater longevity of the protocol, and ensuring hedged debt positions mature over appropriate time scales while helping maintain metastable equilibrium.


# Dark Mode

![unknown](https://user-images.githubusercontent.com/75070913/108617303-16274000-740d-11eb-82ca-d4badc423ca9.png)




