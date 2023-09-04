import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Buffer } from "buffer";
import {
  ChangeNetwork,
  DashboardSharedLayout,
  Header,
  NoMetaMask,
  Popup,
  SignIn,
} from "@cubitrix/cubitrix-react-ui-module";

import Dashboard from "./components/Dashboard";
import Trade from "./components/Trade";
import Loan from "./components/Loan";
import Referral from "./components/Referral";
import Staking from "./components/Staking";
import CreateAccount from "./components/CreateAccount";
import Extensions from "./components/Extensions";
import ExtensionItem from "./components/ExtensionItem";
import Transactions from "./components/Transactions";
import SideBar from "./components/Layouts/SideBar/SideBar";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import Test from "./components/test";
import TopUp from "./components/TopUp/TopUp";
import Success from "./components/Deposit/Success";
import Cancel from "./components/Deposit/Cancel";
import Landing from "./components/Landing";
import LandingRegistration from "./components/LandingRegistration";
import ResetPassword from "./components/ResetPassword/ResetPassword";

import { useConnect } from "@cubitrix/cubitrix-react-connect-module";
import axios from "./api/axios";
import { Logo } from "./assets/svg";
import { injected, walletConnect } from "./connector";
import WBNB from "./abi/WBNB.json";
// import { useStake } from "@cubitrix/cubitrix-react-connect-module";
import { useStake } from "./hooks/use-stake";
import { toast, ToastContainer } from "react-toastify";

import "./App.css";
import "@cubitrix/cubitrix-react-ui-module/src/assets/css/main-theme.css";
import "react-toastify/dist/ReactToastify.css";

window.Buffer = window.Buffer || Buffer;

