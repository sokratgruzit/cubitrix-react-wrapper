import { LandingSteps } from "@cubitrix/cubitrix-react-ui-module";
import React, { useState, useEffect } from "react";

import { useConnect, useStake } from "@cubitrix/cubitrix-react-connect-module";
import { injected, walletConnect } from "../connector";

import { useSelector, useDispatch } from "react-redux";

import { useTableParameters } from "../hooks/useTableParameters";

import axios from "../api/axios";
import QRCode from "qrcode";
import WBNB from "../abi/WBNB.json";

const LandingRegistration = ({ step, setStep, setInitialRegister }) => {
  const account = useSelector((state) => state.connect.account);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const appState = useSelector((state) => state.appState);
  const dispatch = useDispatch();

  const { connect, disconnect, error, setError, connectionLoading, library } =
    useConnect();

  // const [loading, setLoading] = useState(true);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [hostedUrl, setHostedUrl] = useState("");

  const [receivePaymentAddress, setReceivePaymentAddress] = useState(
    "0x43f59F41518903A274c7897dfFB24DB86a0dd23a",
  );

  useEffect(() => {
    if (receivePaymentAddress) {
      QRCode.toDataURL(receivePaymentAddress)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [receivePaymentAddress]);

  useEffect(() => {
    if (hostedUrl) {
      window.location.href = hostedUrl;
    }
  }, [hostedUrl]);

  async function handlePaymentConfirm(userAddress, selectedMethod, amount, date) {
    axios
      .post("api/transactions/pending_deposit_transaction", {
        from: account,
        amount: amount,
        amountTransferedFrom: userAddress,
        receivePaymentAddress: receivePaymentAddress,
        startDate: date,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const methods = [
    {
      id: "Manual",
      title: "Manual",
      logo: "https://shopgeorgia.ge/assets/images/pay-manual.png",
    },
    {
      id: "Coinbase",
      title: "Coinbase",
      logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
    },
  ];

  const paymentTypes = [
    {
      id: 1,
      title: "Pay via Crypto",
      logo: "https://shopgeorgia.ge/assets/images/pay-manual.png",
    },
    {
      id: 2,
      title: "Pay with CoinBase",
      logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
    },
  ];

  const [registrationState, setRegistrationState] = useState({
    loading: false,
    fullnameError: "",
    emailError: "",
    referralError: "",
    emailSent: false,
  });

  async function handleRegistration({ fullName, email, referral }) {
    const errors = {};
    if (!fullName) {
      errors.fullNameError = "Full Name is required";
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email && !emailRegex.test(email)) {
      errors.emailError = "Invalid email";
    }
    if (!email) {
      errors.emailError = "Email is required";
    }
    if (!referral) {
      errors.referralError = "Referral code is required";
    }

    if (Object.keys(errors).length > 0) {
      setRegistrationState({
        ...registrationState,
        ...errors,
      });
      return;
    }

    setRegistrationState({
      ...registrationState,
      loading: true,
    });

    axios
      .post("api/referral/assign_refferal_to_user", {
        referral,
        address: account,
      })
      .then((res) => {
        update_profile();
      })
      .catch((err) => {
        let error = "Referral code could not be assigned";
        if (err?.response?.data === "Referral code doesnot exist") {
          error = "Referral code does not exist";
        }
        let errorsMessages = [
          "User already activated both referral code",
          "User already activated uni level referral code",
          "User already activated binary level referral code",
        ];
        if (errorsMessages.includes(err?.response?.data)) {
          update_profile();
          return;
        }

        setRegistrationState({
          ...registrationState,
          referralError: error,
          loading: false,
        });
      });

    async function update_profile() {
      axios
        .post("/api/accounts/update_profile", {
          address: account,
          name: fullName,
          email,
        })
        .then((res) => {
          if (res?.data === "email sent") {
            setRegistrationState((prev) => ({
              ...prev,
              emailSent: true,
              loading: false,
            }));
          }
          if (res?.data === "account updated") {
            setRegistrationState((prev) => ({
              ...prev,
              loading: false,
            }));
            setStep(3);
          }
        })
        .catch((err) => {
          if (err?.response?.data === "email already exists & is verified") {
            setRegistrationState((prev) => ({
              ...prev,
              emailError: "Email is already in use.",
              loading: false,
            }));
          }

          setTimeout(() => {
            setRegistrationState({
              ...registrationState,
              emailError: "",
            });
          }, 3000);
        });
    }
  }

  async function getBalance() {
    var tokenContract = new library.eth.Contract(WBNB, tokenAddress);
    var decimals = await tokenContract.methods.decimals().call();
    var getBalance = await tokenContract.methods.balanceOf(account).call();

    var pow = 10 ** decimals;
    var balanceInEth = getBalance / pow;

    return balanceInEth;
  }

  const metaAcc = appState?.userData?.meta;
  // useEffect(() => {
  //   if (account && triedReconnect) {
  //     if (metaAcc && metaAcc.email && metaAcc.name) {
  //       setStep(3);
  //     } else {
  //       setStep(2);
  //     }
  //   } else if (!account || !triedReconnect) {
  //     setStep(1);
  //   }
  // }, [account, triedReconnect, appState?.userData?.meta]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    referral: "",
  });

  useEffect(() => {
    if (appState?.userData) {
      setFormData({
        fullName: appState?.userData?.meta?.name ?? "",
        email: appState?.userData?.meta?.email ?? "",
        referral: appState?.userData?.referral?.[0]?.referral ?? "",
      });
    }
  }, [appState?.userData]);

  async function resendEmail() {
    axios
      .post("/api/accounts/resend-email", {
        address: account,
      })
      .then((res) => {
        console.log(res.response);
      })
      .catch((e) => {
        console.log(e.response);
      });
  }

  async function handleCoindbasePayment(amount) {
    axios
      .post("api/transactions/coinbase_deposit_transaction", {
        from: account,
        amount,
      })
      .then((res) => {
        setHostedUrl(res?.data?.responseData?.hosted_url);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function handlePurchaseEvent(method, amount) {
    if (method === "Coinbase") {
      handleCoindbasePayment(amount);
    }
  }

  const [currentObject, setCurrentObject] = useState({
    amount: "",
  });

  const { durationOptions } = useTableParameters("staking");

  var tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb"; // Staking Token Address
  var Router = "0xd472C9aFa90046d42c00586265A3F62745c927c0"; // Staking contract Address
  const { approve, stake, handleTimeperiodDate, handleDepositAmount, handleTimePeriod } =
    useStake({
      Router,
      tokenAddress,
    });

  const { depositAmount, timeperiod, isAllowance, timeperiodDate, loading } = useSelector(
    (state) => state.stake,
  );

  const inputs = [
    {
      title: "Amount",
      name: "amount",
      type: "default",
      placeholder: "0",
      onChange: (e) => {
        console.log(e, "sdddd");
        setCurrentObject((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      },
    },
  ];

  const handleDepositSubmit = async () => {
    if (depositAmount < 1 && currentObject?.amount === "0") {
    }

    if (account && isAllowance) {
      approve(() => {});
    }
    if (account && !isAllowance) {
      stake(async () => {
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
              setTimeout(() => {
                setCurrentObject((prev) => ({ ...prev, amount: "0" }));
                handleDepositAmount(0);
              }, 3000);
            }
          })
          .catch((e) => {});
      });
    }
  };

  return (
    <LandingSteps
      account={account}
      receivePaymentAddress={receivePaymentAddress}
      handleMetamaskConnect={async () => {
        await connect("metaMask", injected);
      }}
      handleWalletConnect={async () => {
        await connect("walletConnect", walletConnect);
      }}
      connectionLoading={connectionLoading}
      step={step}
      setStep={setStep}
      initialLoading={false}
      methods={methods}
      paymentTypes={paymentTypes}
      handleRegistration={handleRegistration}
      registrationState={registrationState}
      setRegistrationState={setRegistrationState}
      handlePaymentConfirm={handlePaymentConfirm}
      handleCoindbasePayment={(amount) => handleCoindbasePayment(amount)}
      formData={formData}
      setFormData={setFormData}
      resendEmail={resendEmail}
      disconnect={disconnect}
      closeLandingSteps={() => setInitialRegister(false)}
      qrcode={qrCodeUrl}
      handlePurchaseEvent={handlePurchaseEvent}
      exchangeRate={2}
      tranasctionFee={1}
      timeperiod={timeperiod}
      timeperiodDate={timeperiodDate}
      handleTimePeriod={handleTimePeriod}
      handleTimeperiodDate={handleTimeperiodDate}
      durationOptions={durationOptions}
      buttonLabel={loading ? "Loading..." : "Top Up"}
      handleSubmit={() => handleDepositSubmit()}
      inputs={inputs}
      currentObject={currentObject}
    />
  );
};

export default LandingRegistration;
