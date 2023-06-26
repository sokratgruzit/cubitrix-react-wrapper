import { Buffer } from "buffer";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Trade from "./components/Trade";
import Loan from "./components/Loan";
import Referral from "./components/Referral";
import Staking from "./components/Staking";
import CreateAccount from "./components/CreateAccount";
import { Routes, Route } from "react-router-dom";
import Extensions from "./components/Extensions";
import ExtensionItem from "./components/ExtensionItem";
import Transactions from "./components/Transactions";

import { useSelector, useDispatch } from "react-redux";
import SideBar from "./components/Layouts/SideBar/SideBar";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import {
  ChangeNetwork,
  DashboardSharedLayout,
  Header,
  NoMetaMask,
  Popup,
} from "@cubitrix/cubitrix-react-ui-module";

import "@cubitrix/cubitrix-react-ui-module/src/assets/css/main-theme.css";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import { Logo } from "./assets/svg";
import ResetPassword from "./components/ResetPassword/ResetPassword";

import { injected, walletConnect } from "./connector";
import Test from "./components/test";
import TopUp from "./components/TopUp/TopUp";
import Success from "./components/Deposit/Success";
import Cancel from "./components/Deposit/Cancel";
import WBNB from "./abi/WBNB.json";

import Landing from "./components/Landing";
import LandingRegistration from "./components/LandingRegistration";

