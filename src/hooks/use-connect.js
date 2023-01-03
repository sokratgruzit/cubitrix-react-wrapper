import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import axios from "../api/axios";

const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } = useWeb3React();

  const [walletModal, setWalletModal] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);

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
        connect(providerType).then(() => {
          setIsLoading(false);
        });
      }
    }
    fetchData();
  }, []);

  const handleWalletModal = async (state) => {
    setWalletModal(state);
    dispatch({
      type: "TOGGLE_WALLET_CONNECT_MODAL",
      walletModal: state,
    });
  };

  // Check when App is Connected or Disconnected to MetaMask

  //when disconnected from Metamask update state
  const handleIsActive = useCallback(() => {
    if (!active) {
      dispatch({
        type: "CONNECT",
        payload: {
          isConnected: false,
          providerType: "",
        },
      });
    }
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  // console.log(useSelector((state) => state.connect));

  // Connect to wallet
  const connect = async (providerType) => {
    setShouldDisable(true);
    try {
      if (providerType === "metaMask") {
        await activate(injected).then(() => {
          setShouldDisable(false);
          dispatch({
            type: "CONNECT",
            payload: {
              isConnected: true,
              providerType: "metaMask",
            },
          });
        });
      } else if (providerType === "walletConnect") {
        await activate(walletConnect).then(() => {
          setShouldDisable(false);
          dispatch({
            type: "CONNECT",
            payload: {
              isConnected: true,
              providerType: "walletConnect",
            },
          });
        });
      }

      setWalletModal(false);
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
        isConnected: false,
        providerType: "",
      });
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  };

  const values = useMemo(
    () => ({
      account,
      isLoading,
      walletModal,
      handleWalletModal,
      connect,
      disconnect,
      library,
      shouldDisable,
      providerType,
      chainId,
    }),
    [isLoading, shouldDisable, account, walletModal, providerType, chainId],
  );

  return values;
};

export default useConnect;
