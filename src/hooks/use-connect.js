import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import axios from "../api/axios";

const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } = useWeb3React();

  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask

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
            account,
            chainId,
          });
          // automatically send request for login
          const fetchData = async () => {
            await axios
              .post("/accounts/login", {
                address: account,
                balance: +res,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err.message);
              });
          };
          fetchData();
        });
      };
      fetchData();
    } else {
      dispatch({ type: "UPDATE_STATE", account: "", chainId, balance: 0 });
    }
  }, [library, dispatch, account, chainId]);

  // check if user has connected before and try to reconnect. persists user login state across refreshes.
  useEffect(() => {
    async function fetchData() {
      if (isConnected) {
        connect(providerType);
      }
    }
    fetchData();
  }, []);

  // watch user active status and save it in global store for persist.
  useEffect(() => {
    dispatch({
      type: "UPDATE_STATE",
      isConnected: active,
    });
  }, [active, dispatch]);

  // console.log(useSelector((state) => state.connect));

  // Connect to wallet
  const connect = async (providerType) => {
    setShouldDisable(true);
    try {
      if (providerType === "metaMask") {
        activate(injected, undefined, true).catch(() => {
          console.log("Please switch your network in wallet");
        });
        setShouldDisable(false);
        dispatch({
          type: "CONNECT",
          payload: {
            providerType: "metaMask",
            isConnected: true,
          },
        });
      } else if (providerType === "walletConnect") {
        activate(walletConnect, undefined, true).catch(() => {
          console.log("Please switch your network in wallet");
        });
        setShouldDisable(false);
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

export default useConnect;
