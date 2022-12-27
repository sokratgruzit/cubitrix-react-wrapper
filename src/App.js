import './App.css';
import Dashboard from './components/Dashboard';
import Trade from './components/Trade';
import Loan from './components/Loan';
import Referal from './components/Referal';
import Staking from './components/Staking';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layouts/Header/Header';
import Footer from './components/Layouts/Footer/Footer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/loan' element={<Trade />} />
        <Route path='/trade' element={<Loan />} />
        <Route path='/staking' element={<Referal />} />
        <Route path='/referal' element={<Staking />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
