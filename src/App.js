import { Buffer } from 'buffer'
import './App.css'
import Dashboard from './components/Dashboard'
import Trade from './components/Trade'
import Loan from './components/Loan'
import Referral from './components/Referral'
import Staking from './components/Staking'
import CreateAccount from './components/CreateAccount'
import { Routes, Route } from 'react-router-dom'
import Extensions from './components/Extensions'
import ExtensionItem from './components/ExtensionItem'
import Transactions from './components/Transactions'

import { useSelector, useDispatch } from 'react-redux'
import SideBar from './components/Layouts/SideBar/SideBar'
import VerifyEmail from './components/VerifyEmail/VerifyEmail'
import { ChangeNetwork, DashboardSharedLayout, Header, NoMetaMask, Popup } from '@cubitrix/cubitrix-react-ui-module'

import '@cubitrix/cubitrix-react-ui-module/src/assets/css/main-theme.css'
import { useConnect } from '@cubitrix/cubitrix-react-connect-module'

import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from './api/axios'
import { Logo } from './assets/svg'
import ResetPassword from './components/ResetPassword/ResetPassword'

import { injected, walletConnect } from './connector'
import Test from './components/test'
import TopUp from './components/TopUp/TopUp'
import Success from './components/Deposit/Success'
import Cancel from './components/Deposit/Cancel'
import WBNB from './abi/WBNB.json'

import Landing from './components/Landing'
import LandingRegistration from './components/LandingRegistration'

