import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";

const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } = useWeb3React();

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const isConnected = useSelector((state) => state.connect.isConnected);

  const providerType = useSelector((state) => state.connect.providerType);

  // Init Loading

  useEffect(() => {
    if (library) {
      library.eth.getBalance(account).then((res) => {
        dispatch({
          type: "GET_BALANCE",
          balance: res,
        });
      });
    }
  }, [library, account, dispatch]);

  useEffect(() => {
    console.log(chainId, injected.supportedChainIds);
    if (account && injected.supportedChainIds.includes(chainId)) {
      dispatch({
        type: "CONNECT",
        payload: {
          isConnected: true,
        },
      });
    } else {
      dispatch({
        type: "CONNECT",
        payload: {
          isConnected: false,
        },
      });
    }
  }, [account, dispatch]);

  useEffect(() => {
    async function fetchData() {
      if (isConnected) {
        await connect(providerType).then((val) => {
          setIsLoading(false);
        });
      }
    }
    fetchData();
  }, []);

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  //when disconnected from Metamask update state
  useEffect(() => {
    if (!isActive) {
      dispatch({
        type: "CONNECT",
        payload: {
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
        await activate(injected, () => {
          console.log("chainID not supported");
        });
        setShouldDisable(false);
        dispatch({
          type: "CONNECT",
          payload: {
            providerType: "metaMask",
          },
        });
      } else if (providerType === "walletConnect") {
        activate(walletConnect).then(() => {
          setShouldDisable(false);
          dispatch({
            type: "CONNECT",
            payload: {
              providerType: "walletConnect",
            },
          });
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
        type: "CONNECT",
        payload: {
          providerType: "",
        },
      });

      dispatch({
        type: "GET_BALANCE",
        balance: 0,
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
      connect,
      disconnect,
      library,
      shouldDisable,
      providerType,
      chainId,
    }),
    [isActive, isLoading, shouldDisable, account, providerType, chainId],
  );

  return values;
};

export default useConnect;
