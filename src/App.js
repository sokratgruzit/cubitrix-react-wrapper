import './App.css';
import Dashboard from './components/Dashboard';
import Trade from './components/Trade';
import Loan from './components/Loan';
import Referal from './components/Referal';
import Stake from './components/Staking';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layouts/Header/Header';
import Footer from './components/Layouts/Footer/Footer';
import Extensions from './components/Extensions';
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { RecoveryLogin } from "@cubitrix/cubitrix-react-connect-module";
import { TwoFactorAuth } from "@cubitrix/cubitrix-react-connect-module";
import VerifyEmail from './components/VerifyEmail';

function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/loan' element={<Trade />} />
        <Route path='/trade' element={<Loan />} />
        <Route path='/staking' element={<Stake />} />
        <Route path='/referal' element={<Referal />} />
        <Route path='/extensions' element={<Extensions />} />
        <Route path='/recovery' element={<RecoveryLogin />} />
        <Route path='/auth' element={<TwoFactorAuth />} />
        <Route path="/verify/:id" element={<VerifyEmail />} />
      </Routes>
      <Footer />
    </Web3ReactProvider>
  );
}

export default App;