function App() {
  const Router = "0xd472C9aFa90046d42c00586265A3F62745c927c0";
  const tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb";
  const links = [
    {
      to: "/dashboard",
      label: "Accounts",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.45 13.64V14.64C21.45 14.7709 21.3987 14.8966 21.3071 14.9901C21.2155 15.0836 21.0909 15.1374 20.96 15.14H19.5C18.97 15.14 18.49 14.75 18.45 14.23C18.42 13.92 18.54 13.63 18.74 13.43C18.8305 13.3363 18.9394 13.2621 19.0598 13.2122C19.1803 13.1623 19.3097 13.1378 19.44 13.14H20.95C21.24 13.15 21.45 13.37 21.45 13.64Z"
            fill="white"
          />
          <path
            d="M17.99 12.69C17.49 13.18 17.25 13.91 17.45 14.67C17.71 15.6 18.62 16.19 19.58 16.19H20.45C21 16.19 21.45 16.64 21.45 17.19V17.38C21.45 19.45 19.76 21.14 17.69 21.14H6.21001C4.14001 21.14 2.45001 19.45 2.45001 17.38V10.65C2.45001 9.42001 3.04001 8.33001 3.95001 7.65001C4.58001 7.17001 5.36001 6.89001 6.21001 6.89001H17.69C19.76 6.89001 21.45 8.58001 21.45 10.65V11.09C21.45 11.64 21 12.09 20.45 12.09H19.43C18.87 12.09 18.36 12.31 17.99 12.69Z"
            fill="white"
          />
          <path
            d="M16.2 4.82002C16.47 5.09002 16.24 5.51002 15.86 5.51002L8.18 5.50002C7.74 5.50002 7.51 4.96002 7.83 4.65002L9.45 3.02002C10.11 2.3666 11.0012 2.00006 11.93 2.00006C12.8588 2.00006 13.75 2.3666 14.41 3.02002L16.16 4.79002C16.17 4.80002 16.19 4.81002 16.2 4.82002Z"
            fill="#B3B3B3"
          />
        </svg>
      ),
    },
    {
      to: "/transactions",
      label: "Transaction History",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.73 19.7C7.55 18.82 8.8 18.89 9.52 19.85L10.53 21.2C11.34 22.27 12.65 22.27 13.46 21.2L14.47 19.85C15.19 18.89 16.44 18.82 17.26 19.7C19.04 21.6 20.49 20.97 20.49 18.31V7.04C20.5 3.01 19.56 2 15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.97 4.96 21.59 6.73 19.7Z"
            fill="white"
          />
          <path
            d="M16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z"
            fill="#B3B3B3"
          />
          <path
            d="M15 11.75H9C8.59 11.75 8.25 11.41 8.25 11C8.25 10.59 8.59 10.25 9 10.25H15C15.41 10.25 15.75 10.59 15.75 11C15.75 11.41 15.41 11.75 15 11.75Z"
            fill="#B3B3B3"
          />
        </svg>
      ),
    },
    {
      to: "/top-up",
      label: "Purchase",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.73 19.7C7.55 18.82 8.8 18.89 9.52 19.85L10.53 21.2C11.34 22.27 12.65 22.27 13.46 21.2L14.47 19.85C15.19 18.89 16.44 18.82 17.26 19.7C19.04 21.6 20.49 20.97 20.49 18.31V7.04C20.5 3.01 19.56 2 15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.97 4.96 21.59 6.73 19.7Z"
            fill="white"
          />
          <path
            d="M16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z"
            fill="#B3B3B3"
          />
          <path
            d="M15 11.75H9C8.59 11.75 8.25 11.41 8.25 11C8.25 10.59 8.59 10.25 9 10.25H15C15.41 10.25 15.75 10.59 15.75 11C15.75 11.41 15.41 11.75 15 11.75Z"
            fill="#B3B3B3"
          />
        </svg>
      ),
    },
  ];

  const sideBarOpen = useSelector((state) => state.appState?.sideBarOpen);
  const sideBar = useSelector((state) => state.appState?.sideBar);
  const emailVerified = useSelector((state) => state.appState?.emailVerified);
  const exts = useSelector((state) => state.extensions?.activeExtensions);
  const connectState = useSelector((state) => state.connect);
  const providerType = useSelector((state) => state.connect.providerType);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const balance = useSelector((state) => state.appState.userData?.balance);
  const { activeExtensions } = useSelector((state) => state.extensions);
  const appState = useSelector((state) => state.appState);
  const { depositAmount } = useSelector((state) => state.stake);

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [resetPasswordState, setResetPasswordState] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [signInState, setSignInState] = useState({ loading: false, error: false });
  const [procceed2fa, setProcceed2fa] = useState(false);
  const [otpState, setOtpState] = useState({ loading: false, error: false });
  const [signInAddress, setSignInAddress] = useState("");
  const [initialRegister, setInitialRegister] = useState(false);
  const [step, setStep] = useState(1);

  const { checkAllowance } = useStake({ Router, tokenAddress });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    library,
    disconnect,
    switchToBscTestnet,
    active,
    account,
    MetaMaskEagerlyConnect,
    WalletConnectEagerly,
    chainId,
    web3PersonalSign,
  } = useConnect();

  const isExtensionsLoaded = appState.isExtensionsLoaded;
  const mainAcc = appState?.userData;
  const metaAcc = appState?.userData?.meta;

  const updateState = async (callback) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: {},
    });

    await axios
      .post("/api/accounts/get_account", {})
      .then((res) => {
        let exts1 = res.data.data?.accounts?.[0].extensions;
        if (res.data.data?.accounts?.[0]?.active) {
          exts1.dashboard = "true";
        }

        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.data.accounts[0],
        });
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: exts1,
        });
        dispatch({
          type: "SET_EXTENSIONS_LOADED",
          payload: true,
        });
        dispatch({
          type: "SET_ACCOUNTS_DATA",
          payload: res.data.data.accountBalances,
        });
        if (callback) callback();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchData = async () => {
    await axios
      .post("/api/accounts/login", {
        address: account,
      })
      .then((res) => {
        if (res?.data === "success") {
          updateState();
        }
      })
      .catch((err) => {});
  };

  const handleConnect = () => {
    if (sideBarOpen) {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen },
      });
    } else {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen, sideBar: "connect" },
      });
    }
  };

  const handleNotifications = () => {
    if (sideBarOpen && sideBar !== "notifications") {
      return dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBar: "notifications" },
      });
    }

    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: !sideBarOpen, sideBar: "notifications" },
    });
  };

  async function getBalance() {
    var tokenContract = new library.eth.Contract(WBNB, tokenAddress);
    var decimals = await tokenContract.methods.decimals().call();
    var getBalance = await tokenContract.methods.balanceOf(account).call();

    var pow = 10 ** decimals;
    var balanceInEth = getBalance / pow;

    return balanceInEth;
  }

  const loginWithEmail = (show) => {
    setShowSignInModal(show);
  };

  const handleSubmitSignIn = async ({ email, password }) => {
    if (email && password) {
      setSignInState((prev) => ({ ...prev, loading: true, error: "" }));

      await axios
        .post("/api/accounts/recovery/login", {
          email,
          password,
        })
        .then((res) => {
          setSignInState((prev) => ({ ...prev, loading: false }));
          setSignInAddress(res.data.address);

          if (res.data.message === "proceed 2fa") return setProcceed2fa(true);

          updateState();
          setProcceed2fa(false);
          setShowSignInModal(false);
          dispatch({
            type: "SET_CONNECTION_TYPE",
            payload: "email",
          });
          dispatch({
            type: "SET_ACCOUNT_SIGNED",
            payload: true,
          });
          dispatch({
            type: "SET_LAST_CONNECTION_TYPE",
            payload: "email",
          });
          dispatch({
            type: "SET_SIDE_BAR",
            payload: { sideBar: "UserAccount" },
          });
          dispatch({
            type: "SET_LOGGED_WITH_EMAIL",
            payload: true,
          });
        })
        .catch((e) => {
          setSignInState((prev) => ({
            ...prev,
            loading: false,
            error: e.response?.data,
          }));
        });
    }
  };

  const validate2fa = async (token) => {
    setOtpState({ loading: true, error: "" });

    await axios
      .post("/api/accounts/otp/validate", {
        token,
        address: signInAddress,
      })
      .then((res) => {
        setOtpState({ loading: false, error: "" });
        dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });
        dispatch({
          type: "SET_ACCOUNT_SIGNED",
          payload: true,
        });
        dispatch({
          type: "SET_CONNECTION_TYPE",
          payload: "email",
        });
        dispatch({
          type: "SET_LOGGED_WITH_EMAIL",
          payload: true,
        });
        setProcceed2fa(false);
        setShowSignInModal(false);
      })
      .catch((e) => {
        setOtpState({ loading: false, error: e.response.data });
      });
  };

  const handleDataChange = (e) => {
    let error = false;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (e.target.name === "email") {
      if (e.target.value && !emailRegex.test(e.target.value)) {
        error = "Invalid email";
      }

      if (!e.target.value) {
        error = "Email is required";
      }
    }

    setSignInState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      error: error,
    }));
  };

  const handleResetPassword = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (email && !emailRegex.test(email)) {
      setResetPasswordState((prev) => ({
        ...prev,
        error: "Invalid email",
      }));
    }

    if (!email) {
      setResetPasswordState((prev) => ({
        ...prev,
        error: "Email is required",
      }));
    }

    setResetPasswordState({ loading: true, success: "", error: "" });

    axios
      .post("/api/accounts/get-reset-password-email", {
        email,
      })
      .then((res) => {
        setResetPasswordState((prev) => ({
          ...prev,
          loading: false,
          success: res.data,
        }));
      })
      .catch((e) => {
        setResetPasswordState((prev) => ({
          ...prev,
          loading: false,
          error: e?.response?.data,
        }));
      });
  };

  // handle email reconnect after refresh
  useEffect(() => {
    if (connectState?.lastConnectionType === "email") {
      updateState(() => {
        dispatch({
          type: "SET_ACCOUNT_SIGNED",
          payload: true,
        });
        dispatch({
          type: "SET_CONNECTION_TYPE",
          payload: "email",
        });
      });
    }
    // eslint-disable-next-line
  }, []);

  // handle web3 reconnect after refresh
  useEffect(() => {
    if (connectState?.lastConnectionType === "web3") {
      MetaMaskEagerlyConnect(
        injected,
        () => {
          updateState();
          dispatch({
            type: "SET_ACCOUNT_SIGNED",
            payload: true,
          });
          dispatch({
            type: "SET_CONNECTION_TYPE",
            payload: "web3",
          });
        },
        () => {
          disconnect();
        },
      );
      WalletConnectEagerly(
        walletConnect,
        () => {
          updateState();
          dispatch({
            type: "SET_ACCOUNT_SIGNED",
            payload: true,
          });
          dispatch({
            type: "SET_CONNECTION_TYPE",
            payload: "web3",
          });
        },
        () => {
          disconnect();
        },
      );

      if (!providerType) {
        dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (library && appState?.attemptSign && !appState?.connectionType) {
      web3PersonalSign(
        library,
        account,
        "I confirm that this is my address",
        handleWeb3Connection,
        () => {
          dispatch({
            type: "SET_METAMASK_CONNECT_LOADING",
            payload: false,
          });
          disconnect();
        },
      );
    }
  }, [library, appState?.attemptSign]);

  useEffect(() => {
    if (appState?.accountSigned) {
      init();
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: false },
      });
    }
  }, [appState?.accountSigned, account]);

  useEffect(() => {
    if (account && active && triedReconnect) {
      fetchData();
    }
  }, [account, active, triedReconnect]);

  const logout = () => {
    dispatch({ type: "SET_LOGOUT_WITH_EMAIL" });
    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: false },
    });
    disconnect();
    dispatch({
      type: "SET_LAST_CONNECTION_TYPE",
      payload: "",
    });
    localStorage.removeItem("walletconnect");
    axios
      .post("/api/accounts/logout", {})
      .then((res) => {
        navigate("/");
      })
      .catch((e) => {});
  };

  async function handleWeb3Connection(receivedAddress, signature) {
    axios
      .post("/api/accounts/web3Connect", {
        address: receivedAddress,
        signature,
        message: "I confirm that this is my address",
      })
      .then((res) => {
        dispatch({
          type: "SET_METAMASK_CONNECT_LOADING",
          payload: false,
        });
        updateState();
        dispatch({
          type: "SET_ACCOUNT_SIGNED",
          payload: true,
        });
        dispatch({
          type: "SET_CONNECTION_TYPE",
          payload: "web3",
        });
        dispatch({
          type: "SET_LAST_CONNECTION_TYPE",
          payload: "web3",
        });
      })
      .catch((e) => {
        dispatch({
          type: "SET_METAMASK_CONNECT_LOADING",
          payload: false,
        });
        console.log(e);
      });
  }

  useEffect(() => {
    if (
      library &&
      library.currentProvider &&
      typeof library.currentProvider.on === "function"
    ) {
      const accountsChangedCallback = (accounts) => {
        logout();
        // web3PersonalSign(
        //   library,
        //   accounts[0],
        //   "I confirm that this is my address",
        //   handleWeb3Connection,
        //   () => {
        //     dispatch({
        //       type: "SET_METAMASK_CONNECT_LOADING",
        //       payload: false,
        //     });
        //     disconnect();
        //   },
        // );
      };

      library.currentProvider.on("accountsChanged", accountsChangedCallback);
      return () => {
        if (typeof library.currentProvider.removeListener === "function") {
          library.currentProvider.removeListener(
            "accountsChanged",
            accountsChangedCallback,
          );
        }
      };
    }
  }, [library]);

  useEffect(() => {
    if (chainId && chainId !== 97) {
      localStorage.removeItem("walletconnect");

      dispatch({
        type: "CONNECTION_ERROR",
        payload: "Please switch your network in wallet",
      });
    }
  }, [chainId]);

  useEffect(() => {
    if (appState?.accountSigned && library) {
      checkAllowance();
    }
  }, [appState?.accountSigned, library]);

  useEffect(() => {
    if (appState?.connectionType !== "email") {
      if (mainAcc?.step > 5 && mainAcc?.account_owner === account?.toLowerCase()) {
        setStep(6);
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: { dashboard: "true" },
        });
      } else if (
        mainAcc?.step > 2 &&
        mainAcc?.account_owner === account?.toLowerCase() &&
        library
      ) {
        setInitialRegister(true);
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: { dashboard: "false" },
        });
        getBalance().then((balance) => {
          if (balance >= 100) {
            setStep(mainAcc?.step > 4 ? mainAcc?.step : 4);
          } else {
            setStep(mainAcc?.step);
          }
        });
      } else if (mainAcc?.account_owner !== account?.toLowerCase()) {
        setStep(1);
      } else {
        setInitialRegister(true);
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: { dashboard: "false" },
        });
        setStep(2);
      }
    }
  }, [appState?.connectionType, mainAcc?.step, mainAcc?.account_owner, account, library]);

  useEffect(() => {
    if (!appState?.connectionType) {
      dispatch({
        type: "UPDATE_ACTIVE_EXTENSIONS",
        payload: {
          trade: "false",
          loan: "false",
          notify: "false",
          staking: "false",
          referral: "false",
          connect: "false",
          dashboard: "false",
        },
      });
      dispatch({
        type: "SET_SIDE_BAR",
        payload: {
          userData: null,
        },
      });
    }
  }, [appState?.connectionType]);

  useEffect(() => {
    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: false },
    });
  }, [location]);

  async function init() {
    await axios
      .post(
        "/api/accounts/activate-account",
        {},
        {
          timeout: 120000,
        },
      )
      .then((res) => {
        if (res.data?.account) {
          dispatch({
            type: "SET_SYSTEM_ACCOUNT_DATA",
            payload: res.data.account,
          });
        }
      })
      .catch((e) => {});
  }

  return (
    <main>
      <div className={`main-container ${sideBarOpen ? "sideOpen" : ""}`}>
        {showSignInModal && (
          <div className="signInContainer">
            <SignIn
              onClick={handleSubmitSignIn}
              sideBarClose={() => loginWithEmail(false)}
              signInState={signInState}
              otpEnabled={procceed2fa}
              otpState={otpState}
              handleTFA={(code) => validate2fa(code)}
              resetPasswordState={resetPasswordState}
              handleResetPassword={handleResetPassword}
              handleDataChange={handleDataChange}
            />
          </div>
        )}
        <Header
          title={
            <svg
              width="53"
              height="18"
              viewBox="0 0 53 18"
              fill="white"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M0.236236 17.5325C1.44104 17.5325 2.31511 16.8078 3.26005 14.7039L9.82741 0H10.04L17.1035 15.6857C17.7177 17.0649 18.45 17.5325 19.4895 17.5325H19.9856V17.7662H19.5131C18.7335 17.7662 17.3161 17.6961 16.3239 17.6961C15.3081 17.6961 13.9615 17.7662 12.9693 17.7662H12.4969V17.5325H12.9693C13.9143 17.5325 14.4104 17.1117 13.9143 15.9662L12.3551 12.3429H5.24444L4.22862 14.7039C3.3073 16.8312 3.49629 17.5325 4.70109 17.5325H5.17356V17.7662H4.70109C3.94514 17.7662 3.14194 17.6494 2.48048 17.6494C1.91351 17.6494 0.92132 17.7662 0.236236 17.7662H0V17.5325H0.236236ZM5.57517 11.5948H12.0244L8.8116 4.13766L5.57517 11.5948Z" />
              <path d="M23.8932 2.45455H24.1295V6.07792H27.9329V6.77922H24.1295V14.8208C24.1295 16.2701 24.7673 16.8779 25.6886 16.8779C26.3501 16.8779 27.0588 16.8312 28.1455 16.1065L28.2872 16.2935C27.0115 17.2519 25.8067 18 24.4129 18C22.712 18 21.2946 17.0649 21.2946 14.961V6.77922H19.3102V6.54545L19.641 6.4052C21.0584 5.7039 22.9247 4.46494 23.8932 2.45455Z" />
              <path d="M36.4949 17.8831L36.3059 17.7662V16.0364C34.9594 17.3922 33.8255 18 32.3608 18C30.7544 18 29.337 17.2286 29.337 15.3351C29.337 12.3662 32.597 12.4364 36.3059 10.9169V10.1922C36.3059 7.80779 35.2665 7.01299 33.6837 7.01299C32.2191 7.01299 30.8016 7.80779 30.0929 9.3039L29.8095 9.16364C30.589 7.43377 32.1954 5.84416 34.6759 5.84416C37.3218 5.84416 39.1408 7.2 39.1408 10.0753V15.639C39.1408 17.0182 39.6132 17.5325 40.6527 17.5325H41.1252V17.7662H40.6527C39.4951 17.7662 37.936 17.813 36.4949 17.8831ZM32.1718 14.7506C32.1718 15.7558 32.7388 16.5039 33.9672 16.5039C34.794 16.5039 35.3846 16.2701 36.3059 15.4519V11.4545C33.2585 12.7403 32.1718 13.3948 32.1718 14.7506Z" />
              <path d="M45.2547 17.6494C44.4751 17.6494 43.2939 17.7662 42.3253 17.7662H41.8529V17.5325H42.3253C43.3648 17.5325 43.8372 17.0182 43.8372 15.639V8.78961C43.8372 7.41039 43.3648 6.8961 42.3253 6.8961H42.0891V6.66234H42.3253C43.7428 6.66234 45.2074 6.45195 46.4358 5.61039H46.6721V7.76104C47.995 6.52208 49.0108 5.84416 50.1211 5.84416C51.2314 5.84416 52.2 6.42857 52.2 7.24675C52.2 7.83117 51.7512 8.32208 51.0661 8.32208C50.1211 8.32208 49.7431 7.43377 48.7037 7.43377C48.0895 7.43377 47.5698 7.64416 46.6721 8.2987V15.639C46.6721 17.0182 47.1446 17.5325 48.184 17.5325H48.6565V17.7662H48.184C47.2154 17.7662 46.0342 17.6494 45.2547 17.6494Z" />
            </svg>
          }
          logoSvg={<Logo />}
          onLogoClick={() => navigate("/")}
          modules={exts}
          account={appState?.userData?.address && account ? account : ""}
          location={location}
          sideBarOpen={sideBarOpen}
          sideBar={sideBar}
          handleConnect={handleConnect}
          handleNotifications={handleNotifications}
          verified={emailVerified}
          amount={balance ?? 0}
          initialRegister={step < 6}
          setInitialRegister={setInitialRegister}
          loginWithEmail={loginWithEmail}
          loggedWithEmail={appState.connectionType === "email"}
        />
        {initialRegister && step < 6 && (
          <LandingRegistration
            step={step}
            setStep={setStep}
            setInitialRegister={setInitialRegister}
          />
        )}
        <ToastContainer />
        {account || (emailVerified && appState.connectionType === "email") ? (
          <Routes>
            <Route
              path="/"
              element={
                <Landing
                  step={step}
                  setStep={setStep}
                  initialRegister={initialRegister}
                  setInitialRegister={setInitialRegister}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardSharedLayout
                  disabledAccount={
                    !appState?.userData?.active && appState?.userData?.step == "6"
                  }
                  links={links}
                  children={<Dashboard />}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <DashboardSharedLayout
                  disabledAccount={
                    !appState?.userData?.active && appState?.userData?.step == "6"
                  }
                  links={links}
                  children={<Transactions />}
                />
              }
            />
            <Route
              path="/top-up"
              element={
                <DashboardSharedLayout
                  disabledAccount={
                    !appState?.userData?.active && appState?.userData?.step == "6"
                  }
                  links={links}
                  children={<TopUp />}
                />
              }
            />
            <Route
              path="/loan"
              element={
                isExtensionsLoaded &&
                activeExtensions.loan === "false" &&
                activeExtensions?.loanAdmin === "false" ? (
                  <Navigate to="/" />
                ) : (
                  <Loan />
                  // <Trade />
                )
              }
            />
            <Route
              path="/trade"
              element={
                isExtensionsLoaded &&
                activeExtensions.trade === "false" &&
                activeExtensions?.tradeAdmin === "false" ? (
                  <Navigate to="/" />
                ) : (
                  <Trade />
                )
              }
            />
            <Route
              path="/staking"
              element={
                isExtensionsLoaded &&
                activeExtensions.staking === "false" &&
                activeExtensions?.stakingAdmin === "false" ? (
                  <Navigate to="/" />
                ) : (
                  <Staking />
                )
              }
            />
            <Route
              path="/referral"
              element={
                isExtensionsLoaded &&
                activeExtensions.referral === "false" &&
                activeExtensions.referralAdmin === "false" &&
                (!appState?.userData?.tier?.value ||
                  appState?.userData?.tier?.value === "Novice Navigator") ? (
                  <Navigate to="/" />
                ) : (
                  <Referral />
                )
              }
            />
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/extensions/:id" element={<ExtensionItem />} />
            <Route path="/verify/:id" element={<VerifyEmail />} />
            <Route path="/reset-password/:code" element={<ResetPassword />} />
            <Route
              path="/create-account"
              element={
                <DashboardSharedLayout
                  disabledAccount={
                    !appState?.userData?.active && appState?.userData?.step == "6"
                  }
                  links={links}
                  children={<CreateAccount />}
                />
              }
            />
            <Route path="/test" element={<Test />} />
            <Route path="/deposit/:hash" element={<Success />} />
            <Route path="/coinbase/cancel" element={<Cancel />} />
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Landing
                  step={step}
                  setStep={setStep}
                  initialRegister={initialRegister}
                  setInitialRegister={setInitialRegister}
                />
              }
            />
            <Route path="/reset-password/:code" element={<ResetPassword />} />
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/extensions/:id" element={<ExtensionItem />} />
            <Route
              path="/dashboard"
              element={
                <DashboardSharedLayout
                  disabledAccount={
                    !appState?.userData?.active && appState?.userData?.step == "6"
                  }
                  links={links}
                  children={<Dashboard />}
                />
              }
            />
          </Routes>
        )}
      </div>
      <SideBar />
      {appState?.connectionError === "No MetaMask detected" && (
        <Popup
          popUpElement={<NoMetaMask />}
          label={"Metamask is not installed"}
          handlePopUpClose={() => {
            dispatch({
              type: "CONNECTION_ERROR",
              payload: "",
            });
          }}
          popupBGclass={"cover-most-bg"}
        />
      )}
      {appState?.connectionError === "Please switch your network in wallet" && (
        <Popup
          popUpElement={
            <ChangeNetwork
              disconnect={() => {
                logout();
                dispatch({
                  type: "CONNECTION_ERROR",
                  payload: "",
                });
              }}
              handleNetworkChange={() => {
                switchToBscTestnet();
              }}
            />
          }
          handlePopUpClose={() => {
            dispatch({
              type: "CONNECTION_ERROR",
              payload: "",
            });
          }}
          label={"Check Your Network"}
          customStyles={{ zIndex: "1002 !important", backgroundColor: "red !important" }}
          popupBGclass={"cover-most-bg"}
        />
      )}
    </main>
  );
}

export default App;
