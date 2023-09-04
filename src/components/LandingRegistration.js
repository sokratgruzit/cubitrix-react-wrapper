import {
  Button,
  HelpText,
  LandingSteps,
  Popup,
} from "@cubitrix/cubitrix-react-ui-module";
import React, { useState, useEffect, useMemo } from "react";

import {
  useConnect,
  //  useStake
} from "@cubitrix/cubitrix-react-connect-module";
// import { useConnect } from "../hooks/use-connect";

import { WalletConnectV2Connector } from "../utils/walletconnectV2Connector";

import { useStake } from "../hooks/use-stake";
import { injected } from "../connector";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useTableParameters } from "../hooks/useTableParameters";

import axios from "../api/axios";
import QRCode from "qrcode";
import WBNB from "../abi/WBNB.json";

import { toast } from "react-toastify";

const LandingRegistration = ({ step, setStep, setInitialRegister }) => {
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const appState = useSelector((state) => state.appState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account, connect, disconnect, library, active } = useConnect();

  // const [loading, setLoading] = useState(true);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [hostedUrl, setHostedUrl] = useState("");
  const [amountError, setAmountError] = useState("");

  const [receivePaymentAddress, setReceivePaymentAddress] = useState(
    "0x43f59F41518903A274c7897dfFB24DB86a0dd23a",
  );
  const mainAccount = useMemo(
    () => appState?.accountsData?.find((acc) => acc?.account_category === "main"),
    [appState?.accountsData],
  );

  const [referralCodeAlreadyUsed, setReferralCodeAlreadyUsed] = useState(false);
  const [savedBeforeStakingValues, setSavedBeforeStakingValues] = useState({});

  const [tokenBalance, setTokenBalance] = useState(0);

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
    // {
    //   id: "Manual",
    //   title: "Manual",
    //   logo: "https://shopgeorgia.ge/assets/images/pay-manual.png",
    // },
    {
      id: "Coinbase",
      title: "Coinbase",
      logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
    },
  ];

  const paymentTypes = [
    // {
    //   id: 1,
    //   title: "Pay via Crypto",
    //   logo: "https://shopgeorgia.ge/assets/images/pay-manual.png",
    // },
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

  useEffect(() => {
    if (account && triedReconnect && active) {
      setRegistrationState({
        loading: false,
        fullnameError: "",
        emailError: "",
        referralError: "",
        emailSent: false,
      });
    }
  }, [account, triedReconnect, active]);

  async function handleRegistration({ fullName, email, referral }) {
    const errors = {};
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!fullName) {
      errors.fullNameError = "Full Name is required";
    }

    if (email && !emailRegex.test(email)) {
      errors.emailError = "Invalid email";
    }

    if (!email) {
      errors.emailError = "Email is required";
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

    const checkEmail = async () => {
      try {
        const res = await axios.post("/api/accounts/check-email", {
          email: email,
        });
        let { status, msg } = res?.data;

        if (!status) {
          setRegistrationState({
            ...registrationState,
            emailError: msg,
          });
          setRegistrationState({
            ...registrationState,
            emailError: msg,
            loading: false,
          });
          return false;
        }
        return true;
      } catch (e) {
        setRegistrationState({
          ...registrationState,
          loading: false,
        });
        return false;
      }
    };

    const emailIsValid = await checkEmail();
    console.log(emailIsValid);
    if (!emailIsValid) {
      return;
    }

    update_profile();
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
          getBalance().then((balance) => {
            let step = 3;
            setTokenBalance(balance);
            if (balance >= 100) {
              step = 4;
            }
            axios
              .post("/api/accounts/handle-step", { step, address: account })
              .then((e) => {
                setStep(e?.data?.account?.step ?? 3);
                setRegistrationState({
                  ...registrationState,
                  loading: false,
                });
              })
              .catch((e) => {
                setRegistrationState({
                  ...registrationState,
                  loading: false,
                });
                toast.error("Something went wrong!", { autoClose: 8000 });
              });
          });
        })
        .catch((err) => {
          if (err?.response?.data === "email already exists & is verified") {
            setRegistrationState((prev) => ({
              ...prev,
              loading: false,
            }));
            toast.error("Email is already in use.", { autoClose: 8000 });
          }
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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    // referral: "",
  });

  useEffect(() => {
    if (appState?.userData) {
      setFormData({
        fullName: appState?.userData?.meta?.name ?? "",
        email: appState?.userData?.meta?.email ?? "",
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

  const [coinbaseLoading, setCoinbaseLoading] = useState(false);
  async function handleCoindbasePayment(amount) {
    const buyAmount = (Number(amount) - 1) / 2;

    if (buyAmount < 100) {
      toast.error("Minimum amount is 100", { autoClose: 8000 });
      setStakingLoading(false);
      return;
    }
    if (buyAmount > 500000) {
      toast.error("Maximum amount is 500000", { autoClose: 8000 });
      setStakingLoading(false);
      return;
    }

    if (
      (buyAmount > 500 && buyAmount < 5000) ||
      (buyAmount > 500 && buyAmount % 5000 !== 0)
    ) {
      toast.error("Amount higher than 500 should be multiple of 5000", {
        autoClose: 8000,
      });
      setStakingLoading(false);
      return;
    }

    setCoinbaseLoading(true);

    axios
      .post("api/transactions/coinbase_deposit_transaction", {
        from: account,
        amount,
      })
      .then((res) => {
        setHostedUrl(res?.data?.responseData?.hosted_url);
        setCoinbaseLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong!", { autoClose: 8000 });
        setCoinbaseLoading(false);
      });
  }

  async function handlePurchaseEvent(method, amount) {
    if (method === "Coinbase") {
      handleCoindbasePayment(amount);
    }
  }

  const { durationOptions } = useTableParameters("staking");

  var tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb"; // Staking Token Address
  var Router = "0xd472C9aFa90046d42c00586265A3F62745c927c0"; // Staking contract Address
  const { approve, stake, handleTimeperiodDate, handleDepositAmount, handleTimePeriod } =
    useStake({
      Router,
      tokenAddress,
    });

  const { depositAmount, timeperiod, isAllowance, timeperiodDate } = useSelector(
    (state) => state.stake,
  );

  const inputs = [
    {
      title: "Amount",
      name: "amount",
      type: "default",
      placeholder: "0",
      onChange: (e) => {
        handleDepositAmount(e.target.value);
      },
    },
  ];

  function amountProgressOnchange(e) {
    const originalValue = e.target.value;
    let value = parseInt(originalValue);

    if (originalValue !== value.toString()) {
      setAmountError("Please enter a valid number");
    } else if (value < 0) {
      setAmountError("Please enter a positive number");
    } else if (value < 100) {
      setAmountError("Minimum amount is 100");
    } else if (value >= 100 && value <= 500) {
      setAmountError("");
    } else if (value > 500 && value % 5000 !== 0) {
      setAmountError("Above 500, the amount must be a multiple of 5000");
    } else if (value > 500000) {
      setAmountError("Maximum limit is 500,000");
    } else {
      setAmountError("");
    }

    handleDepositAmount(value);
  }

  useEffect(() => {
    if (step !== 3 && step !== 4) {
      return;
    }

    let timer;
    let count = 0;

    const myFunction = () => {
      if (library) {
        getBalance().then((balance) => {
          setTokenBalance(balance);
          if (balance >= 100 && step === 3) {
            clearInterval(timer);
            axios
              .post("/api/accounts/handle-step", { step: 4, address: account })
              .then((e) => {
                setStep(appState?.userData?.step > 4 ? appState?.userData?.step : 4);
                setRegistrationState({
                  ...registrationState,
                  loading: false,
                });
              })
              .catch((e) => {
                setRegistrationState({
                  ...registrationState,
                  loading: false,
                });
                toast.error("Something went wrong!", { autoClose: 8000 });
              });
          }
        });

        count++;
      }
      if (count >= 30) {
        clearInterval(timer);
      }
    };

    myFunction();

    timer = setInterval(myFunction, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [step, library]); // Add step as a dependency

  const updateState = async (callback) => {
    await axios
      .post("/api/accounts/get_account", {})
      .then((res) => {
        let exts1 = res.data.data?.accounts?.[0].extensions;
        if (res.data.data?.accounts?.[0]?.active) {
          exts1.dashboard = "true";
        }

        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.data.accounts[0],
        });
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: exts1,
        });
        dispatch({
          type: "SET_EXTENSIONS_LOADED",
          payload: true,
        });
        dispatch({
          type: "SET_ACCOUNTS_DATA",
          payload: res.data.data.accountBalances,
        });
        if (callback) callback();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [stakingLoading, setStakingLoading] = useState(false);
  const [approveResonse, setApproveResonse] = useState(null);

  const [referralState, setReferralState] = useState({
    value: "",
    loading: false,
    message: "",
    status: "",
  });

  async function activateAccount() {
    axios
      .post(
        "/api/accounts/activate-account",
        {
          address: account,
        },
        {
          timeout: 120000,
        },
      )
      .then((res) => {
        if (res.data?.account) {
          dispatch({
            type: "SET_SYSTEM_ACCOUNT_DATA",
            payload: res.data.account,
          });
          setTimeout(() => {
            handleDepositAmount(0);
          }, 3000);
        }
      })
      .catch((e) => {});
  }

  const handleDepositSubmit = async () => {
    setStakingLoading(true);

    if (!depositAmount && !isAllowance) {
      setApproveResonse({
        status: "error",
        message: "Please enter a valid amount",
      });
      setTimeout(() => {
        setStakingLoading(false);
        setApproveResonse(null);
      }, 3000);
      return;
    }

    if (account && isAllowance) {
      approve(
        () => {
          setStakingLoading(false);
          toast.success("Approved successfully, please stake desired amount.", {
            autoClose: 8000,
          });
        },
        () => {
          setStakingLoading(false);
          toast.error("Approval failed, please try again.", { autoClose: 8000 });
        },
      );
    }
    if (account && !isAllowance) {
      const buyAmount = Number(depositAmount);
      if (buyAmount < 100) {
        toast.error("Minimum amount is 100", { autoClose: 8000 });
        setStakingLoading(false);
        return;
      }
      if (buyAmount > 500000) {
        toast.error("Maximum amount is 500000", { autoClose: 8000 });
        setStakingLoading(false);
        return;
      }

      if (
        (buyAmount > 500 && buyAmount < 5000) ||
        (buyAmount > 500 && buyAmount % 5000 !== 0)
      ) {
        toast.error("Amount higher than 500 should be multiple of 5000", {
          autoClose: 8000,
        });
        setStakingLoading(false);
        return;
      }

      if (buyAmount > 500 && !referralState.value) {
        setReferralState({
          ...referralState,
          message: "empty",
          status: "",
        });
        toast.error("Please enter referral code", {
          autoClose: 8000,
        });
        setStakingLoading(false);
        return;
      }

      setSavedBeforeStakingValues({ buyAmount, referralValue: referralState.value });
      proceedStake(referralState.value);

      // if (buyAmount > 500 && referralState.value) {
      //   axios
      //     .post("api/referral/register_referral", {
      //       referral_address: referralState.value,
      //       user_address: account,
      //       side: "auto",
      //     })
      //     .then((res) => {
      //       if (res?.data?.auto_place === "code is already used") {
      //         setReferralCodeAlreadyUsed(true);
      //         toast.error("Referral code is already used", {
      //           autoClose: 8000,
      //         });
      //         setStakingLoading(false);
      //       } else {
      // proceedStake();
      //       }
      //     })
      //     .catch((err) => {
      //       if (err?.response?.data) {
      //         toast.error(err?.response?.data, {
      //           autoClose: 8000,
      //         });
      //         setStakingLoading(false);
      //         return;
      //       }
      //       setStakingLoading(false);
      //       toast.error("something went wrong", { autoClose: 8000 });
      //     });
      // } else {
      //   proceedStake();
      // }
    }
  };

  async function handleAfterStake() {
    setStep(5);
    axios
      .post("/api/accounts/handle-step", {
        address: account,
        step: 5,
      })
      .then((res) => {
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: { dashboard: "true" },
        });
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post("/api/accounts/manage_extensions", {
        address: account,
        extensions: { staking: "true", trade: "true" },
        setup: true,
      })
      .then((res) => {
        if (res?.data?.account) {
          dispatch({
            type: "UPDATE_ACTIVE_EXTENSIONS",
            payload: res.data.account.extensions,
          });
        }
        activateAccount();
      })
      .catch((e) => {
        activateAccount();
        console.log(e.response);
      });
    updateState();
    setStakingLoading(false);
    toast.success("Staked successfully", { autoClose: 8000 });
    handleDepositAmount("");
    handleTimePeriod(0);
  }

  async function proceedStake(referralCode) {
    stake(
      async () => {
        const buyAmount = Number(depositAmount);
        if (buyAmount > 500) {
          await axios
            .post("api/referral/register_referral", {
              referral_address: referralCode,
              user_address: account,
              side: "auto",
            })
            .then((res) => {
              // if (res?.data?.auto_place === "code is already used") {
              //   setReferralCodeAlreadyUsed(true);
              //   toast.error("Referral code is already used", {
              //     autoClose: 8000,
              //   });
              //   setStakingLoading(false);
              // } else {
              handleAfterStake();
              // }
            })
            .catch((err) => {
              if (err?.response?.data) {
                toast.error(err?.response?.data, {
                  autoClose: 8000,
                });

                setStakingLoading(false);
                return;
              }
              setStakingLoading(false);
              toast.error("something went wrong", { autoClose: 8000 });
            });
        } else {
          handleAfterStake();
        }
      },
      () => {
        setStakingLoading(false);
        toast.error("Staking failed, please try again.", { autoClose: 8000 });
      },
    );
  }

  async function handleAutomaticReferral() {
    try {
      const parts = referralState?.value?.split("_");
      const firstPart = parts[0];
      setReferralState((prev) => ({
        ...prev,
        value: firstPart,
      }));
      setReferralCodeAlreadyUsed(false);

      // setStakingLoading(true);
      // axios
      //   .post("api/referral/register_referral", {
      //     referral_address: firstPart,
      //     user_address: account,
      //     side: "auto",
      //   })
      //   .then((res) => {
      // setReferralCodeAlreadyUsed(false);
      //     // handleAfterStake();
      //   })
      //   .catch((err) => {
      //     if (err?.response?.data) {
      //       toast.error(err?.response?.data, {
      //         autoClose: 8000,
      //       });
      //       setStakingLoading(false);
      //       return;
      //     }
      //     setStakingLoading(false);
      //     toast.error("something went wrong", { autoClose: 8000 });
      //   });
    } catch (e) {
      // toast.error(e?.response?.data, {
      //   autoClose: 8000,
      // });
    }
  }

  const [referralCodeChecked, setReferralCodeChecked] = useState(false);
  const [checkReferralCodeState, setCheckReferralCodeState] = useState({
    loading: false,
    message: "Referral code is required, please check referral code before staking",
    status: "warning",
  });

  async function handlePersonalSign() {
    dispatch({
      type: "SET_METAMASK_CONNECT_LOADING",
      payload: true,
    });
    dispatch({
      type: "SET_ATTEMPT_SIGN",
      payload: {},
    });
  }

  async function logout() {
    dispatch({ type: "SET_LOGOUT_WITH_EMAIL" });
    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: false },
    });
    disconnect();
    dispatch({
      type: "SET_LAST_CONNECTION_TYPE",
      payload: "",
    });
    localStorage.removeItem("walletconnect");
    axios
      .post("/api/accounts/logout", {})
      .then((res) => {
        navigate("/");
      })
      .catch((e) => {});
  }

  useEffect(() => {
    if (!referralState.value) {
      setCheckReferralCodeState((prev) => ({
        ...prev,
        loading: false,
        status: "warning",
        message: "Referral code is required, please check referral code before staking",
      }));
      setReferralCodeChecked(false);
      return;
    }
    setCheckReferralCodeState((prev) => ({
      ...prev,
      loading: true,
    }));
    axios
      .post("/api/referral/check_referral_available", {
        referral_address: referralState.value,
        user_address: account,
      })
      .then((res) => {
        setTimeout(() => {
          setCheckReferralCodeState((prev) => ({
            ...prev,
            loading: false,
            status: "success",
            message: "This referral code is available.",
          }));
          setReferralCodeChecked(true);
        }, 500);
      })
      .catch((e) => {
        let message =
          "Referral code is required, please check referral code before staking";
        if (e?.response?.data?.message === "no space") {
          // message = "Binary spot for the referral code you entered is already taken.";
          setReferralCodeAlreadyUsed(true);
          return;
        }
        setTimeout(() => {
          setCheckReferralCodeState((prev) => ({
            ...prev,
            loading: false,
            status: "warning",
            message: message,
          }));
          setReferralCodeChecked(false);
        }, 500);
      });
  }, [referralState.value, mainAccount, account]);

  console.log(tokenBalance < depositAmount, tokenBalance, depositAmount);
  return (
    <>
      <LandingSteps
        account={account}
        amountError={amountError}
        receivePaymentAddress={receivePaymentAddress}
        handleMetamaskConnect={async () => {
          await connect("metaMask", injected, handlePersonalSign);
        }}
        handleWalletConnect={async () => {
          const walletConnect = new WalletConnectV2Connector({
            projectId: "6b63a429a76c4699c8e90bd36a1c93b0",
            showQrModal: true,
            chains: [97],
            rpcMap: {
              97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            },
          });

          await connect("walletConnect", walletConnect, handlePersonalSign);
        }}
        connectionLoading={appState?.metaMaskConnectionLoading}
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
        disconnect={() => {
          logout();
        }}
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
        buttonLabel={stakingLoading ? "Loading..." : isAllowance ? "Enable" : "Stake"}
        handleSubmit={() => handleDepositSubmit()}
        inputs={inputs}
        stakingLoading={stakingLoading}
        approveResonse={approveResonse}
        isAllowance={isAllowance}
        tokenBalance={tokenBalance}
        depositAmount={depositAmount}
        coinbaseLoading={coinbaseLoading}
        referralState={referralState}
        setReferralState={setReferralState}
        amountProgressOnchange={amountProgressOnchange}
        amountProgressValue={depositAmount}
        referralCodeChecked={referralCodeChecked}
        checkReferralCodeState={checkReferralCodeState}
        handleFinish={() => {
          axios
            .post("/api/accounts/handle-step", {
              active: true,
              address: account,
              step: 6,
            })
            .then((res) => {
              let sendObj = { dashboard: "true" };
              if (
                res?.data?.account?.tier?.value !== "Novice Navigator" &&
                res?.data?.account?.tier?.value
              ) {
                sendObj.referral = "true";
              }

              dispatch({
                type: "UPDATE_ACTIVE_EXTENSIONS",
                payload: sendObj,
              });
              setStep(6);
              updateState();
              setTimeout(() => {
                navigate("/dashboard");
              }, 3000);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      />
      {referralCodeAlreadyUsed && (
        <Popup
          popUpElement={
            <div className="confirm-list">
              <p>Binary spot for the referral code you entered is already taken.</p>
              <p>
                You can either provide new code with different spot or click "Auto Place"
                for auto binary positioning.
              </p>
              {/* <div className="confirm-list-item">
                <span>From Account:</span>
              </div>
              <div className="confirm-list-item">
                <span>From Amount:</span>
              </div>
              <div className="confirm-list-item">
                <span>To Account:</span>
              </div>
              <div className="confirm-list-item">
                <span>To Amount:</span>
              </div> */}
              <Button
                element={"button"}
                size={"btn-lg"}
                type={"btn-primary"}
                label={"Auto Place"}
                active={true}
                customStyles={{
                  width: "100%",
                }}
                onClick={() => {
                  handleAutomaticReferral();
                }}
              />
            </div>
          }
          label={"Referral code is already used"}
          handlePopUpClose={() => setReferralCodeAlreadyUsed(false)}
        />
      )}
    </>
  );
};

export default LandingRegistration;
