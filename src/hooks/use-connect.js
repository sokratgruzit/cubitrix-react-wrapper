import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import axios from "../api/axios";

export const useConnect = (props) => {
  let { activate, account, library, deactivate, chainId } = useWeb3React();

  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);

  if (typeof window.ethereum === "undefined") setError("no metamask");

  useEffect(() => {
    console.log("runs");
    console.log(props);
  }, []);

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
    }
  }, [dispatch, account, chainId]);

  // try eagerly connect after refresh for wallet connect and metamask
  useEffect(() => {
    if (providerType === "metaMask") {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized && isConnected) {
          connect(providerType);
        } else {
          dispatch({
            type: "UPDATE_STATE",
            account: "",
            isConnected: false,
          });
        }
      });
    }
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
  }, [tried, account]);

  // Connect to wallet
  const connect = async (providerType) => {
    setShouldDisable(true);
    try {
      await activate(
        providerType === "metaMask" ? injected : walletConnect,
        undefined,
        true,
      )
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

          setShouldDisable(false);
        });

      setShouldDisable(false);
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
      error,
      setError,
    }),
    [account, shouldDisable, providerType, chainId, error],
  );

  return values;
};
