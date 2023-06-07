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
  Exchange,
  Deposit,
} from '@cubitrix/cubitrix-react-ui-module'

import { MetaMask, WalletConnect } from '../../../assets/svg'

import { useConnect, useStake } from '@cubitrix/cubitrix-react-connect-module'

import { injected, walletConnect } from '../../../connector'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useTableParameters } from '../../../hooks/useTableParameters'

const SideBarRight = () => {
  const appState = useSelector(state => state.appState)
  const userMetaData = useSelector(state => state.appState.userData?.meta)
  const sideBar = useSelector(state => state.appState.sideBar)
  const account = useSelector(state => state.connect.account)

  const [personalData, setPersonalData] = useState(null)
  const { connect, disconnect, error, setError } = useConnect()

  var Router = '0xd472C9aFa90046d42c00586265A3F62745c927c0' // Staking contract Address
  var tokenAddress = '0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb' // Staking Token Address
  const { approve, stake, handleTimeperiodDate, handleDepositAmount, handleTimePeriod } = useStake({
    Router,
    tokenAddress,
  })

  const { depositAmount, timeperiod, isAllowance, loading, timeperiodDate } = useSelector(state => state.stake)

  const balance = useSelector(state => state.appState?.userData?.balance)

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

  const [success, setSuccess] = useState(null)
  const [helpText, setHelpText] = useState('')
  const [showHelpText, setShowHelpText] = useState(false)
  const [currentObject, setCurrentObject] = useState({
    amount: '0',
    transfer_amount: '0',
    receive_amount: '0',
    transfer: '',
    clientId: '',
  })

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

  const { durationOptions } = useTableParameters('staking')

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
        setCurrentObject(prev => ({
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
        setCurrentObject(prev => ({
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
        setCurrentObject(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
  ]

  const exchangeInputs = [
    {
      title: 'Transfer amount',
      name: 'transfer_amount',
      type: 'default',
      rightText: 'CPL',
      onChange: e =>
        setCurrentObject(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
    {
      title: 'Receive amount',
      name: 'receive_amount',
      type: 'default',
      rightText: 'BTC',
      onChange: e =>
        setCurrentObject(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
  ]

  const depositInputs = [
    {
      title: 'Amount',
      name: 'amount',
      type: 'default',
      placeholder: '0',
      onChange: e => {
        handleDepositAmount(e.target.value)
        setCurrentObject(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        }))
      },
    },
  ]

  const exchangeAccounts = [
    {
      svg: (
        <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g opacity='0.1' filter='url(#filter0_b_3211_11395)'>
            <rect width='32' height='32' rx='16' fill='white' />
          </g>
          <path
            d='M21.9191 14.4594C22.1646 12.78 20.8856 11.8757 19.1351 11.2685L19.7035 8.99475L18.3212 8.64594L17.7657 10.8421C17.404 10.7453 17.0293 10.6613 16.6547 10.5773L17.2102 8.34235L15.8279 8L15.2595 10.2737L14.381 10.067L12.4431 9.58256L12.0943 11.0618C12.0943 11.0618 13.1214 11.3008 13.102 11.3137C13.2911 11.341 13.4624 11.4402 13.5803 11.5906C13.6982 11.7409 13.7536 11.9309 13.735 12.1211L13.0891 14.7049C13.1382 14.7138 13.186 14.729 13.2312 14.7501L13.0891 14.7243L12.1912 18.3351C12.1707 18.3993 12.1377 18.4588 12.094 18.5102C12.0504 18.5616 11.997 18.6038 11.9369 18.6345C11.8769 18.6651 11.8113 18.6835 11.7441 18.6887C11.6769 18.6938 11.6093 18.6856 11.5453 18.6645L10.5376 18.4126L9.85938 20.0275L11.6616 20.4732L12.6498 20.7315L12.075 23.0311L13.4637 23.3799L14.0322 21.0997C14.4068 21.2031 14.775 21.3 15.1367 21.3839L14.5683 23.6577L15.9571 24L16.532 21.7004C18.8961 22.1461 20.6725 21.9717 21.4217 19.8272C22.0225 18.109 21.4217 17.1143 20.1299 16.4683C20.6072 16.3761 21.0409 16.1295 21.3643 15.7665C21.6876 15.4035 21.8826 14.9442 21.9191 14.4594ZM18.7475 18.8971C18.3212 20.6217 15.4209 19.6916 14.4843 19.459L15.2401 16.3973C16.1832 16.6169 19.1932 17.082 18.7475 18.8712V18.8971ZM19.1803 14.4336C18.7863 15.9968 16.3769 15.2023 15.5889 15.0085L16.28 12.218C17.0616 12.4118 19.5873 12.7735 19.1803 14.4078V14.4336Z'
            fill='white'
          />
          <defs>
            <filter
              id='filter0_b_3211_11395'
              x='-40'
              y='-40'
              width='112'
              height='112'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='20' />
              <feComposite in2='SourceAlpha' operator='in' result='effect1_backgroundBlur_3211_11395' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_backgroundBlur_3211_11395' result='shape' />
            </filter>
          </defs>
        </svg>
      ),
      title: 'BTC',
      value: '0.000000 BTC',
      price: '$0.00',
    },
    {
      svg: (
        <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g opacity='0.1' filter='url(#filter0_b_3211_11461)'>
            <path
              d='M16 0C7.1639 0 7.62939e-05 7.16382 7.62939e-05 16C7.62939e-05 24.8361 7.16422 31.9999 16 31.9999C24.8359 31.9999 32 24.838 32 16C32 7.1619 24.8371 0 16 0Z'
              fill='white'
            />
          </g>
          <path
            d='M14.5725 15.0369V13.0411H10.0084V10H22.4367V13.0411H17.872V15.0353C21.5817 15.2057 24.3711 15.9404 24.3711 16.8206C24.3711 17.7007 21.5804 18.4354 17.872 18.6069V25H14.5715V18.6064C10.8684 18.4354 8.08469 17.7013 8.08469 16.8219C8.08469 15.9426 10.8684 15.2084 14.5715 15.0375M14.5715 18.0648V18.0632C14.6646 18.0691 15.143 18.0979 16.2083 18.0979C17.06 18.0979 17.6592 18.0737 17.8704 18.0627V18.0654C21.1478 17.9202 23.5943 17.3495 23.5943 16.6665C23.5943 15.9836 21.1476 15.4137 17.8704 15.2682V17.4968C17.6557 17.5115 17.0418 17.5478 16.1944 17.5478C15.1765 17.5478 14.6648 17.5054 14.5709 17.4968V15.2682C11.2999 15.414 8.85911 15.9852 8.85911 16.6657C8.85911 17.3462 11.301 17.9178 14.5709 18.0635'
            fill='white'
          />
          <defs>
            <filter
              id='filter0_b_3211_11461'
              x='-40'
              y='-40'
              width='112'
              height='112'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='20' />
              <feComposite in2='SourceAlpha' operator='in' result='effect1_backgroundBlur_3211_11461' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_backgroundBlur_3211_11461' result='shape' />
            </filter>
          </defs>
        </svg>
      ),
      title: 'USDT',
      value: '0.000000 USDT',
      price: '$0.00',
    },
    {
      svg: (
        <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g opacity='0.1' filter='url(#filter0_b_3211_11422)'>
            <rect width='32' height='32' rx='16' fill='white' />
          </g>
          <path d='M15.998 7.52954V13.7918L21.291 16.157L15.998 7.52954Z' fill='white' fillOpacity='0.6' />
          <path d='M15.9968 7.52954L10.7031 16.157L15.9968 13.7918V7.52954Z' fill='white' />
          <path d='M15.998 20.2154V24.4705L21.2945 17.1428L15.998 20.2154Z' fill='white' fillOpacity='0.6' />
          <path d='M15.9968 24.4705V20.2147L10.7031 17.1428L15.9968 24.4705Z' fill='white' />
          <path d='M15.998 19.23L21.291 16.1567L15.998 13.793V19.23Z' fill='white' fillOpacity='0.4' />
          <path d='M10.7031 16.1567L15.9968 19.23V13.793L10.7031 16.1567Z' fill='white' fillOpacity='0.6' />
          <defs>
            <filter
              id='filter0_b_3211_11422'
              x='-40'
              y='-40'
              width='112'
              height='112'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='20' />
              <feComposite in2='SourceAlpha' operator='in' result='effect1_backgroundBlur_3211_11422' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_backgroundBlur_3211_11422' result='shape' />
            </filter>
          </defs>
        </svg>
      ),

      title: 'ETH',
      value: '0.000000 ETH',
      price: '$0.00',
    },
    {
      svg: (
        <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g opacity='0.1' filter='url(#filter0_b_3211_11435)'>
            <rect width='32' height='32' rx='16' fill='white' />
          </g>
          <path
            d='M9.87559 19.5447C9.29186 18.4714 9 17.282 9 15.9765C9 14.6709 9.30442 13.4846 9.91325 12.4176C10.5284 11.3506 11.3726 10.5158 12.4459 9.91325C13.5254 9.30442 14.7274 9 16.0518 9C17.2883 9 18.4149 9.26048 19.4317 9.78144C20.4486 10.2961 21.3022 11.0054 21.9926 11.9092L19.9684 13.3968C19.529 12.7754 18.961 12.2827 18.2643 11.9186C17.5676 11.5546 16.8175 11.3726 16.0141 11.3726C15.4241 11.3726 14.8624 11.4824 14.3288 11.7021C13.8016 11.9155 13.3371 12.2168 12.9354 12.6059C12.54 12.9951 12.223 13.4815 11.9845 14.0652C11.7523 14.649 11.6362 15.286 11.6362 15.9765C11.6362 16.6606 11.7523 17.2977 11.9845 17.8877C12.223 18.4714 12.5432 18.9641 12.9449 19.3658C13.3466 19.7675 13.8204 20.0814 14.3665 20.3073C14.9126 20.5333 15.4932 20.6463 16.1083 20.6463C16.6794 20.6463 17.2035 20.5584 17.6806 20.3826C18.1576 20.2006 18.553 19.9621 18.8668 19.6671C19.1807 19.3658 19.4317 19.0332 19.62 18.6691C19.8146 18.2988 19.9433 17.9097 20.0061 17.5017H15.5151V15.2609H22.5104V22.7458H20.0061V21.2206C19.4725 21.8106 18.848 22.2562 18.1325 22.5575C17.4169 22.8525 16.6669 23 15.8823 23C14.5705 23 13.3874 22.6924 12.3329 22.0773C11.2784 21.456 10.4593 20.6117 9.87559 19.5447Z'
            fill='white'
          />
          <defs>
            <filter
              id='filter0_b_3211_11435'
              x='-40'
              y='-40'
              width='112'
              height='112'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='20' />
              <feComposite in2='SourceAlpha' operator='in' result='effect1_backgroundBlur_3211_11435' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_backgroundBlur_3211_11435' result='shape' />
            </filter>
          </defs>
        </svg>
      ),
      title: 'GOLD',
      value: '0.000000 G',
      price: '$0.00',
    },
    {
      svg: (
        <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g opacity='0.1' filter='url(#filter0_b_3211_11448)'>
            <rect width='32' height='32' rx='16' fill='white' />
          </g>
          <path
            d='M11 23V9H16.9456C18.1692 9 19.1976 9.4133 20.0307 10.2399C20.8638 11.0665 21.2803 12.0818 21.2803 13.2859C21.2803 14.08 21.0916 14.8089 20.7141 15.4728C20.3366 16.1302 19.8159 16.6509 19.152 17.0349C18.4881 17.4124 17.7527 17.6011 16.9456 17.6011H13.7043V23H11ZM16.7015 11.3626H13.7043V15.3068H16.7015C17.2613 15.3068 17.7104 15.1213 18.0488 14.7503C18.3938 14.3728 18.5662 13.8977 18.5662 13.325C18.5662 12.7522 18.3938 12.2836 18.0488 11.9191C17.7104 11.5481 17.2613 11.3626 16.7015 11.3626Z'
            fill='white'
          />
          <defs>
            <filter
              id='filter0_b_3211_11448'
              x='-40'
              y='-40'
              width='112'
              height='112'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='20' />
              <feComposite in2='SourceAlpha' operator='in' result='effect1_backgroundBlur_3211_11448' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_backgroundBlur_3211_11448' result='shape' />
            </filter>
          </defs>
        </svg>
      ),
      title: 'PLATINUM',
      value: '0.000000 P',
      price: '$0.00',
    },
  ]

  const handleDepositSubmit = async () => {
    setSuccess(null)
    setHelpText('')
    setShowHelpText(false)

    if (depositAmount < 1 && currentObject?.amount === '0') {
      setHelpText('Please enter valid amount to stake.')
      setShowHelpText(true)
      setSuccess(false)
      setTimeout(() => {
        setSuccess(null)
        setHelpText('')
        setShowHelpText(false)
      }, 3000)
    }

    if (account && isAllowance) {
      approve(() => {
        setSuccess(true)
        setHelpText('Approved successfully, please stake desired amount.')
        setShowHelpText(true)
      })
    }
    if (account && !isAllowance) {
      stake(async () => {
        await axios
          .post('/api/accounts/activate-account', {
            address: account,
          })
          .then(res => {
            if (res.data?.account) {
              dispatch({
                type: 'SET_SYSTEM_ACCOUNT_DATA',
                payload: res.data.account,
              })
              setSuccess(true)
              setHelpText('Staking was successful.')
              setShowHelpText(true)
              setTimeout(() => {
                setSuccess(null)
                setHelpText('')
                setShowHelpText(false)
                setCurrentObject(prev => ({ ...prev, amount: '0' }))
                handleDepositAmount(0)
              }, 3000)
            }
          })
          .catch(e => {})
      })
    }
  }

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
            handleSubmit={handleClose}
            buttonLabel={'Continue'}
            success={true}
            helpText={'hi'}
            showHelpText={false}
            accountType={'CPL'}
            accountBalance={'1,400.00'}
            accountBalanceSecond={'$2,034.04'}
          />
        )}
        {sideBar === 'exchange' && (
          <Exchange
            sideBarClose={handleClose}
            inputs={exchangeInputs}
            currentObject={currentObject}
            cardImg={'/img/dashboard/cpl.png'}
            accounts={exchangeAccounts}
            handleSubmit={handleClose}
            buttonLabel={'Continue'}
            success={true}
            helpText={'hi'}
            showHelpText={false}
            accountType={'CPL'}
            accountBalance={'1,400.00'}
            accountBalanceSecond={'$2,034.04'}
          />
        )}
        {sideBar === 'deposit' && (
          <Deposit
            sideBarClose={handleClose}
            inputs={depositInputs}
            currentObject={currentObject}
            cardImg={'/img/dashboard/cpl.png'}
            handleSubmit={handleDepositSubmit}
            buttonLabel={loading ? 'Loading' : 'Stake'}
            success={success}
            helpText={helpText}
            showHelpText={showHelpText}
            accountType={'CPL'}
            accountBalance={balance}
            accountBalanceSecond={`$${balance * 2}`}
            durationOptions={durationOptions}
            timeperiod={timeperiod}
            timeperiodDate={timeperiodDate}
            handleTimePeriod={handleTimePeriod}
            handleTimeperiodDate={handleTimeperiodDate}
          />
        )}
      </SideBar>
    </>
  )
}

export default SideBarRight
