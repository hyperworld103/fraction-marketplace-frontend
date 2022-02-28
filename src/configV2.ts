interface FarmConfig {
  rightChainId: number
  name: string
  contract: string
  contractErc20: string
  contractUrl: string
  contractErc20Url: string
  contractPosition: number
  blockTime: number
}
export interface GlobalConfigV2 {
  nftfyTokenAddress: string
  paginationLimit: number
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
  }
  farms: {
    busdNftfy: FarmConfig
    bnbNftfy: FarmConfig
    wethNftfy: FarmConfig
    daiNftfy: FarmConfig
  }
}

export const globalConfig: GlobalConfigV2 = {
  nftfyTokenAddress: '0xBf6Ff49FfD3d104302Ef0AB0F10f5a84324c091c',
  paginationLimit: 8,
  firebase: {
    apiKey: 'AIzaSyDC95EC2q7eI8LZd2ivYMZJEO7f6wq3pwk',
    authDomain: 'nftfy-nft-metadata.firebaseapp.com',
    projectId: 'nftfy-nft-metadata',
    storageBucket: 'nftfy-nft-metadata.appspot.com',
    messagingSenderId: '1060679471393',
    appId: '1:1060679471393:web:9626348a8a336e88d86e60'
  },
  farms: {
    busdNftfy: {
      rightChainId: 56,
      name: 'BUSD-NFTFY',
      contract: '0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3',
      contractErc20: '0xFa901CEF85f2C3A3F4FcBFe34904b8Da0f5Fc04e',
      contractUrl: 'https://bscscan.com/address/0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3#readContract',
      contractErc20Url:
        'https://exchange.pancakeswap.finance/#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56/0xbf6ff49ffd3d104302ef0ab0f10f5a84324c091c',
      contractPosition: 0,
      blockTime: 3
    },
    bnbNftfy: {
      rightChainId: 56,
      name: 'BNB-NFTFY',
      contract: '0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3',
      contractErc20: '0xE4bA58268a64E93Fc29295308178816e774879f0',
      contractUrl: 'https://bscscan.com/address/0x8780421e5D37C3E2dFcb7Db3FB4e9e4A6D2aB1A3#readContract',
      contractErc20Url: 'https://exchange.pancakeswap.finance/#/add/BNB/0xbf6ff49ffd3d104302ef0ab0f10f5a84324c091c',
      contractPosition: 1,
      blockTime: 3
    },
    wethNftfy: {
      rightChainId: 1,
      name: 'WETH-NFTFY',
      contract: '0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB',
      contractErc20: '0xd618f2990F69E73ac48115E79c029705F41aa994',
      contractUrl: 'https://etherscan.io/address/0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB#readContract',
      contractErc20Url: 'https://pools.balancer.exchange/#/pool/0xd618f2990f69e73ac48115e79c029705f41aa994/',
      contractPosition: 0,
      blockTime: 13
    },
    daiNftfy: {
      rightChainId: 1,
      name: 'DAI-NFTFY',
      contract: '0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB',
      contractErc20: '0x63E4c1d480a373F2d66c68c1A1a406Bd7C60A73e',
      contractUrl: 'https://etherscan.io/address/0x9Df6e60c1fB5266f453E683d9C9487DBFd720ffB#readContract',
      contractErc20Url: 'https://pools.balancer.exchange/#/pool/0x63e4c1d480a373f2d66c68c1a1a406bd7c60a73e/',
      contractPosition: 1,
      blockTime: 13
    }
  }
}

interface ChainConfigV2 {
  chainId: number
  name: string
  networkTokenAddress: string
  networkTokenSymbol: string
  fracionalizerV1: {
    contract: string | null
    theGraph: string | null
  }
  fracionalizerV1_1: {
    contract: string | null
    theGraph: string | null
  }
  fracionalizerV1_2: {
    contractFixedPrice: string | null
    contractAuction: string | null
    theGraph: string | null
  }
  collectiveBuy: {
    contract: string | null
    thegraph: string | null
  }
  marketplaceBlacklist: string[]
}

const chainsConfig: ChainConfigV2[] = [
  {
    chainId: 1,
    name: 'mainnet',
    networkTokenAddress: '0x0000000000000000000000000000000000000000',
    networkTokenSymbol: 'ETH',
    fracionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph: 'https://api.thegraph.com/subgraphs/id/QmcqHCqjnRbWp4oMPWtrCq9MLHXjeJ3z1kbuy2y4EPFhG3'
    },
    fracionalizerV1_1: {
      contract: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      theGraph: 'https://api.thegraph.com/subgraphs/id/QmbLVzofmauPUAEgMWzk8x9G48zpvim3FcYme83APD9dAX'
    },
    fracionalizerV1_2: {
      contractFixedPrice: null,
      contractAuction: null,
      theGraph: null
    },
    collectiveBuy: {
      contract: null,
      thegraph: null
    },
    marketplaceBlacklist: [
      '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28',
      '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
      '0x0622c046f185bdaec9d615fe458526423c1712fc'
    ]
  },
  {
    chainId: 3,
    name: 'ropsten',
    networkTokenAddress: '0x0000000000000000000000000000000000000000',
    networkTokenSymbol: 'ETH',
    fracionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph: 'https://api.thegraph.com/subgraphs/id/QmcqHCqjnRbWp4oMPWtrCq9MLHXjeJ3z1kbuy2y4EPFhG3'
    },
    fracionalizerV1_1: {
      contract: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      theGraph: 'https://api.thegraph.com/subgraphs/id/QmbLVzofmauPUAEgMWzk8x9G48zpvim3FcYme83APD9dAX'
    },
    fracionalizerV1_2: {
      contractFixedPrice: null,
      contractAuction: null,
      theGraph: null
    },
    collectiveBuy: {
      contract: null,
      thegraph: null
    },
    marketplaceBlacklist: [
      '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28',
      '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
      '0x0622c046f185bdaec9d615fe458526423c1712fc'
    ]
  }
]

export const chainConfig = (id: number): ChainConfigV2 | undefined => chainsConfig.find(chain => chain.chainId === id)
