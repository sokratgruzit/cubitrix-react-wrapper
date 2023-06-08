import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

export const useConnect = (props) => {
  let { activate, account, library, deactivate, chainId } = useWeb3React();

  const [connectionLoading, setConnectionLoading] = useState(false); // Should disable connect button while connecting to MetaMask
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);

  // function for metamask eagerly connect. needs access to injected
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

  // try eagerly connect after refresh for wallet connect
  useEffect(() => {
    if (providerType === "walletConnect") {
      if (isConnected) {
        // brute force solution
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
    // eslint-disable-next-line
  }, []);

  // mirror account data values in redux
  useEffect(() => {
    dispatch({
      type: "UPDATE_STATE",
      account: account ? account : "",
      chainId: chainId ? chainId : "",
    });
  }, [account, chainId, dispatch]);

  //handle wallet connect eagerly popup
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
    // eslint-disable-next-line
  }, [tried, account]);

  // Connect to wallet
  const connect = async (providerType, injected) => {
    setConnectionLoading(true);
    if (typeof window.ethereum === "undefined" && providerType === "metaMask") {
      return setError("no metamask");
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
          if (e.toString().startsWith("UnsupportedChainIdError"))
            setError("Please switch your network in wallet");
        });

      setConnectionLoading(false);
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    try {
      deactivate();
      dispatch({
        type: "UPDATE_STATE",
        account: "",
        providerType: "",
      });
    } catch (error) {
      console.log("Error on disconnnect: ", error);
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
      error,
      setError,
      MetaMaskEagerlyConnect,
    }),
    // eslint-disable-next-line
    [account, connectionLoading, providerType, chainId, error],
  );

  return values;
};
