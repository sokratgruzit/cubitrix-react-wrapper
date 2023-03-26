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

import { useSelector, useDispatch } from "react-redux";
import SideBar from "./components/Layouts/SideBar/SideBar";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import { Header } from "@cubitrix/cubitrix-react-ui-module";

import "@cubitrix/cubitrix-react-ui-module/src/assets/css/main-theme.css";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import { Logo } from "./assets/svg";
import ResetPassword from "./components/ResetPassword/ResetPassword";

import { injected } from "./connector";

window.Buffer = window.Buffer || Buffer;
function App() {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const emailVerified = useSelector((state) => state.appState.emailVerified);
  const exts = useSelector((state) => state.extensions.activeExtensions);
  const account = useSelector((state) => state.connect.account);
  const chainId = useSelector((state) => state.connect.chainId);
  const triedReconnect = useSelector((state) => state.appState.triedReconnect);
  const balance = useSelector(
    (state) => state.appState.userData?.system?.[0]?.balance
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const [img, setImg] = useState("");

  const { MetaMaskEagerlyConnect } = useConnect();

  useEffect(() => {
    async function fetchGitData() {
      await axios
        .post("/api/test", {
          o: "sokratgruzit",
          r: "core-assets",
          p: "blockchains/aeternity/info/logo.png",
          t: "download_url",
        })
        .then((res) => {
          setImg(res.data);
        })
        .catch((e) => {});
    }

    fetchGitData();
  }, []);

  useEffect(() => {
    if (account && chainId) {
      const fetchData = async () => {
        await axios
          .post("/api/accounts/login", {
            address: account,
          })
          .then((res) => {})
          .catch((err) => {});
      };
      fetchData();
    }
  }, [dispatch, account, chainId]);

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
    MetaMaskEagerlyConnect(injected, () => {
      dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (account && triedReconnect) {
      async function init() {
        await axios
          .post("/api/accounts/activate-account", {
            address: account,
          })
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
  }, [account]);

  return (
    <main>
      <div className={`main-container ${sideBarOpen ? "sideOpen" : ""}`}>
        {/* <img src={img} alt="img" /> */}
        <Header
          title={"COMPLEND"}
          logoSvg={<Logo />}
          modules={exts}
          account={account}
          location={location}
          sideBarOpen={sideBarOpen}
          sideBar={sideBar}
          handleConnect={handleConnect}
          handleNotifications={handleNotifications}
          verified={emailVerified}
          amount={balance ?? 0}
        />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/loan' element={<Loan />} />
          <Route path='/trade' element={<Trade />} />
          <Route path='/staking' element={<Staking />} />
          <Route path='/referral' element={<Referral />} />
          <Route path='/extensions' element={<Extensions />} />
          <Route path='/verify/:id' element={<VerifyEmail />} />
          <Route path='/reset-password/:code' element={<ResetPassword />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </div>
      <SideBar />
    </main>
  );
}

export default App;
