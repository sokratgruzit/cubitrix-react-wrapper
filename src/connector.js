import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [97],
});

export const walletConnect = new WalletConnectConnector({
  rpc: {
    // 1: "https://eth.rpc.blxrbdn.com",
    // 4: "https://rinkeby.infura.io/v3/cbf4ab3d4878468f9bbb6ff7d761b985",
    // 97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    97: "https://data-seed-prebsc-2-s1.binance.org:8545/",
    // 2122: "https://testnet-rpc.coremultichain.net",
  },
  chainId: 97,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});
