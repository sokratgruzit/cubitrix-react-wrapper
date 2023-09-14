import { InjectedConnector } from "@web3-react/injected-connector";

import { WalletConnectV2Connector } from "./utils/walletconnectV2Connector";

export const injected = new InjectedConnector({
  supportedChainIds: [97],
});

export const walletConnect = new WalletConnectV2Connector({
  projectId: process.env.REACT_APP_INFURA_PROJECT_ID_V3,
  showQrModal: true,
  chains: [97],
  rpcMap: {
    97: process.env.REACT_APP_WEB3_PROVIDER_URL,
  },
});
