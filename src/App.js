import "./App.css";
import Dashboard from "./components/Dashboard";
import Trade from "./components/Trade";
import Loan from "./components/Loan";
import Referal from "./components/Referal";
import Stake from "./components/Staking";
import { Routes, Route } from "react-router-dom";
// import Header from "./components/Layouts/Header/Header";
import Footer from "./components/Layouts/Footer/Footer";
import Extensions from "./components/Extensions";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import CreateProfile from "./components/CreateProfile/CreateProfile";
import RecoveryLogin from "./components/RecoveryLogin/RecoveryLogin";
import { TwoFactorAuth } from "@cubitrix/cubitrix-react-connect-module";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "./components/Layouts/SideBar/SideBar";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import { Header } from "@cubitrix/cubitrix-react-ui-module";

import "@cubitrix/cubitrix-react-ui-module/src/assets/css/main-theme.css";

import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "./api/axios";

function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const exts = useSelector((state) => state.extensions.activeExtensions);
  const account = useSelector((state) => state.connect.account);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (account) {
      axios
        .post("/accounts/get_account", {
          address: account,
        })
        .then((res) => {
          dispatch({
            type: "SET_USER_DATA",
            payload: res.data.success.data.accounts[0],
          });
        })
        .catch((e) => console.log(e?.response));
    }
  }, [account, dispatch]);

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

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <main>
        <div className={`main-container ${sideBarOpen ? "sideOpen" : ""}`}>
          <Header
            modules={exts}
            account={account}
            NavLink={NavLink}
            location={location}
            sideBarOpen={sideBarOpen}
            sideBar={sideBar}
            handleConnect={handleConnect}
            handleNotifications={handleNotifications}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loan" element={<Trade />} />
            <Route path="/trade" element={<Loan />} />
            <Route path="/staking" element={<Referal />} />
            <Route path="/referal" element={<Stake />} />
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/recovery" element={<RecoveryLogin />} />
            <Route path="/auth" element={<TwoFactorAuth />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/verify/:id" element={<VerifyEmail />} />
          </Routes>
          <Footer />
        </div>
        <SideBar />
      </main>
    </Web3ReactProvider>
  );
}

export default App;