window.Buffer = window.Buffer || Buffer
function App() {
  const sideBarOpen = useSelector(state => state.appState?.sideBarOpen)
  const sideBar = useSelector(state => state.appState?.sideBar)
  const emailVerified = useSelector(state => state.appState?.emailVerified)
  const exts = useSelector(state => state.extensions?.activeExtensions)
  const chainId = useSelector(state => state.connect.chainId)
  const providerType = useSelector(state => state.connect.providerType)
  const triedReconnect = useSelector(state => state.appState?.triedReconnect)
  const balance = useSelector(state => state.appState.userData?.system?.[0]?.balance)
  const location = useLocation()
  const dispatch = useDispatch()
  const appState = useSelector(state => state.appState)
  const isExtensionsLoaded = appState.isExtensionsLoaded
  const { activeExtensions } = useSelector(state => state.extensions)

  const { library, disconnect, switchToBscTestnet, active, account, MetaMaskEagerlyConnect, WalletConnectEagerly } =
    useConnect()

  useEffect(() => {
    MetaMaskEagerlyConnect(injected)
    WalletConnectEagerly(walletConnect)
    if (!providerType) {
      dispatch({ type: 'SET_TRIED_RECONNECT', payload: true })
    }
    // eslint-disable-next-line
  }, [])

  const updateState = () => {
    dispatch({
      type: 'SET_USER_DATA',
      payload: {},
    })
    axios
      .post('/api/accounts/get_account', {
        address: account,
      })
      .then(res => {
        dispatch({
          type: 'SET_USER_DATA',
          payload: res.data.success.data.accounts[0],
        })
        dispatch({
          type: 'UPDATE_ACTIVE_EXTENSIONS',
          payload: res.data.success.data.accounts[0].extensions,
        })
        dispatch({
          type: 'SET_EXTENSIONS_LOADED',
          payload: true,
        })
      })
      .catch(e => {})
  }

  useEffect(() => {
    if (account && triedReconnect && active) {
      const fetchData = async () => {
        await axios
          .post('/api/accounts/login', {
            address: account,
          })
          .then(res => {
            if (res?.data === 'success') {
              updateState()
            }
          })
          .catch(err => {})
      }
      fetchData()
    }
  }, [account, triedReconnect, active])

  useEffect(() => {
    dispatch({
      type: 'UPDATE_STATE',
      account: account,
      chainId: chainId,
    })
  }, [account, chainId, dispatch])

  const handleConnect = () => {
    if (sideBarOpen) {
      dispatch({
        type: 'SET_SIDE_BAR',
        payload: { sideBarOpen: !sideBarOpen },
      })
    } else {
      dispatch({
        type: 'SET_SIDE_BAR',
        payload: { sideBarOpen: !sideBarOpen, sideBar: 'connect' },
      })
    }
  }

  const handleNotifications = () => {
    if (sideBarOpen && sideBar !== 'notifications') {
      return dispatch({
        type: 'SET_SIDE_BAR',
        payload: { sideBar: 'notifications' },
      })
    }

    dispatch({
      type: 'SET_SIDE_BAR',
      payload: { sideBarOpen: !sideBarOpen, sideBar: 'notifications' },
    })
  }

  useEffect(() => {
    if (account && triedReconnect && active) {
      async function init() {
        await axios
          .post(
            '/api/accounts/activate-account',
            {
              address: account,
            },
            {
              timeout: 60000,
            }
          )
          .then(res => {
            if (res.data?.account) {
              dispatch({
                type: 'SET_SYSTEM_ACCOUNT_DATA',
                payload: res.data.account,
              })
            }
          })
          .catch(e => {})
      }
      init()
    }
    // eslint-disable-next-line
  }, [account, triedReconnect, active])

  useEffect(() => {
    if (!account && triedReconnect && !active) {
      dispatch({
        type: 'UPDATE_ACTIVE_EXTENSIONS',
        payload: {
          trade: 'false',
          loan: 'false',
          notify: 'false',
          staking: 'false',
          referral: 'false',
          connect: 'false',
          dashboard: 'false',
        },
      })
      dispatch({
        type: 'SET_SIDE_BAR',
        payload: {
          userData: null,
        },
      })
    }
    // eslint-disable-next-line
  }, [account, triedReconnect, active])

  const links = [
    {
      to: '/dashboard',
      label: 'Accounts',
      svg: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M21.45 13.64V14.64C21.45 14.7709 21.3987 14.8966 21.3071 14.9901C21.2155 15.0836 21.0909 15.1374 20.96 15.14H19.5C18.97 15.14 18.49 14.75 18.45 14.23C18.42 13.92 18.54 13.63 18.74 13.43C18.8305 13.3363 18.9394 13.2621 19.0598 13.2122C19.1803 13.1623 19.3097 13.1378 19.44 13.14H20.95C21.24 13.15 21.45 13.37 21.45 13.64Z'
            fill='white'
          />
          <path
            d='M17.99 12.69C17.49 13.18 17.25 13.91 17.45 14.67C17.71 15.6 18.62 16.19 19.58 16.19H20.45C21 16.19 21.45 16.64 21.45 17.19V17.38C21.45 19.45 19.76 21.14 17.69 21.14H6.21001C4.14001 21.14 2.45001 19.45 2.45001 17.38V10.65C2.45001 9.42001 3.04001 8.33001 3.95001 7.65001C4.58001 7.17001 5.36001 6.89001 6.21001 6.89001H17.69C19.76 6.89001 21.45 8.58001 21.45 10.65V11.09C21.45 11.64 21 12.09 20.45 12.09H19.43C18.87 12.09 18.36 12.31 17.99 12.69Z'
            fill='white'
          />
          <path
            d='M16.2 4.82002C16.47 5.09002 16.24 5.51002 15.86 5.51002L8.18 5.50002C7.74 5.50002 7.51 4.96002 7.83 4.65002L9.45 3.02002C10.11 2.3666 11.0012 2.00006 11.93 2.00006C12.8588 2.00006 13.75 2.3666 14.41 3.02002L16.16 4.79002C16.17 4.80002 16.19 4.81002 16.2 4.82002Z'
            fill='#B3B3B3'
          />
        </svg>
      ),
    },
    {
      to: '/transactions',
      label: 'Transaction History',
      svg: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M6.73 19.7C7.55 18.82 8.8 18.89 9.52 19.85L10.53 21.2C11.34 22.27 12.65 22.27 13.46 21.2L14.47 19.85C15.19 18.89 16.44 18.82 17.26 19.7C19.04 21.6 20.49 20.97 20.49 18.31V7.04C20.5 3.01 19.56 2 15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.97 4.96 21.59 6.73 19.7Z'
            fill='white'
          />
          <path
            d='M16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z'
            fill='#B3B3B3'
          />
          <path
            d='M15 11.75H9C8.59 11.75 8.25 11.41 8.25 11C8.25 10.59 8.59 10.25 9 10.25H15C15.41 10.25 15.75 10.59 15.75 11C15.75 11.41 15.41 11.75 15 11.75Z'
            fill='#B3B3B3'
          />
        </svg>
      ),
    },
    {
      to: '/top-up',
      label: 'Payment Method',
      svg: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M6.73 19.7C7.55 18.82 8.8 18.89 9.52 19.85L10.53 21.2C11.34 22.27 12.65 22.27 13.46 21.2L14.47 19.85C15.19 18.89 16.44 18.82 17.26 19.7C19.04 21.6 20.49 20.97 20.49 18.31V7.04C20.5 3.01 19.56 2 15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.97 4.96 21.59 6.73 19.7Z'
            fill='white'
          />
          <path
            d='M16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z'
            fill='#B3B3B3'
          />
          <path
            d='M15 11.75H9C8.59 11.75 8.25 11.41 8.25 11C8.25 10.59 8.59 10.25 9 10.25H15C15.41 10.25 15.75 10.59 15.75 11C15.75 11.41 15.41 11.75 15 11.75Z'
            fill='#B3B3B3'
          />
        </svg>
      ),
    },
  ]

  const [step, setStep] = useState(5)
  const [initialRegister, setInitialRegister] = useState(true)
  const navigate = useNavigate()

  let tokenAddress = '0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb' // Staking Token Address
  const systemAcc = appState?.userData
  const metaAcc = appState?.userData?.meta

  useEffect(() => {
    if (!account && triedReconnect && !active) {
      setStep(1)
    } else if (account && triedReconnect && active) {
      if (systemAcc && systemAcc.registered && systemAcc?.account_owner === account?.toLowerCase()) {
        setStep(5)
        dispatch({
          type: 'UPDATE_ACTIVE_EXTENSIONS',
          payload: { dashboard: 'true' },
        })
      } else if (systemAcc?.step > 2 && library && systemAcc?.account_owner === account?.toLowerCase()) {
        getBalance().then(balance => {
          if (balance > 200) {
            setStep(4)
          } else {
            setStep(systemAcc.step)
          }
        })
      } else if (systemAcc?.account_owner !== account?.toLowerCase()) {
        // setStep(systemAcc?.step || 2);
      } else {
        setStep(2)
      }
    }
  }, [account, triedReconnect, active, library, metaAcc])

  async function getBalance() {
    var tokenContract = new library.eth.Contract(WBNB, tokenAddress)
    var decimals = await tokenContract.methods.decimals().call()
    var getBalance = await tokenContract.methods.balanceOf(account).call()

    var pow = 10 ** decimals
    var balanceInEth = getBalance / pow

    return balanceInEth
  }

  return (
    <main>
      <div className={`main-container ${sideBarOpen ? 'sideOpen' : ''}`}>
        <Header
          title={'COMPLEND'}
          logoSvg={<Logo />}
          onLogoClick={() => navigate('/')}
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
          <LandingRegistration step={step} setStep={setStep} setInitialRegister={setInitialRegister} />
        )}
        <Routes>
          <Route
            path='/'
            element={
              <Landing
                step={step}
                setStep={setStep}
                initialRegister={initialRegister}
                setInitialRegister={setInitialRegister}
              />
            }
          />
          <Route path='/dashboard' element={<DashboardSharedLayout links={links} children={<Dashboard />} />} />
          <Route path='/transactions' element={<DashboardSharedLayout links={links} children={<Transactions />} />} />
          <Route path='/top-up' element={<DashboardSharedLayout links={links} children={<TopUp />} />} />
          <Route
            path='/loan'
            element={isExtensionsLoaded && activeExtensions.loan === 'false' ? <Navigate to='/' /> : <Loan />}
          />
          <Route
            path='/trade'
            element={isExtensionsLoaded && activeExtensions.trade === 'false' ? <Navigate to='/' /> : <Trade />}
          />
          <Route
            path='/staking'
            element={isExtensionsLoaded && activeExtensions.staking === 'false' ? <Navigate to='/' /> : <Staking />}
          />
          <Route
            path='/referral'
            element={isExtensionsLoaded && activeExtensions.referral === 'false' ? <Navigate to='/' /> : <Referral />}
          />
          <Route path='/extensions' element={<Extensions />} />
          <Route path='/extensions/:id' element={<ExtensionItem />} />
          <Route path='/verify/:id' element={<VerifyEmail />} />
          <Route path='/reset-password/:code' element={<ResetPassword />} />
          <Route
            path='/create-account'
            element={<DashboardSharedLayout links={links} children={<CreateAccount />} />}
          />
          <Route path='/test' element={<Test />} />
          <Route path='/deposit/:hash' element={<Success />} />
          <Route path='/coinbase/cancel' element={<Cancel />} />
        </Routes>
      </div>
      <SideBar />
      {appState?.connectionError === 'No MetaMask detected' && (
        <Popup
          popUpElement={<NoMetaMask />}
          label={'Metamask is not installed'}
          handlePopUpClose={() => {
            dispatch({
              type: 'CONNECTION_ERROR',
              payload: '',
            })
          }}
          popupBGclass={'cover-most-bg'}
        />
      )}
      {appState?.connectionError === 'Please switch your network in wallet' && (
        <Popup
          popUpElement={
            <ChangeNetwork
              disconnect={() => {
                disconnect()
                dispatch({
                  type: 'CONNECTION_ERROR',
                  payload: '',
                })
              }}
              handleNetworkChange={() => {
                switchToBscTestnet()
              }}
            />
          }
          handlePopUpClose={() => {
            dispatch({
              type: 'CONNECTION_ERROR',
              payload: '',
            })
          }}
          label={'Check Your Network'}
          customStyles={{ zIndex: '1002 !important', backgroundColor: 'red !important' }}
          popupBGclass={'cover-most-bg'}
        />
      )}
    </main>
  )
}

export default App
