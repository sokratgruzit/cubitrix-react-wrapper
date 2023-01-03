import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";

const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } =
    useWeb3React();

  const [isActive, setIsActive] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const isConnected = useSelector(state => state.connect.isConnected);
  const providerType = useSelector(state => state.connect.providerType);

  // Init Loading
  useEffect(() => {
    async function fetchData() {
      if (isConnected) {
        connect(providerType).then(() => {
          setIsLoading(false);
        });

        library?.eth.getBalance(account).then(res => {
          dispatch({
            type: "GET_BALANCE",
            balance: res
          });

          dispatch({
            type: "GET_ACCOUNT",
            account: account
          });
        });
      }
    }
    fetchData();
  }, []);

  const handleWalletModal = async (state) => {
    console.log("state ===>" + state);
    setWalletModal(state);
    dispatch({
      type: "TOGGLE_WALLET_CONNECT_MODAL",
      walletModal: state,
    });
  };

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  console.log(useSelector(state => state.connect))

  //when disconnected from Metamask update state
  useEffect(() => {
    if (!isActive) {
      dispatch({
        type: "CONNECT",
        payload: {
          isConnected: false,
          providerType: "",
        },
      });
    }
  }, [isActive]);

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

      await library?.eth.getBalance(account).then(res => {
        dispatch({
          type: "GET_BALANCE",
          balance: res
        });
      });

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
        type: "CONNECT",
        payload: {
          isConnected: false,
          providerType: "",
        },
      });

      dispatch({
        type: "GET_ACCOUNT",
        account: ""
      });

      dispatch({
        type: "GET_BALANCE",
        balance: 0
      });
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  };

  const values = useMemo(
    () => ({
      isActive,
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
    [isActive, isLoading, shouldDisable, account, walletModal, providerType, chainId],
  );

  return values;
};

export default useConnect;
