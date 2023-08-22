import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const useConnect = (props) => {
  let { activate, account, library, deactivate, chainId, active, error, connector } =
    useWeb3React();

  const [connectionLoading, setConnectionLoading] = useState(false);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);

  async function MetaMaskEagerlyConnect(injected, callback) {
    if (providerType === "metaMask") {
      try {
        injected
          .isAuthorized()
          .then((isAuthorized) => {
            if (isAuthorized && isConnected) {
              connect(providerType, injected);
            } else {
              dispatch({
                type: "UPDATE_STATE",
                account: "",
                isConnected: false,
                providerType: "",
              });
              dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
            }
          })
          .finally(() => {
            if (callback) {
              callback();
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function WalletConnectEagerly(walletConnect, callback) {
    if (providerType === "walletConnect") {
      try {
        if (isConnected) {
          setTimeout(() => {
            connect(providerType, walletConnect);
          }, 0);
        } else {
          dispatch({
            type: "UPDATE_STATE",
            account: "",
            isConnected: false,
            providerType: "",
          });
          dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const switchToBscTestnet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x61", // ChainID for the Binance Smart Chain Testnet
              chainName: "BSC Testnet",
              nativeCurrency: {
                name: "tBNB",
                symbol: "tBNB",
                decimals: 18,
              },
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
              blockExplorerUrls: ["https://testnet.bscscan.com"],
            },
          ],
        });
        dispatch({
          type: "CONNECTION_ERROR",
          payload: "",
        });
      } else {
        console.log("Can't setup the BSC Testnet on BSC network");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async (providerType, injected) => {
    if (typeof window.ethereum === "undefined" && providerType === "metaMask") {
      dispatch({
        type: "CONNECTION_ERROR",
        payload: "No MetaMask detected",
      });
      return;
    }
    if (providerType === "metaMask") {
      setConnectionLoading(true);
    }

    if (active) {
      await disconnect();
    }

    try {
      new Promise((resolve, reject) => {
        activate(injected, undefined, true).then(resolve).catch(reject);
      })
        .then(() => {
          dispatch({
            type: "UPDATE_STATE",
            isConnected: true,
            providerType,
          });
        })
        .catch((e) => {
          dispatch({ type: "UPDATE_STATE", account: "", isConnected: false });

          if (
            e.toString().startsWith("UnsupportedChainIdError") ||
            e.toString().startsWith("t: Unsupported chain id")
          ) {
            dispatch({
              type: "CONNECTION_ERROR",
              payload: "Please switch your network in wallet",
            });
            if (injected instanceof WalletConnectConnector) {
              injected.walletConnectProvider = undefined;
            }
          }
          console.log(e);
        })
        .finally(() => {
          setTimeout(() => {
            dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
          }, 500);
          setConnectionLoading(false);
        });
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  async function disconnect() {
    try {
      if (library && library.provider && library.provider.close) {
        await library.provider.close();
      }
      deactivate();
      dispatch({
        type: "UPDATE_STATE",
        account: "",
        providerType: "",
      });
    } catch (error) {
      console.log("Error on disconnect: ", error);
    }
  }

  const values = useMemo(
    () => ({
      account: account ?? "",
      active,
      connect,
      disconnect,
      library,
      connectionLoading,
      chainId,
      MetaMaskEagerlyConnect,
      WalletConnectEagerly,
      switchToBscTestnet,
    }),
    [account, active, connectionLoading, chainId, library],
  );

  return values;
};
