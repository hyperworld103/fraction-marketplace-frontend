import { AssetERC20 } from './types/WalletTypes'

export interface ChainConfig {
  id: number
  name: string
  openSeaApiUrl?: string
  pinataBaseUrl: string
  etherscanAddress: string
  bscScanAddress: string
  infuraAddress: string
  zeroXBaseUrl: string
  bscNodeAddress: string
  ethAddress: string
  networkTokenSymbol: string
  masterChefAddress: string
  boxAddress: string
  nftfyPeerToPeerBaseUrl: string
  nftfyNftBaseUrl: string
  nftfyMetaBaseUrl: string
  nftfyFracBaseUrl: string
  nftfy2FracBaseUrl: string
  nftfyTokenAddress: string
  nftfyTokenDecimals: number
  mint: {
    minterAddress: string
    defaultCollectionAddress: string
  }
  peerToPeerAddress: string
  stableCoinAddress: string
  stableCoinDecimals: number
  nftfyAddress: string
  nftfyAuctionAddress: string
  erc721Addresses: string[]
  assets: string[]
  cryptokitties: {
    apiUrl: string
    xApiToken: string
    contractAddress: string
    symbol: string
  }
  balancer: {
    subgraphUrl: string
    subgraphBackupUrl: string
    eth: string
    weth: string
    precision: number
    addresses: {
      bFactory: string
      bActions: string
      dsProxyRegistry: string
      exchangeProxy: string
      weth: string
      multicall: string
    }
    poolsUrl: string
  }
  ens: {
    subgraphUrl: string
    contractAddress: string
    symbol: string
  }
  decentraland: {
    subgraphUrl: string
    ens: {
      contractAddress: string
      symbol: string
    }
    estate: {
      contractAddress: string
      symbol: string
    }
    parcel: {
      contractAddress: string
      symbol: string
    }
  }
  box: {
    subgraphUrl: string
    contractAddress: string
    symbol: string
  }
  pools: {
    managementUrl: string
    createUrl: string
    chartColors: string[]
    main: string[]
    lbp: string[]
    fundsBpt: string[]
  }
  bridge: {
    panel: string
    trustedBridge: string
    networks: {
      bsc: {
        name: string
        chainId: number
        address: string
        operator: string
        vault: string
        multisig: string
      }
      ethereum: {
        name: string
        chainId: number
        address: string
        operator: string
        vault: string
        multisig: string
      }
    }
  }
  erc20List: AssetERC20[]
  blacklist: {
    contractAddresses: string[]
    tokenIdList: string[]
  }
  farms: {
    busdNftfy: string
    busdNftfyErc20: string
    bnbNftfy: string
    bnbNftfyErc20: string
    wethNftfy: string
    wethNftfyErc20: string
    daiNftfy: string
    daiNftfyErc20: string
  }
}

export const infuraKey = process.env.REACT_APP_INFURA_KEY
export const quickNodeKey = process.env.REACT_APP_QUICKNODE_KEY

export const allowedChains = [1, 3]