window.Buffer = window.Buffer || Buffer;
function App() {
  const sideBarOpen = useSelector((state) => state.appState?.sideBarOpen);
  const sideBar = useSelector((state) => state.appState?.sideBar);
  const emailVerified = useSelector((state) => state.appState?.emailVerified);
  const exts = useSelector((state) => state.extensions?.activeExtensions);
  const chainId = useSelector((state) => state.connect.chainId);
  const providerType = useSelector((state) => state.connect.providerType);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const balance = useSelector((state) => state.appState.userData?.system?.[0]?.balance);
  const location = useLocation();
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.appState);
  const isExtensionsLoaded = appState.isExtensionsLoaded;
  const { activeExtensions } = useSelector((state) => state.extensions);

  const {
    library,
    disconnect,
    switchToBscTestnet,
    active,
    account,
    MetaMaskEagerlyConnect,
    WalletConnectEagerly,
  } = useConnect();

  useEffect(() => {
    MetaMaskEagerlyConnect(injected);
    WalletConnectEagerly(walletConnect);
    if (!providerType) {
      dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
    }
    // eslint-disable-next-line
  }, []);

  const updateState = () => {
    dispatch({
      type: "SET_USER_DATA",
      payload: {},
    });
    axios
      .post("/api/accounts/get_account", {
        address: account,
      })
      .then((res) => {
        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.success.data.accounts[0],
        });
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: res.data.success.data.accounts[0].extensions,
        });
        dispatch({
          type: "SET_EXTENSIONS_LOADED",
          payload: true,
        });
      })
      .catch((e) => {});
  };

  useEffect(() => {
    if (account && triedReconnect && active) {
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
      fetchData();
    }
  }, [account, triedReconnect, active]);

  useEffect(() => {
    dispatch({
      type: "UPDATE_STATE",
      account: account,
      chainId: chainId,
    });
  }, [account, chainId, dispatch]);

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

  useEffect(() => {
    if (account && triedReconnect && active) {
      async function init() {
        await axios
          .post(
            "/api/accounts/activate-account",
            {
              address: account,
            },
            {
              timeout: 60000,
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
      init();
    }
    // eslint-disable-next-line
  }, [account, triedReconnect, active]);

  useEffect(() => {
    if (!account && triedReconnect && !active) {
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
    // eslint-disable-next-line
  }, [account, triedReconnect, active]);

  const links = [
    {
      to: "/dashboard",
      label: "Overview",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`dashboard-svg`}>
          <path
            d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z"
            stroke={
              location.pathname === "/dashboard" ? "#141726" : "rgba(255, 255, 255, 0.6)"
            }
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17.99V14.99"
            stroke={
              location.pathname === "/dashboard" ? "#141726" : "rgba(255, 255, 255, 0.6)"
            }
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          xmlns="http://www.w3.org/2000/svg"
          className={`dashboard-svg`}>
          <path
            d="M11.9995 22.75C11.2195 22.75 10.4595 22.35 9.93953 21.65L8.92953 20.3C8.71953 20.02 8.43953 19.86 8.13953 19.84C7.83953 19.83 7.53953 19.96 7.29953 20.21C5.85953 21.75 4.74953 21.63 4.21953 21.42C3.67953 21.21 2.76953 20.52 2.76953 18.3V7.04C2.76953 2.6 4.04953 1.25 8.23953 1.25H15.7995C19.9895 1.25 21.2695 2.6 21.2695 7.04V18.3C21.2695 20.51 20.3595 21.2 19.8195 21.42C19.2895 21.63 18.1895 21.75 16.7395 20.21C16.4995 19.95 16.1995 19.82 15.8895 19.84C15.5895 19.86 15.2995 20.02 15.0895 20.3L14.0795 21.65C13.5395 22.35 12.7795 22.75 11.9995 22.75ZM8.07953 18.33H8.20953C8.94953 18.37 9.64953 18.76 10.1195 19.39L11.1295 20.74C11.6195 21.39 12.3695 21.39 12.8595 20.74L13.8695 19.39C14.3495 18.76 15.0395 18.37 15.7895 18.33C16.5395 18.29 17.2695 18.6 17.8095 19.18C18.5695 19.99 19.0595 20.09 19.2395 20.02C19.4795 19.92 19.7395 19.34 19.7395 18.3V7.04C19.7395 3.43 19.1095 2.75 15.7695 2.75H8.20953C4.86953 2.75 4.23953 3.43 4.23953 7.04V18.3C4.23953 19.35 4.49953 19.93 4.73953 20.02C4.90953 20.09 5.40953 19.99 6.16953 19.18C6.71953 18.63 7.38953 18.33 8.07953 18.33Z"
            fill={`${
              location.pathname === "/transactions"
                ? "#141726"
                : "rgba(255, 255, 255, 0.6)"
            }`}
          />
          <path
            d="M14.75 10.75H9.25C8.84 10.75 8.5 10.41 8.5 10C8.5 9.59 8.84 9.25 9.25 9.25H14.75C15.16 9.25 15.5 9.59 15.5 10C15.5 10.41 15.16 10.75 14.75 10.75Z"
            fill={`${
              location.pathname === "/transactions"
                ? "#141726"
                : "rgba(255, 255, 255, 0.6)"
            }`}
          />
        </svg>
      ),
    },
    {
      to: "/top-up",
      label: "Payment Method",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`dashboard-svg`}>
          <path
            d="M2 8.50488H22"
            stroke={`${
              location.pathname === "/top-up" ? "#141726" : "rgba(255, 255, 255, 0.6)"
            }`}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.44 3.50488H17.55C21.11 3.50488 22 4.38488 22 7.89488V16.1049C22 19.6149 21.11 20.4949 17.56 20.4949H6.44C2.89 20.5049 2 19.6249 2 16.1149V7.89488C2 4.38488 2.89 3.50488 6.44 3.50488Z"
            stroke={`${
              location.pathname === "/top-up" ? "#141726" : "rgba(255, 255, 255, 0.6)"
            }`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const [step, setStep] = useState(5);
  const [initialRegister, setInitialRegister] = useState(true);
  const navigate = useNavigate();

  let tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb"; // Staking Token Address
  const systemAcc = appState?.userData;
  const metaAcc = appState?.userData?.meta;

  useEffect(() => {
    if (!account && triedReconnect && !active) {
      setStep(1);
    } else if (account && triedReconnect && active) {
      if (
        systemAcc &&
        systemAcc.registered &&
        systemAcc?.account_owner === account?.toLowerCase()
      ) {
        setStep(5);
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: { dashboard: "true" },
        });
      } else if (
        systemAcc?.step > 2 &&
        library &&
        systemAcc?.account_owner === account?.toLowerCase()
      ) {
        getBalance().then((balance) => {
          if (balance > 200) {
            setStep(4);
          } else {
            setStep(systemAcc.step);
          }
        });
      } else if (systemAcc?.account_owner !== account?.toLowerCase()) {
        // setStep(systemAcc?.step || 2);
      } else {
        setStep(2);
      }
    }
  }, [account, triedReconnect, active, library, metaAcc]);

  async function getBalance() {
    var tokenContract = new library.eth.Contract(WBNB, tokenAddress);
    var decimals = await tokenContract.methods.decimals().call();
    var getBalance = await tokenContract.methods.balanceOf(account).call();

    var pow = 10 ** decimals;
    var balanceInEth = getBalance / pow;

    return balanceInEth;
  }

  return (
    <main>
      <div className={`main-container ${sideBarOpen ? "sideOpen" : ""}`}>
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
          account={account}
          location={location}
          sideBarOpen={sideBarOpen}
          sideBar={sideBar}
          handleConnect={handleConnect}
          handleNotifications={handleNotifications}
          verified={emailVerified}
          amount={balance ?? 0}
          initialRegister={step < 5}
          setInitialRegister={setInitialRegister}
        />
        {initialRegister && step < 5 && (
          <LandingRegistration
            step={step}
            setStep={setStep}
            setInitialRegister={setInitialRegister}
          />
        )}
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
            element={<DashboardSharedLayout links={links} children={<Dashboard />} />}
          />
          <Route
            path="/transactions"
            element={<DashboardSharedLayout links={links} children={<Transactions />} />}
          />
          <Route
            path="/top-up"
            element={<DashboardSharedLayout links={links} children={<TopUp />} />}
          />
          <Route
            path="/loan"
            element={
              isExtensionsLoaded && activeExtensions.loan === "false" ? (
                <Navigate to="/" />
              ) : (
                <Loan />
              )
            }
          />
          <Route
            path="/trade"
            element={
              isExtensionsLoaded && activeExtensions.trade === "false" ? (
                <Navigate to="/" />
              ) : (
                <Trade />
              )
            }
          />
          <Route
            path="/staking"
            element={
              isExtensionsLoaded && activeExtensions.staking === "false" ? (
                <Navigate to="/" />
              ) : (
                <Staking />
              )
            }
          />
          <Route
            path="/referral"
            element={
              isExtensionsLoaded && activeExtensions.referral === "false" ? (
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
            element={<DashboardSharedLayout links={links} children={<CreateAccount />} />}
          />
          <Route path="/test" element={<Test />} />
          <Route path="/deposit/:hash" element={<Success />} />
          <Route path="/coinbase/cancel" element={<Cancel />} />
        </Routes>
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
                disconnect();
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
