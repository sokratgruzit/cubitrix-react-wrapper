import React from 'react'
import axios from '../../../api/axios'
import { useSelector, useDispatch } from 'react-redux'

import {
  Connect,
  SideBar,
  UserAccount,
  UserOptions,
  SignIn,
  TwoFactorAuthentication,
  ResetPassword,
  Popup,
  ChangeNetwork,
  NoMetaMask,
  TransferFromAcc,
} from '@cubitrix/cubitrix-react-ui-module'

import { MetaMask, WalletConnect } from '../../../assets/svg'

import { useConnect } from '@cubitrix/cubitrix-react-connect-module'

import { injected, walletConnect } from '../../../connector'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const SideBarRight = () => {
  const appState = useSelector(state => state.appState)
  const userMetaData = useSelector(state => state.appState.userData?.meta)
  const sideBar = useSelector(state => state.appState.sideBar)
  const account = useSelector(state => state.connect.account)

  const [personalData, setPersonalData] = useState(null)
  const { connect, disconnect, error, setError } = useConnect()

  const dispatch = useDispatch()

  const [personalDataState, setPersonalDataState] = useState({
    emailSent: false,
    loading: false,
    saved: false,
    error: '',
  })

  const [securityDataState, setSecurityDataState] = useState({
    emailSent: false,
    loading: false,
    saved: false,
    error: '',
  })

  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [activated, setActivated] = useState(false)
  const [procceed2fa, setProcceed2fa] = useState(false)
  useEffect(() => {
    if (appState.otp_verified) setTwoFactorAuth(appState.otp_verified)
  }, [appState.otp_verified])

  const [base32, setBase32] = useState('')
  const [qrcodeUrl, setqrCodeUrl] = useState('')

  const [signInState, setSignInState] = useState({
    loading: false,
    error: false,
  })
  const [otpState, setOtpState] = useState({ loading: false, error: false })
  const [resetPasswordState, setResetPasswordState] = useState({
    loading: false,
  })
  const [resetPasswordStatus, setresetPasswordStatus] = useState({
    loading: false,
    error: '',
    success: '',
  })
  const [signInAddress, setSignInAddress] = useState('')
  const [twoFactorSetUpState, setTwoFactorSetUpState] = useState('')

  const updateState = () => {
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
    updateState()
    // eslint-disable-next-line
  }, [account])

  const handleClose = () => {
    dispatch({ type: 'SET_SIDE_BAR', payload: { sideBarOpen: false } })
  }

  const handleSignInBar = () => {
    dispatch({ type: 'SET_SIDE_BAR', payload: { sideBar: 'SignIn' } })
  }

  const handleUserAccount = () => {
    dispatch({ type: 'SET_SIDE_BAR', payload: { sideBar: 'UserAccount' } })
  }

  const handleSecurityData = formData => {
    setSecurityDataState(prev => ({ ...prev, loading: true, error: '' }))

    axios
      .post('/api/accounts/update_profile_auth', {
        ...formData,
        address: account,
      })
      .then(res => {
        setSecurityDataState(prev => ({
          ...prev,
          loading: false,
          saved: true,
        }))
        updateState()
        setTimeout(() => {
          setSecurityDataState(prev => ({ ...prev, saved: false }))
        }, 3000)
      })
      .catch(e => {
        setSecurityDataState(prev => ({
          ...prev,
          loading: false,
          error: e?.response?.data,
        }))
      })
  }

  const handlePersonalData = userData => {
    let personalData = { ...userData }
    personalData.avatar = account
    setPersonalDataState(prev => ({ ...prev, loading: true, error: '' }))
    axios
      .post('/api/accounts/update_profile', {
        ...personalData,
        address: account,
      })
      .then(res => {
        if (res.data === 'email sent') {
          setPersonalDataState(prev => ({ ...prev, emailSent: true }))
        }
        updateState()
        setPersonalDataState(prev => ({
          ...prev,
          loading: false,
          saved: true,
        }))
        setTimeout(() => {
          setPersonalDataState(prev => ({ ...prev, saved: false }))
        }, 3000)
      })
      .catch(e => {
        setPersonalDataState(prev => ({
          ...prev,
          loading: false,
          error: e?.response?.data,
        }))
      })

    let formData = new FormData()
    formData.append('img', userData.avatar)
    formData.append('address', account)

    axios
      .post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        updateState()
      })
      .catch(e => {
        console.log(e.response)
      })
  }

  const resendEmail = e => {
    axios
      .post('/api/accounts/resend-email', {
        address: account ? account : signInAddress,
      })
      .then(res => {
        console.log(res.response)
      })
      .catch(e => {
        console.log(e.response)
      })
  }

  const resetPassword = email => {
    setResetPasswordState({ loading: true, success: '', error: '' })
    axios
      .post('/api/accounts/get-reset-password-email', {
        email,
      })
      .then(res => {
        setResetPasswordState(prev => ({
          ...prev,
          loading: false,
          success: res.data,
        }))
      })
      .catch(e => {
        setResetPasswordState(prev => ({
          ...prev,
          loading: false,
          error: e?.response?.data,
        }))
      })
  }

  const handleLogin = ({ email, password }) => {
    if (email && password) {
      setSignInState(prev => ({ ...prev, loading: true, error: '' }))

      axios
        .post('/api/accounts/recovery/login', {
          account,
          email,
          password,
        })
        .then(res => {
          setSignInState(prev => ({ ...prev, loading: false }))
          setSignInAddress(res.data.address)
          if (res.data.message === 'proceed 2fa') return setProcceed2fa(true)
          updateState()
          setProcceed2fa(false)
          dispatch({
            type: 'SET_SIDE_BAR',
            payload: { sideBar: 'UserAccount' },
          })
        })
        .catch(e => {
          setSignInState(prev => ({
            ...prev,
            loading: false,
            error: e.response.data,
          }))
        })
    }
  }
  useEffect(() => {
    if (userMetaData) {
      setPersonalData({
        name: userMetaData.name ? userMetaData.name : '',
        email: userMetaData.email ? userMetaData.email : '',
        mobile: userMetaData?.mobile ? userMetaData?.mobile : '',
        date_of_birth: userMetaData.date_of_birth ? new Date(userMetaData.date_of_birth) : new Date(),
        nationality: userMetaData.nationality ? userMetaData.nationality : '',
        avatar: userMetaData.avatar ? userMetaData.avatar : '',
      })
    } else {
      setPersonalData({
        name: '',
        email: '',
        mobile: '',
        date_of_birth: new Date(),
        nationality: '',
        avatar: '',
      })
    }
  }, [userMetaData])

  const disableOTP = () => {
    axios
      .post('/api/accounts/otp/disable', {
        address: account ? account : signInAddress,
      })
      .then(res => {})
      .catch(e => {})
  }

  const verifyOTP = code => {
    setTwoFactorSetUpState({ loading: false, error: '' })
    axios
      .post('/api/accounts/otp/verify', {
        address: account ? account : signInAddress,
        token: code,
      })
      .then(res => {
        setTwoFactorSetUpState({ loading: false, error: '' })
        setActivated(false)
        updateState()
      })
      .catch(e => {
        setTwoFactorSetUpState({ loading: false, error: e.response.data })
      })
  }

  async function generateOtp() {
    try {
      await axios
        .post('/api/accounts/otp/generate', {
          address: account ? account : signInAddress,
        })
        .then(res => {
          const { base32, otpauth_url } = res.data
          setBase32(base32)
          QRCode.toDataURL(otpauth_url).then(data => setqrCodeUrl(data))
        })
    } catch (err) {
      console.log('generate otp error', err?.message)
    }
  }

  const validate2fa = async token => {
    setOtpState({ loading: true, error: '' })

    await axios
      .post('/api/accounts/otp/validate', {
        token,
        address: signInAddress,
      })
      .then(res => {
        updateState()
        setOtpState({ loading: false, error: '' })
        dispatch({ type: 'SET_SIDE_BAR', payload: { sideBar: 'UserAccount' } })
        setProcceed2fa(false)
      })
      .catch(e => {
        setOtpState({ loading: false, error: e.response.data })
      })
  }

  const handleSetUpPassword = opt => {
    setresetPasswordStatus({ loading: true, error: '', success: '' })
    if (opt === 'email') {
      axios
        .post('/api/accounts/get-reset-password-email', {
          email: userMetaData?.email,
        })
        .then(res => {
          setresetPasswordStatus(prev => ({
            ...prev,
            loading: false,
            success: res.data,
          }))
        })
        .catch(e => {
          setresetPasswordStatus(prev => ({
            ...prev,
            loading: false,
            error: e?.response?.data,
          }))
        })
    }
  }

  const [currentObject, setCurrentObejct] = useState({
    amount: '0',
  })

  const withdrawInputs = [
    {
      title: 'Transfer type',
      name: 'transfer',
      type: 'lable-input-select',
      options: [
        {
          name: 'Withdraw to own account',
          value: 'Withdraw to own account',
          svg: (
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g clipPath='url(#clip0_3207_10785)'>
                <path
                  d='M5 19.3787C8.38821 22.7669 16.3689 22.7669 19.7571 19.3787L17.3057 18.7658'
                  stroke='#45F4EA'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M5.57394 9.02661H5.40375C4.70276 9.00544 4.0379 8.71074 3.55144 8.20558C3.06498 7.70041 2.79557 7.0249 2.80086 6.32361C2.80086 4.83195 4.0122 3.62061 5.50386 3.62061C6.21093 3.62403 6.88852 3.90428 7.39144 4.40129C7.89436 4.89831 8.1826 5.57254 8.19438 6.27952C8.20616 6.98649 7.94056 7.66996 7.45448 8.18345C6.9684 8.69695 6.30052 8.99962 5.59396 9.02661H5.57394ZM5.50386 5.12227C4.84313 5.12227 4.30253 5.66287 4.30253 6.32361C4.30253 6.97433 4.81309 7.50492 5.4538 7.52494C5.4538 7.51493 5.51387 7.51493 5.58395 7.52494C6.21465 7.4849 6.7052 6.96432 6.7052 6.32361C6.7052 5.66287 6.16459 5.12227 5.50386 5.12227Z'
                  fill='#45F4EA'
                />
                <path
                  d='M5.50501 16.0342C4.36374 16.0342 3.22247 15.7338 2.33148 15.1432C1.49055 14.5826 1 13.7717 1 12.9107C1 12.0497 1.48053 11.2288 2.33148 10.6682C4.11346 9.4869 6.89655 9.4869 8.66852 10.6682C9.50945 11.2288 10 12.0497 10 12.9007C10 13.7616 9.51947 14.5725 8.66852 15.1432C7.78754 15.7439 6.64627 16.0342 5.50501 16.0342ZM3.1624 11.9196C2.73192 12.2099 2.50167 12.5603 2.50167 12.9107C2.50167 13.2611 2.74194 13.6115 3.1624 13.9018C4.43382 14.7527 6.56618 14.7527 7.8376 13.9018C8.26808 13.6115 8.50834 13.2611 8.49833 12.9107C8.49833 12.5603 8.25806 12.2099 7.8376 11.9196C6.5762 11.0687 4.43382 11.0687 3.1624 11.9196Z'
                  fill='#45F4EA'
                />
                <path
                  d='M18.0832 8.00667H17.8941C17.1153 7.98315 16.3765 7.65571 15.836 7.09441C15.2955 6.53311 14.9962 5.78255 15.002 5.00334C15.002 3.34594 16.348 2 18.0054 2C18.791 2.00381 19.5439 2.3152 20.1027 2.86743C20.6615 3.41967 20.9817 4.16882 20.9948 4.95435C21.0079 5.73987 20.7128 6.49928 20.1727 7.06983C19.6326 7.64038 18.8906 7.97669 18.1055 8.00667H18.0832ZM18.0054 3.66852C17.2712 3.66852 16.6706 4.26919 16.6706 5.00334C16.6706 5.72636 17.2379 6.31591 17.9498 6.33815C17.9498 6.32703 18.0165 6.32703 18.0944 6.33815C18.7951 6.29366 19.3402 5.71524 19.3402 5.00334C19.3402 4.26919 18.7395 3.66852 18.0054 3.66852Z'
                  fill='#45F4EA'
                />
                <path
                  d='M18.0056 15.7933C16.7375 15.7933 15.4694 15.4596 14.4794 14.8033C13.5451 14.1804 13 13.2794 13 12.3228C13 11.3661 13.5339 10.454 14.4794 9.83111C16.4594 8.51854 19.5517 8.51854 21.5206 9.83111C22.455 10.454 23 11.3661 23 12.3116C23 13.2683 22.4661 14.1693 21.5206 14.8033C20.5417 15.4707 19.2736 15.7933 18.0056 15.7933ZM15.4027 11.2215C14.9244 11.5441 14.6685 11.9334 14.6685 12.3228C14.6685 12.7121 14.9355 13.1014 15.4027 13.424C16.8154 14.3695 19.1846 14.3695 20.5973 13.424C21.0756 13.1014 21.3426 12.7121 21.3315 12.3228C21.3315 11.9334 21.0645 11.5441 20.5973 11.2215C19.1958 10.276 16.8154 10.276 15.4027 11.2215Z'
                  fill='#45F4EA'
                />
              </g>
              <defs>
                <clipPath id='clip0_3207_10785'>
                  <rect width='24' height='24' fill='white' />
                </clipPath>
              </defs>
            </svg>
          ),
        },
      ],
      defaultAny: 'Withdraw to own account',
      onChange: e =>
        setCurrentObejct(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
    {
      title: 'Email or Client ID',
      name: 'clientId',
      type: 'default',
      placeholder: 'Enter',
      onChange: e =>
        setCurrentObejct(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
    {
      title: 'Withdraw amount',
      name: 'amount',
      type: 'default',
      rightText: 'CPL',
      onChange: e =>
        setCurrentObejct(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
  ]

  return (
    <>
      {error === 'no metamask' && (
        <Popup
          popUpElement={<NoMetaMask />}
          label={'Metamask is not installed'}
          handlePopUpClose={() => setError('')}
        />
      )}
      {error === 'Please switch your network in wallet' && (
        <Popup
          popUpElement={
            <ChangeNetwork
              disconnect={() => {
                disconnect()
                setError('')
              }}
              handleNetworkChange={() => console.log('handle network change')}
            />
          }
          handlePopUpClose={() => setError('')}
          label={'Check Your Network'}
        />
      )}
      {twoFactorAuth && activated && (
        <Popup
          popUpElement={
            <TwoFactorAuthentication
              confirmAuth={code => verifyOTP(code)}
              qrcode={qrcodeUrl}
              accountName={'Complend'}
              accountKey={base32}
              twoFactorSetUpState={twoFactorSetUpState}
              onClick={() => setTwoFactorAuth(false)}
            />
          }
          handlePopUpClose={() => setTwoFactorAuth(false)}
        />
      )}
      <SideBar open={appState.sideBarOpen}>
        {sideBar === 'connect' && !account && (
          <Connect
            ConnectOptions={[
              {
                label: 'Metamask',
                svg: <MetaMask />,
                connect: () => connect('metaMask', injected),
              },
              {
                label: 'ConnectWallet',
                svg: <WalletConnect />,
                connect: () => connect('walletConnect', walletConnect),
              },
            ]}
            signIn={handleSignInBar}
            sideBarClose={handleClose}
          />
        )}
        {sideBar === 'connect' && account && (
          <UserOptions
            type={'Metamask'}
            warning={!appState.emailVerified}
            completeAccount={handleUserAccount}
            sideBarClose={handleClose}
            disconnect={disconnect}
            userAccount={handleUserAccount}
            account={account}
          />
        )}
        {sideBar === 'UserAccount' && (
          <UserAccount
            sideBarClose={handleClose}
            goBack={() =>
              dispatch({
                type: 'SET_SIDE_BAR',
                payload: { sideBar: 'connect' },
              })
            }
            personalData={personalData}
            handlePersonalData={handlePersonalData}
            handleSecurityData={handleSecurityData}
            emailVerified={appState.emailVerified}
            personalDataState={personalDataState}
            securityDataState={securityDataState}
            resendEmail={e => resendEmail(e)}
            hasPasswordSet={appState.hasPasswordSet}
            imgValue={`http://localhost:4000/images/${account}.png`}
            twoFactorAuth={twoFactorAuth}
            handleTwoFactorAuth={val => {
              setTwoFactorAuth(val)
              setActivated(val)
              if (!val) disableOTP()
              if (val) {
                generateOtp()
              }
            }}
            handleForgetPassword={() =>
              dispatch({
                type: 'SET_SIDE_BAR',
                payload: { sideBar: 'resetPassword' },
              })
            }
          />
        )}
        {sideBar === 'SignIn' && (
          <SignIn
            onClick={handleLogin}
            sideBarClose={handleClose}
            goBack={() =>
              dispatch({
                type: 'SET_SIDE_BAR',
                payload: { sideBar: 'connect' },
              })
            }
            signInState={signInState}
            otpEnabled={procceed2fa}
            otpState={otpState}
            handleTFA={code => validate2fa(code)}
            resetPasswordState={resetPasswordState}
            handleResetPassword={resetPassword}
          />
        )}
        {sideBar === 'resetPassword' && (
          <ResetPassword
            sideBarClose={handleClose}
            goBack={() =>
              dispatch({
                type: 'SET_SIDE_BAR',
                payload: { sideBar: 'UserAccount' },
              })
            }
            resetPasswordState={resetPasswordStatus}
            handleResetPassword={handleSetUpPassword}
            resetEmail={userMetaData?.email}
          />
        )}
        {sideBar === 'notifications' && <div>notifications</div>}
        {sideBar === 'withdraw' && (
          <TransferFromAcc
            sideBarClose={handleClose}
            inputs={withdrawInputs}
            currentObject={currentObject}
            cardImg={'/img/dashboard/cpl.png'}
          />
        )}
      </SideBar>
    </>
  )
}

export default SideBarRight