export const chainsConfig: ChainConfig[] = [
  {
    id: 1,
    openSeaApiUrl: 'https://api.opensea.io/api/v1',
    pinataBaseUrl: 'https://nftfypinningservice.azurewebsites.net/api/uploadMedia',
    etherscanAddress: 'https://etherscan.io/',
    bscScanAddress: 'https://bscscan.com/',
    name: 'mainnet',
    infuraAddress: `https://mainnet.infura.io/v3/${infuraKey}`,
    zeroXBaseUrl: 'https://api.0x.org',
    bscNodeAddress: `https://bsc-dataseed.binance.org/`,
    ethAddress: '0x0000000000000000000000000000000000000000',
    masterChefAddress: '',
    boxAddress: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
    networkTokenSymbol: 'ETH',
    mint: {
      minterAddress: '0x62cF87B0E441e6E3A1634304AbA6332F3Fd6464F',
      defaultCollectionAddress: '0x9c8a2b35B268bf2AA69f5fc105514e34daF3cEBb'
    },
    nftfyNftBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmTb4nBjfoUnGZNatsFQK5m2xwnW11qQ9ojyx2QfWNsoDV',
    nftfyMetaBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmRfqZi6KGQD9uZLw3pNCY4rsMBpDJDU9m4eRoQRib8PNc',
    peerToPeerAddress: '0x91FE09bB4D060abc2FD1460f87D19c4c9410448e',
    nftfyPeerToPeerBaseUrl: 'https://api.thegraph.com/subgraphs/id/Qmdm8v5BfQRzoz5mPr8FrdDosMsYS5kh8ctfMjK3cNqZ7W',
    nftfyFracBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmcqHCqjnRbWp4oMPWtrCq9MLHXjeJ3z1kbuy2y4EPFhG3',
    nftfy2FracBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmX32DAVtGKbym8Zr5ERHyaoSo86KV4eVPBoeKYrjPxBwy',
    nftfyTokenAddress: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
    nftfyTokenDecimals: 18,
    nftfyAddress: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
    nftfyAuctionAddress: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
    stableCoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    stableCoinDecimals: 18,
    blacklist: {
      contractAddresses: [
        '0x0622c046f185bdaec9d615fe458526423c1712fc',
        '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
        '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28'
      ],
      tokenIdList: []
    },
    farms: {
      busdNftfy: '0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3',
      busdNftfyErc20: '0xFa901CEF85f2C3A3F4FcBFe34904b8Da0f5Fc04e',
      bnbNftfy: '0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3',
      bnbNftfyErc20: '0xE4bA58268a64E93Fc29295308178816e774879f0',
      wethNftfy: '0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB',
      wethNftfyErc20: '0xd618f2990F69E73ac48115E79c029705F41aa994',
      daiNftfy: '0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB',
      daiNftfyErc20: '0x63E4c1d480a373F2d66c68c1A1a406Bd7C60A73e'
    },
    erc721Addresses: [],
    cryptokitties: {
      apiUrl: 'https://public.api.cryptokitties.co/v1',
      xApiToken: 'y21Z9U63U7YhJgaofcsgc_Plm6w5KDkMvdTICcZ19AE',
      contractAddress: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
      symbol: 'CK'
    },
    balancer: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
      subgraphBackupUrl: 'https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange/pools',
      eth: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      precision: 6,
      addresses: {
        bFactory: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
        bActions: '0xde4A25A0b9589689945d842c5ba0CF4f0D4eB3ac',
        dsProxyRegistry: '0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4',
        exchangeProxy: '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21',
        weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'
      },
      poolsUrl: 'https://pools.balancer.exchange/'
    },
    ens: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
      contractAddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      symbol: 'ENS'
    },
    decentraland: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
      ens: {
        contractAddress: '0x2a187453064356c898cae034eaed119e1663acb8',
        symbol: 'ENS'
      },
      parcel: {
        contractAddress: '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
        symbol: 'LAND'
      },
      estate: {
        contractAddress: '0x959e104E1a4dB6317fA58F8295F586e1A978c297',
        symbol: 'EST'
      }
    },
    box: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/id/QmXBX2oBntKD9oF2fiR4EcjCctPdnGH7zL1bhC27sLauCS',
      contractAddress: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      symbol: 'BOX'
    },
    pools: {
      managementUrl: 'https://pools.balancer.exchange/#/pool',
      createUrl: 'https://pools.balancer.exchange/#/',
      chartColors: ['#FF7070', '#FFB1AD', '#FF7470', '#FF5463', '#FF99AA', '#595B5F', '#8C8F95', '#AAADB3', '#C4C8CD', '#D9DEE2'],
      main: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
      lbp: ['0x6b175474e89094c44da98b954eedeac495271d0f'],
      fundsBpt: []
    },
    assets: [
      '0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e',
      '0x49f2beff98ce62999792ec98d0ee4ad790e7786f',
      '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
      '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
      '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
      '0xad32a8e6220741182940c5abf610bde99e737b2d',
      '0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b',
      '0x5bc25f649fc4e26069ddf4cf4010f9f706c23831',
      '0x20945ca1df56d237fd40036d47e866c7dccd2114',
      '0x705c71b262c511b66baa4791cc2be61b971bd784',
      '0x3d7753c4526f8657e383a46dc41ec97414941a80',
      '0x261efcdd24cea98652b9700800a13dfbca4103ff',
      '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
      '0x51a2310b37ead1d8f8fe01b89b4cd68fa58992d0',
      '0xe59064a8185ed1fca1d17999621efedfab4425c9',
      '0xa0afaa285ce85974c3c881256cb7f225e3a1178a',
      '0x6c2cf58e468b64b604407c6ea89c5868ed13c252',
      '0x80dc468671316e50d4e9023d3db38d3105c1c146',
      '0x704de5696df237c5b9ba0de9ba7e0c63da8ea0df',
      '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
      '0x7f1f2d3dfa99678675ece1c243d3f7bc3746db5d',
      '0x30cf203b48edaa42c3b4918e955fed26cd012a3f',
      '0x34a01c0a95b0592cc818cd846c3cf285d6c85a31',
      '0x64010f6ba757715d8f12d8317004425d73ca5a81',
      '0xe4f726adc8e89c6a6017f01eada77865db22da14',
      '0xc69a0ae4961b8bac945d854e1057117e575fe005',
      '0xac2c198f3103ee19bab07530f2bc2c2ae88f2cb5',
      '0xffffffff2ba8f66d4e51811c5190992176930278',
      '0xf2092e49701ddefdec82d518d8d34345302d1b43',
      '0x6fcb6408499a7c0f242e32d77eb51ffa1dd28a7e',
      '0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd',
      '0x875773784af8135ea0ef43b5a374aad105c5d39e',
      '0x41a08648c3766f9f9d85598ff102a08f4ef84f84',
      '0x859e4d219e83204a2ea389dac11048cc880b6aa8',
      '0xf5581dfefd8fb0e4aec526be659cfab1f8c781da',
      '0x8cacf4c0f660efdc3fd2e2266e86a9f57f794198',
      '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
      '0x9dc54c3633ba36e9c0205ee27584eb589ea96421',
      '0x59e9261255644c411afdd00bd89162d09d862e38',
      '0x31c8eacbffdd875c74b94b077895bd78cf1e64a3',
      '0x750dd34fb165be682fae445793ab9ab9729cdaa3',
      '0x67b6d479c7bb412c54e03dca8e1bc6740ce6b99c',
      '0x2ed30c582c7faf644f291db9eecdc5641057233e',
      '0x06745bee20ad9cc7dfb6f40b66504397235f547c',
      '0xfb5453340c03db5ade474b27e68b6a9c6b2823eb',
      '0x75a38f0d99eb3e4b18246febebb77b16cf95d754',
      '0x08d8fa18af801224719b90327670ab1145e24ba6',
      '0xf938424f7210f31df2aee3011291b658f872e91e',
      '0x945facb997494cc2570096c74b5f66a3507330a1',
      '0x544c42fbb96b39b21df61cf322b5edc285ee7429',
      '0xcbfef8fdd706cde6f208460f2bf39aa9c785f05d',
      '0xa06849c61e0919785661acb7fe3bcbd4500f6c2e',
      '0x27cf76c51309929c6c09659b43b026c1ab649516',
      '0xf675243988d10f9de458df019a501b64245e4eda',
      '0xbc4171f45ef0ef66e76f979df021a34b46dcc81d',
      '0xb8e57e2eff4b9c1ee413c7b24b1f52d83e16488c',
      '0xe4cfe9eaa8cdb0942a80b7bc68fd8ab0f6d44903',
      '0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429',
      '0x5a04a6246f2ce98230f5409bc11ccb0183929d02',
      '0x29cbd0510eec0327992cd6006e63f9fa8e7f33b7',
      '0x61b6325d72aa40aea68ef8a1e09055697b5b8d83',
      '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
      '0xf657666c7823c68dcca168c4c1c9a28d9d04ec29'
    ],
    bridge: {
      panel: '0x9A64c1e500ED64CB012290A3868F36D33bb85F7e',
      trustedBridge: '0xFD332f27B72d2730BF0B34A7dD3e51c9FB902cd0',
      networks: {
        ethereum: {
          chainId: 1,
          name: 'Ethereum Network',
          address: '0x41f455283d6230A4eE83aE7216FfFb527bBd862A',
          operator: '0xF9a7c456341fAFc861909c2FF17C8c6366234f2F',
          vault: '0x09567066a42c087218053525Fb2fB19A0bA78A6f',
          multisig: '0xc718E5a5b06ce7FEd722B128C0C0Eb9c5c902D92'
        },
        bsc: {
          chainId: 56,
          name: 'Binance Smart Chain Network (BEP20)',
          address: '0x41f455283d6230A4eE83aE7216FfFb527bBd862A',
          operator: '0xF9a7c456341fAFc861909c2FF17C8c6366234f2F',
          vault: '0x09567066a42c087218053525Fb2fB19A0bA78A6f',
          multisig: '0x4e9cA8ca6A113FC3Db72677aa04C8DE028618377'
        }
      }
    },
    erc20List: [
      {
        id: '1',
        name: 'mytoken',
        symbol: 'MTK',
        address: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
        balance: '0',
        decimals: 18,
        imageUrl: ''
      },
      {
        id: '2',
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        balance: '0',
        decimals: 6,
        imageUrl: ''
      }
    ]
  },
  {
    id: 3,
    openSeaApiUrl: 'https://api.opensea.io/api/v1',
    pinataBaseUrl: 'https://nftfypinningservice.azurewebsites.net/api/uploadMedia',
    etherscanAddress: 'https://etherscan.io/',
    bscScanAddress: 'https://bscscan.com/',
    name: 'mainnet',
    infuraAddress: `https://mainnet.infura.io/v3/${infuraKey}`,
    zeroXBaseUrl: 'https://api.0x.org',
    bscNodeAddress: `https://bsc-dataseed.binance.org/`,
    ethAddress: '0x0000000000000000000000000000000000000000',
    masterChefAddress: '',
    boxAddress: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
    networkTokenSymbol: 'ETH',
    mint: {
      minterAddress: '0x62cF87B0E441e6E3A1634304AbA6332F3Fd6464F',
      defaultCollectionAddress: '0x9c8a2b35B268bf2AA69f5fc105514e34daF3cEBb'
    },
    nftfyNftBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmTb4nBjfoUnGZNatsFQK5m2xwnW11qQ9ojyx2QfWNsoDV',
    nftfyMetaBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmRfqZi6KGQD9uZLw3pNCY4rsMBpDJDU9m4eRoQRib8PNc',
    peerToPeerAddress: '0x91FE09bB4D060abc2FD1460f87D19c4c9410448e',
    nftfyPeerToPeerBaseUrl: 'https://api.thegraph.com/subgraphs/id/Qmdm8v5BfQRzoz5mPr8FrdDosMsYS5kh8ctfMjK3cNqZ7W',
    nftfyFracBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmcqHCqjnRbWp4oMPWtrCq9MLHXjeJ3z1kbuy2y4EPFhG3',
    nftfy2FracBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmX32DAVtGKbym8Zr5ERHyaoSo86KV4eVPBoeKYrjPxBwy',
    nftfyTokenAddress: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
    nftfyTokenDecimals: 18,
    nftfyAddress: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
    nftfyAuctionAddress: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
    stableCoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    stableCoinDecimals: 18,
    blacklist: {
      contractAddresses: [
        '0x0622c046f185bdaec9d615fe458526423c1712fc',
        '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
        '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28'
      ],
      tokenIdList: []
    },
    farms: {
      busdNftfy: '0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3',
      busdNftfyErc20: '0xFa901CEF85f2C3A3F4FcBFe34904b8Da0f5Fc04e',
      bnbNftfy: '0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3',
      bnbNftfyErc20: '0xE4bA58268a64E93Fc29295308178816e774879f0',
      wethNftfy: '0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB',
      wethNftfyErc20: '0xd618f2990F69E73ac48115E79c029705F41aa994',
      daiNftfy: '0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB',
      daiNftfyErc20: '0x63E4c1d480a373F2d66c68c1A1a406Bd7C60A73e'
    },
    erc721Addresses: [],
    cryptokitties: {
      apiUrl: 'https://public.api.cryptokitties.co/v1',
      xApiToken: 'y21Z9U63U7YhJgaofcsgc_Plm6w5KDkMvdTICcZ19AE',
      contractAddress: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
      symbol: 'CK'
    },
    balancer: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
      subgraphBackupUrl: 'https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange/pools',
      eth: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      precision: 6,
      addresses: {
        bFactory: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
        bActions: '0xde4A25A0b9589689945d842c5ba0CF4f0D4eB3ac',
        dsProxyRegistry: '0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4',
        exchangeProxy: '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21',
        weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'
      },
      poolsUrl: 'https://pools.balancer.exchange/'
    },
    ens: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
      contractAddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      symbol: 'ENS'
    },
    decentraland: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
      ens: {
        contractAddress: '0x2a187453064356c898cae034eaed119e1663acb8',
        symbol: 'ENS'
      },
      parcel: {
        contractAddress: '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
        symbol: 'LAND'
      },
      estate: {
        contractAddress: '0x959e104E1a4dB6317fA58F8295F586e1A978c297',
        symbol: 'EST'
      }
    },
    box: {
      subgraphUrl: 'https://api.thegraph.com/subgraphs/id/QmXBX2oBntKD9oF2fiR4EcjCctPdnGH7zL1bhC27sLauCS',
      contractAddress: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      symbol: 'BOX'
    },
    pools: {
      managementUrl: 'https://pools.balancer.exchange/#/pool',
      createUrl: 'https://pools.balancer.exchange/#/',
      chartColors: ['#FF7070', '#FFB1AD', '#FF7470', '#FF5463', '#FF99AA', '#595B5F', '#8C8F95', '#AAADB3', '#C4C8CD', '#D9DEE2'],
      main: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
      lbp: ['0x6b175474e89094c44da98b954eedeac495271d0f'],
      fundsBpt: []
    },
    assets: [
      '0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e',
      '0x49f2beff98ce62999792ec98d0ee4ad790e7786f',
      '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
      '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
      '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
      '0xad32a8e6220741182940c5abf610bde99e737b2d',
      '0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b',
      '0x5bc25f649fc4e26069ddf4cf4010f9f706c23831',
      '0x20945ca1df56d237fd40036d47e866c7dccd2114',
      '0x705c71b262c511b66baa4791cc2be61b971bd784',
      '0x3d7753c4526f8657e383a46dc41ec97414941a80',
      '0x261efcdd24cea98652b9700800a13dfbca4103ff',
      '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
      '0x51a2310b37ead1d8f8fe01b89b4cd68fa58992d0',
      '0xe59064a8185ed1fca1d17999621efedfab4425c9',
      '0xa0afaa285ce85974c3c881256cb7f225e3a1178a',
      '0x6c2cf58e468b64b604407c6ea89c5868ed13c252',
      '0x80dc468671316e50d4e9023d3db38d3105c1c146',
      '0x704de5696df237c5b9ba0de9ba7e0c63da8ea0df',
      '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
      '0x7f1f2d3dfa99678675ece1c243d3f7bc3746db5d',
      '0x30cf203b48edaa42c3b4918e955fed26cd012a3f',
      '0x34a01c0a95b0592cc818cd846c3cf285d6c85a31',
      '0x64010f6ba757715d8f12d8317004425d73ca5a81',
      '0xe4f726adc8e89c6a6017f01eada77865db22da14',
      '0xc69a0ae4961b8bac945d854e1057117e575fe005',
      '0xac2c198f3103ee19bab07530f2bc2c2ae88f2cb5',
      '0xffffffff2ba8f66d4e51811c5190992176930278',
      '0xf2092e49701ddefdec82d518d8d34345302d1b43',
      '0x6fcb6408499a7c0f242e32d77eb51ffa1dd28a7e',
      '0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd',
      '0x875773784af8135ea0ef43b5a374aad105c5d39e',
      '0x41a08648c3766f9f9d85598ff102a08f4ef84f84',
      '0x859e4d219e83204a2ea389dac11048cc880b6aa8',
      '0xf5581dfefd8fb0e4aec526be659cfab1f8c781da',
      '0x8cacf4c0f660efdc3fd2e2266e86a9f57f794198',
      '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
      '0x9dc54c3633ba36e9c0205ee27584eb589ea96421',
      '0x59e9261255644c411afdd00bd89162d09d862e38',
      '0x31c8eacbffdd875c74b94b077895bd78cf1e64a3',
      '0x750dd34fb165be682fae445793ab9ab9729cdaa3',
      '0x67b6d479c7bb412c54e03dca8e1bc6740ce6b99c',
      '0x2ed30c582c7faf644f291db9eecdc5641057233e',
      '0x06745bee20ad9cc7dfb6f40b66504397235f547c',
      '0xfb5453340c03db5ade474b27e68b6a9c6b2823eb',
      '0x75a38f0d99eb3e4b18246febebb77b16cf95d754',
      '0x08d8fa18af801224719b90327670ab1145e24ba6',
      '0xf938424f7210f31df2aee3011291b658f872e91e',
      '0x945facb997494cc2570096c74b5f66a3507330a1',
      '0x544c42fbb96b39b21df61cf322b5edc285ee7429',
      '0xcbfef8fdd706cde6f208460f2bf39aa9c785f05d',
      '0xa06849c61e0919785661acb7fe3bcbd4500f6c2e',
      '0x27cf76c51309929c6c09659b43b026c1ab649516',
      '0xf675243988d10f9de458df019a501b64245e4eda',
      '0xbc4171f45ef0ef66e76f979df021a34b46dcc81d',
      '0xb8e57e2eff4b9c1ee413c7b24b1f52d83e16488c',
      '0xe4cfe9eaa8cdb0942a80b7bc68fd8ab0f6d44903',
      '0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429',
      '0x5a04a6246f2ce98230f5409bc11ccb0183929d02',
      '0x29cbd0510eec0327992cd6006e63f9fa8e7f33b7',
      '0x61b6325d72aa40aea68ef8a1e09055697b5b8d83',
      '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
      '0xf657666c7823c68dcca168c4c1c9a28d9d04ec29'
    ],
    bridge: {
      panel: '0x9A64c1e500ED64CB012290A3868F36D33bb85F7e',
      trustedBridge: '0xFD332f27B72d2730BF0B34A7dD3e51c9FB902cd0',
      networks: {
        ethereum: {
          chainId: 1,
          name: 'Ethereum Network',
          address: '0x41f455283d6230A4eE83aE7216FfFb527bBd862A',
          operator: '0xF9a7c456341fAFc861909c2FF17C8c6366234f2F',
          vault: '0x09567066a42c087218053525Fb2fB19A0bA78A6f',
          multisig: '0xc718E5a5b06ce7FEd722B128C0C0Eb9c5c902D92'
        },
        bsc: {
          chainId: 56,
          name: 'Binance Smart Chain Network (BEP20)',
          address: '0x41f455283d6230A4eE83aE7216FfFb527bBd862A',
          operator: '0xF9a7c456341fAFc861909c2FF17C8c6366234f2F',
          vault: '0x09567066a42c087218053525Fb2fB19A0bA78A6f',
          multisig: '0x4e9cA8ca6A113FC3Db72677aa04C8DE028618377'
        }
      }
    },
    erc20List: [
      {
        id: '1',
        name: 'ZakaBankToken',
        symbol: 'Zaka',
        address: '0x5171ABF707722E3f56b9002a58414E28eeF226c4',
        balance: '0',
        decimals: 18,
        imageUrl: ''
      },
      {
        id: '2',
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0x70cdfb73f78c51bf8a77b36c911d1f8c305d48e6',
        balance: '0',
        decimals: 6,
        imageUrl: ''
      }
    ]
  }
]

/**
 * @deprecated Deprecated in favor of chainConfigV2
 */
export const getChainConfigById = (id: number): ChainConfig => chainsConfig.find(chain => chain.id === id) || chainsConfig[0]
