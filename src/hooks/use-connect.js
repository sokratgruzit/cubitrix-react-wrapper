import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

export const useConnect = (props) => {
  let { activate, account, library, deactivate, chainId } = useWeb3React();

  const [connectionLoading, setConnectionLoading] = useState(false);
  const [tried, setTried] = useState(false);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);

  const MetaMaskEagerlyConnect = (injected, callback) => {
    if (providerType === "metaMask") {
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
            });
          }
        })
        .finally(() => {
          if (callback) {
            callback();
          }
        });
    }
  };

  useEffect(() => {
    if (providerType === "walletConnect") {
      if (isConnected) {
        setTimeout(() => {
          connect(providerType);
        }, 0);
      } else {
        dispatch({
          type: "UPDATE_STATE",
          account: "",
          isConnected: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: "UPDATE_STATE",
      account: account ? account : "",
      chainId: chainId ? chainId : "",
    });
  }, [account, chainId, dispatch]);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (tried && !account) {
      dispatch({
        type: "UPDATE_STATE",
        account: "",
        isConnected: false,
      });
    }
  }, [tried, account]);

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
                name: "BNB",
                symbol: "bnb",
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
    try {
      await activate(injected, undefined, true)
        .then(() => {
          dispatch({
            type: "UPDATE_STATE",
            isConnected: true,
            providerType,
          });
          setTried(true);
        })
        .catch((e) => {
          dispatch({ type: "UPDATE_STATE", account: "", isConnected: false });
          if (e.toString().startsWith("UnsupportedChainIdError")) {
            dispatch({
              type: "CONNECTION_ERROR",
              payload: "Please switch your network in wallet",
            });
          }
        });
      setConnectionLoading(false);
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  const disconnect = async () => {
    try {
      deactivate();
      dispatch({
        type: "UPDATE_STATE",
        account: "",
        providerType: "",
      });
    } catch (error) {
      console.log("Error on disconnect: ", error);
    }
  };

  const values = useMemo(
    () => ({
      account,
      connect,
      disconnect,
      library,
      connectionLoading,
      providerType,
      chainId,
      MetaMaskEagerlyConnect,
      switchToBscTestnet,
    }),
    [account, connectionLoading, providerType, chainId, switchToBscTestnet],
  );
  return values;
};
