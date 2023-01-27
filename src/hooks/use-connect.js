import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import axios from "../api/axios";

export const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } = useWeb3React();

  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);
  const savedAccount = useSelector((state) => state.connect.account);

  if (window.ethereum === undefined) console.log("error");

  //check if you are connected to an account on supported chain.
  useEffect(() => {
    if (account && chainId) {
      const fetchData = async () => {
        await axios
          .post("/accounts/login", {
            address: account,
          })
          .then((res) => {})
          .catch((err) => {});
      };
      fetchData();
    } else {
      dispatch({
        type: "UPDATE_STATE",
        account: "",
      });
    }
  }, [dispatch, account, chainId]);

  useEffect(() => {
    if (isConnected) {
      async function fetchData() {
        if (providerType === "metaMask" || providerType === "walletConnect") {
          connect(providerType);
          setShouldDisable(true);
        }
      }
      fetchData();
      //return () => deactivate();
    } else {
      dispatch({
        type: "UPDATE_STATE",
        account: "",
        isConnected: false,
      });
    }
  }, [account, dispatch, isConnected, providerType]);

  // Connect to wallet
  const connect = async (providerType) => {
    setShouldDisable(true);
    try {
      if (providerType === "metaMask") {
        await activate(injected, undefined, true)
          .then(() => {
            dispatch({
              type: "UPDATE_STATE",
              account: account ? account : savedAccount,
              isConnected: true,
              providerType: "metaMask",
            });
          })
          .catch(() => {
            dispatch({ type: "UPDATE_STATE", account: "" });
            console.log("Please switch your network in wallet");
            setShouldDisable(false);
          });

        setShouldDisable(false);
      } else if (providerType === "walletConnect") {
        await activate(walletConnect, undefined, true)
          .then(() => {
            dispatch({
              type: "UPDATE_STATE",
              account: account ? account : savedAccount,
              isConnected: true,
              providerType: "walletConnect",
            });
          })
          .catch(() => {
            dispatch({ type: "UPDATE_STATE", account: "" });
            console.log("Please switch your network in wallet");
            setShouldDisable(false);
          });

        setShouldDisable(false);
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
