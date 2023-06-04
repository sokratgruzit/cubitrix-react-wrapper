import { LandingSteps } from "@cubitrix/cubitrix-react-ui-module";
import React, { useState, useEffect } from "react";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import QRCode from "qrcode";

import { injected, walletConnect } from "../connector";

const LandingRegistration = ({ step, setStep }) => {
  const account = useSelector((state) => state.connect.account);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const appState = useSelector((state) => state.appState);

  const { connect, disconnect, error, setError, connectionLoading } = useConnect();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

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

  return (
    <LandingSteps
      account={account}
      receivePaymentAddress={"0x43f59F41518903A274c7897dfFB24DB86a0dd23a"}
      handleMetamaskConnect={async () => {
        await connect("metaMask", injected);
      }}
      handleWalletConnect={async () => {
        await connect("walletConnect", walletConnect);
      }}
      connectionLoading={connectionLoading}
      step={step}
      setStep={setStep}
      initialLoading={loading}
      methods={methods}
      paymentTypes={paymentTypes}
      handleRegistration={handleRegistration}
      registrationState={registrationState}
      setRegistrationState={setRegistrationState}
      formData={formData}
      setFormData={setFormData}
      resendEmail={resendEmail}
      disconnect={disconnect}
      qrcode={qrCodeUrl}
      handlePaymentConfirm={handlePaymentConfirm}
      handleCoindbasePayment={(amount) => handleCoindbasePayment(amount)}
    />
  );
};

export default LandingRegistration;
