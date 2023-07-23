const { AbstractConnector } = require("@web3-react/abstract-connector");

export class WalletConnectV2Connector extends AbstractConnector {
  constructor(options) {
    super({ supportedChainIds: Object.keys(options.rpcMap || {}).map((k) => Number(k)) });

    this.options = options;
  }

  static clearStorage(storage) {
    storage.removeRegExp(new RegExp("^wc@2:"));
  }

  activate = async () => {
    const module = await import("@walletconnect/ethereum-provider");
    const provider = await module.default.init({
      projectId: this.options.projectId,
      rpcMap: this.options.rpcMap || {},
      chains: this.options.chains,
      showQrModal: true,
      disableProviderPing: true,
      qrModalOptions: {
        themeVariables: {
          "--wcm-z-index": "3000",
        },
      },
      methods: ["eth_sendTransaction"],
      optionalMethods: [
        "eth_accounts",
        "eth_requestAccounts",
        "eth_sendRawTransaction",
        "eth_signTransaction",
        "wallet_switchEthereumChain",
      ],
      events: ["chainChanged", "accountsChanged"],
      optionalEvents: ["disconnect"],
    });

    const accounts = await provider.enable();

    provider.on("accountsChanged", this.handleAccountsChanged);
    provider.on("chainChanged", this.handleChainChanged);
    provider.on("disconnect", this.handleDisconnect);

    this.provider = provider;

    return {
      chainId: provider.chainId,
      account: accounts[0],
      provider,
    };
  };

  getProvider = async () => {
    if (!this.provider) {
      throw new Error("Provider is undefined");
    }
    return this.provider;
  };

  getChainId = async () => {
    if (!this.provider) {
      throw new Error("Provider is undefined");
    }
    return this.provider.chainId;
  };

  getAccount = async () => {
    if (!this.provider) {
      throw new Error("Provider is undefined");
    }
    return this.provider.accounts[0];
  };

  getWalletName = () => {
    return this.provider?.session?.peer.metadata.name;
  };

  deactivate = () => {
    if (!this.provider) {
      return;
    }
    this.emitDeactivate();

    this.provider
      .removeListener("accountsChanged", this.handleAccountsChanged)
      .removeListener("chainChanged", this.handleChainChanged)
      .removeListener("disconnect", this.handleDisconnect)
      .disconnect();
  };

  handleAccountsChanged = (accounts) => {
    this.emitUpdate({ account: accounts[0] });
  };

  handleChainChanged = (chainId) => {
    this.emitUpdate({ chainId });
  };

  handleDisconnect = () => {
    if (!this.provider) {
      throw new Error("Provider is undefined");
    }
    this.deactivate();
  };
}
