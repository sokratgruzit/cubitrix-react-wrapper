import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import axios from "../api/axios";

export const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } = useWeb3React();

  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [tried, setTried] = useState(false);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);

  if (window.ethereum === undefined) console.log("error");

  //check if you are connected to an account on supported chain. If so get a balance and set info in global state. else set default info.

  useEffect(() => {
    if (library && account && chainId) {
      const fetchData = async () => {
        library.eth.getBalance(account).then(async (res) => {
          dispatch({
            type: "UPDATE_STATE",
            balance: +res,
            chainId,
          });
          // automatically send request for login
          const postData = async () => {
            await axios
              .post("/accounts/login", {
                address: account,
                balance: +res,
              })
              .then((res) => {})
              .catch((err) => {});
          };
          postData();
        });
      };
      fetchData();
    } else {
      dispatch({
        type: "UPDATE_STATE",
        account: "",
        balance: 0,
      });
    }
  }, [library, dispatch, account, chainId]);

  // check if user has connected before and try to reconnect. persists user login state across refreshes.

  // useEffect(() => {
  //   if (isConnected && !tried) {
  //     async function fetchData() {
  //       connect(providerType);
  //       console.log("try connect once only this");
  //       setShouldDisable(true);
  //       setTried(true);
  //     }
  //     fetchData();
  //   } else {
  //     dispatch({
  //       type: "UPDATE_STATE",
  //       account: account ? account : "",
  //       isConnected: account ? true : false,
  //     });
  //   }
  // }, [account, dispatch, tried, isConnected]);

  useEffect(() => {
    if (isConnected && !tried) {
      async function fetchData() {
        if (providerType === "metaMask" || providerType === "walletConnect") {
          connect(providerType);
          setShouldDisable(true);
          setTried(true);
        }
      }
      fetchData();
      return () => deactivate();
    } else {
      dispatch({
        type: "UPDATE_STATE",
        account: account ? account : "",
        isConnected: account ? true : false,
      });
    }
  }, [account, dispatch, tried, isConnected, providerType]);

  // watch user active status and save it in global store for persist.
  // useEffect(() => {
  //   dispatch({
  //     type: "UPDATE_STATE",
  //     isConnected: active,
  //   });
  // }, [active, dispatch, account]);

  // Connect to wallet
  const connect = async (providerType) => {
    setShouldDisable(true);
    try {
      if (providerType === "metaMask") {
        activate(injected, undefined, true).catch(() => {
          dispatch({ type: "UPDATE_STATE", account: "", balance: 0 });
          console.log("Please switch your network in wallet");
          setShouldDisable(false);
          setTried(true);
        });
        setShouldDisable(false);
        setTried(true);

        dispatch({
          type: "CONNECT",
          payload: {
            providerType: "metaMask",
            isConnected: true,
          },
        });
      } else if (providerType === "walletConnect") {
        activate(walletConnect, undefined, true).catch(() => {
          dispatch({ type: "UPDATE_STATE", account: "", balance: 0 });
          console.log("Please switch your network in wallet");
          setShouldDisable(false);
          setTried(true);
        });
        setShouldDisable(false);
        setTried(true);

        dispatch({
          type: "CONNECT",
          payload: {
            providerType: "walletConnect",
            isConnected: true,
          },
        });
      }
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
      shouldDisable,
      providerType,
      chainId,
    }),
    [account, shouldDisable, providerType, chainId],
  );

  return values;
};
