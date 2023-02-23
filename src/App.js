import { Buffer } from "buffer";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Trade from "./components/Trade";
import Loan from "./components/Loan";
import Referal from "./components/Referal";
import Staking from "./components/Staking";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Layouts/Footer/Footer";
import Extensions from "./components/Extensions";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "./components/Layouts/SideBar/SideBar";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import { Header } from "@cubitrix/cubitrix-react-ui-module";

import "@cubitrix/cubitrix-react-ui-module/src/assets/css/main-theme.css";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import { Logo } from "./assets/svg";
import ResetPassword from "./components/ResetPassword/ResetPassword";

function getLibrary(provider) {
  return new Web3(provider);
}

window.Buffer = window.Buffer || Buffer;
function App() {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const emailVerified = useSelector((state) => state.appState.emailVerified);
  const exts = useSelector((state) => state.extensions.activeExtensions);
  const account = useSelector((state) => state.connect.account);
  const chainId = useSelector((state) => state.connect.chainId);
  const location = useLocation();
  const dispatch = useDispatch();
  const [img, setImg] = useState("");

  useEffect(() => {
    async function fetchGitData() {
      await axios.post("/api/test", {
        o: "sokratgruzit",
        r: "core-assets",
        p: "blockchains/aeternity/info/logo.png",
        t: "download_url"
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
          .post("/accounts/login", {
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

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <main>
        <div className={`main-container ${sideBarOpen ? "sideOpen" : ""}`}>
          <img src={img} alt="img" />
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
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/referal" element={<Referal />} />
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/verify/:id" element={<VerifyEmail />} />
            <Route path="/reset-password/:code" element={<ResetPassword />} />
          </Routes>
          <Footer />
        </div>
        <SideBar />
      </main>
    </Web3ReactProvider>
  );
}

export default App;
