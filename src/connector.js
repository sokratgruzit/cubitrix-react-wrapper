import {InjectedConnector} from "@web3-react/injected-connector";

import {WalletConnectV2Connector} from "./utils/walletconnectV2Connector";
import {decryptEnv} from "./utils/decryptEnv";

const projectId = decryptEnv(process.env.REACT_APP_INFURA_PROJECT_ID_V3);

export const injected = new InjectedConnector({
  supportedChainIds: [97],
});

export const walletConnect = new WalletConnectV2Connector({
  projectId,
  showQrModal: true,
  chains: [97],
  rpcMap: {
    97: process.env.REACT_APP_WEB3_PROVIDER_URL,
  },
});
