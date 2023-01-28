import React from "react";
import axios from "../../../api/axios";
import { useSelector, useDispatch } from "react-redux";

import {
  Connect,
  SideBar,
  UserAccount,
  UserOptions,
  SignIn,
  TwoFactorVerification,
} from "@cubitrix/cubitrix-react-ui-module";

import { MetaMask, WalletConnect } from "../../../assets/svg";

import {
  useConnect,
  injected,
  WalletConnect as WalletConnectSetting,
} from "@cubitrix/cubitrix-react-connect-module";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const SideBarRight = () => {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const emailVerified = useSelector((state) => state.appState.emailVerified);
  const hasPasswordSet = useSelector((state) => state.appState.hasPasswordSet);
  const userMetaData = useSelector((state) => state.appState.userData?.meta[0]);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const account = useSelector((state) => state.connect.account);
  const [personalData, setPersonalData] = useState(null);
  const { connect, disconnect } = useConnect();
  const dispatch = useDispatch();

  const [personalDataState, setPersonalDataState] = useState({
    emailSent: false,
    loading: false,
    saved: false,
    error: "",
  });

  const [securityDataState, setSecurityDataState] = useState({
    emailSent: false,
    loading: false,
    saved: false,
    error: "",
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [base32, setBase32] = useState("");
  const [qrcodeUrl, setqrCodeUrl] = useState("sdd");

  const [signInState, setSignInState] = useState({ loading: false, error: false });

  const updateState = () => {
    axios
      .post("/accounts/get_account", {
        address: account,
      })
      .then((res) => {
        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.success.data.accounts[0],
        });
      })
      .catch((e) => {});
  };

  const handleClose = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBarOpen: false } });
  };

  const handleSignInBar = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "SignIn" } });
  };

  const handleUserAccount = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });
  };

  const handleSecurityData = (formData) => {
    setSecurityDataState((prev) => ({ ...prev, loading: true, error: "" }));

    axios
      .post("/accounts/update_profile_auth", { ...formData, address: account })
      .then((res) => {
        setSecurityDataState((prev) => ({ ...prev, loading: false, saved: true }));
        updateState();
        setTimeout(() => {
          setSecurityDataState((prev) => ({ ...prev, saved: false }));
        }, 3000);
      })
      .catch((e) => {
        setSecurityDataState((prev) => ({
          ...prev,
          loading: false,
          error: e?.response?.data,
        }));
      });
  };

  const handlePersonalData = (userData) => {
    let personalData = { ...userData };
    personalData.avatar = account;
    setPersonalDataState((prev) => ({ ...prev, loading: true, error: "" }));
    axios
      .post("/accounts/update_profile", { ...personalData, address: account })
      .then((res) => {
        if (res.data === "email sent") {
          setPersonalDataState((prev) => ({ ...prev, emailSent: true }));
        }
        updateState();
        setPersonalDataState((prev) => ({ ...prev, loading: false, saved: true }));
        setTimeout(() => {
          setPersonalDataState((prev) => ({ ...prev, saved: false }));
        }, 3000);
      })
      .catch((e) => {
        setPersonalDataState((prev) => ({
          ...prev,
          loading: false,
          error: e?.response?.data,
        }));
      });

    let formData = new FormData();
    formData.append("img", userData.avatar);
    formData.append("address", account);

    axios
      .post("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        updateState();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleLogin = ({ email, password }) => {
    if (email && password) {
      setSignInState((prev) => ({ ...prev, loading: true, error: "" }));

      axios
        .post("/accounts/recovery/login", {
          account,
          email,
          password,
        })
        .then((res) => {
          dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });

          setSignInState((prev) => ({ ...prev, loading: false }));
        })
        .catch((e) => {
          setSignInState((prev) => ({ ...prev, loading: false, error: e.response.data }));
        });
    }
  };

  useEffect(() => {
    if (userMetaData) {
      setPersonalData({
        name: userMetaData?.name,
        email: userMetaData?.email,
        mobile: userMetaData?.mobile,
        date_of_birth: new Date(userMetaData.date_of_birth),
        nationality: userMetaData?.nationality,
        avatar: userMetaData?.avatar,
      });
    }
  }, [userMetaData]);

  const disableOTP = () => {
    axios
      .post("/accounts/otp/disable", { address: account })
      .then((res) => {})
      .catch((e) => {});
  };

  const verifyOTP = (code) => {
    console.log(code);
    axios
      .post("/accounts/otp/verify", { address: account, token: code })
      .then((res) => {})
      .catch((e) => {});
  };

  useEffect(() => {
    async function generateOtp() {
      try {
        if (account) {
          await axios.post("/accounts/otp/generate", { address: account }).then((res) => {
            const { base32, otpauth_url } = res.data;
            setBase32(base32);
            QRCode.toDataURL(otpauth_url).then((data) => setqrCodeUrl(data));
            return otpauth_url;
          });
        }
      } catch (err) {
        console.log("generate otp error", err?.message);
      }
    }
    generateOtp();
  }, [account]);

  const validate2fa = async (token) => {
    try {
      await axios
        .post("/accounts/otp/validate", {
          token,
          address: account,
        })
        .then((res) => {
          // let otp_valid = res.data.otp_valid;
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {twoFactorAuth && (
        <TwoFactorVerification
          onClick={() => console.log("close")}
          confirmAuth={(code) => verifyOTP(code)}
          qrcode={qrcodeUrl}
          accountName={"Complend"}
          accountKey={base32}
        />
      )}
      <SideBar open={sideBarOpen}>
        {sideBar === "connect" && !account && (
          <Connect
            ConnectOptions={[
              {
                label: "Metamask",
                svg: <MetaMask />,
                connect: () => connect("metaMask", injected),
              },
              {
                label: "ConnectWallet",
                svg: <WalletConnect />,
                connect: () => connect("walletConnect"),
              },
            ]}
            signIn={handleSignInBar}
            sideBarClose={handleClose}
          />
        )}
        {sideBar === "connect" && account && (
          <UserOptions
            type={"Metamask"}
            warning={!emailVerified}
            completeAccount={handleUserAccount}
            sideBarClose={handleClose}
            disconnect={disconnect}
            userAccount={handleUserAccount}
            account={account}
          />
        )}
        {sideBar === "UserAccount" && (
          <UserAccount
            sideBarClose={handleClose}
            goBack={() =>
              dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "connect" } })
            }
            personalData={personalData}
            handlePersonalData={handlePersonalData}
            handleSecurityData={handleSecurityData}
            emailVerified={emailVerified}
            personalDataState={personalDataState}
            securityDataState={securityDataState}
            resendEmail={() => console.log("resent email")}
            hasPasswordSet={hasPasswordSet}
            imgValue={`http://localhost:4000/images/${account}.png`}
            twoFactorAuth={twoFactorAuth}
            handleTwoFactorAuth={(val) => {
              setTwoFactorAuth(val);
              if (!val) disableOTP();
            }}
          />
        )}
        {sideBar === "SignIn" && (
          <SignIn
            onClick={handleLogin}
            sideBarClose={handleClose}
            goBack={() =>
              dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "connect" } })
            }
            signInState={signInState}
          />
        )}
        {sideBar === "notifications" && <div>notifications</div>}
      </SideBar>
    </>
  );
};

export default SideBarRight;
