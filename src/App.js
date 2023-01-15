import "./App.css";
import Dashboard from "./components/Dashboard";
import Trade from "./components/Trade";
import Loan from "./components/Loan";
import Referal from "./components/Referal";
import Staking from "./components/Staking";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Layouts/Header/Header";
import Footer from "./components/Layouts/Footer/Footer";
import Extensions from "./components/Extensions";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import CreateProfile from "./components/CreateProfile/CreateProfile";
import RecoveryLogin from "./components/RecoveryLogin/RecoveryLogin";
import { TwoFactorAuth } from "@cubitrix/cubitrix-react-connect-module";
import { useSelector } from "react-redux";
import SideBar from "./components/Layouts/SideBar/SideBar";

function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <main>
        <div className={`main-container shit ${sideBarOpen ? "sideOpen" : ""}`}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loan" element={<Trade />} />
            <Route path="/trade" element={<Loan />} />
            <Route path="/staking" element={<Referal />} />
            <Route path="/referal" element={<Staking />} />
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/recovery" element={<RecoveryLogin />} />
            <Route path="/auth" element={<TwoFactorAuth />} />
            <Route path="/create-profile" element={<CreateProfile />} />
          </Routes>
          <Footer />
        </div>
        <SideBar />
      </main>
    </Web3ReactProvider>
  );
}

export default App;
