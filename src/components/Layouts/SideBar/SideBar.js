import React from "react";
import axios from "../../../api/axios";
import { useSelector, useDispatch } from "react-redux";

import {
  Connect,
  SideBar,
  UserAccount,
  UserOptions,
  SignIn,
  TwoFactorAuthentication,
} from "@cubitrix/cubitrix-react-ui-module";

import { MetaMask, WalletConnect } from "../../../assets/svg";

import {
  useConnect,
  injected,
  WalletConnect as WalletConnectSetting,
  walletConnect,
} from "@cubitrix/cubitrix-react-connect-module";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const SideBarRight = () => {
  const appState = useSelector((state) => state.appState);
  const userMetaData = useSelector((state) => state.appState.userData?.meta[0]);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const account = useSelector((state) => state.connect.account);

  const [personalData, setPersonalData] = useState(null);
  console.log(personalData);
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
  const [activated, setActivated] = useState(false);
  const [procceed2fa, setProcceed2fa] = useState(false);
  useEffect(() => {
    if (appState.otp_verified) setTwoFactorAuth(appState.otp_verified);
  }, [appState.otp_verified]);

  const [base32, setBase32] = useState("");
  const [qrcodeUrl, setqrCodeUrl] = useState("");

  const [signInState, setSignInState] = useState({ loading: false, error: false });
  const [otpState, setOtpState] = useState({ loading: false, error: false });
  const [signInAddress, setSignInAddress] = useState("");
  const [twoFactorSetUpState, setTwoFactorSetUpState] = useState("");

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
        console.log(e.response);
      });
  };

  const resendEmail = (e) => {
    axios
      .post("/accounts/resend-email", {
        address: account ? account : signInAddress,
      })
      .then((res) => {
        console.log(res.response);
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
          setSignInState((prev) => ({ ...prev, loading: false }));
          setSignInAddress(res.data.address);
          if (res.data.message === "proceed 2fa") return setProcceed2fa(true);
          updateState();
          setProcceed2fa(false);
          dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });
        })
        .catch((e) => {
          setSignInState((prev) => ({ ...prev, loading: false, error: e.response.data }));
        });
    }
  };
  useEffect(() => {
    if (userMetaData) {
      setPersonalData({
        name: userMetaData.name ? userMetaData.name : "",
        email: userMetaData.email ? userMetaData.email : "",
        mobile: userMetaData?.mobile ? userMetaData?.mobile : "",
        date_of_birth: userMetaData.date_of_birth
          ? new Date(userMetaData.date_of_birth)
          : new Date(),
        nationality: userMetaData.nationality ? userMetaData.nationality : "",
        avatar: userMetaData.avatar ? userMetaData.avatar : "",
      });
    } else {
      setPersonalData({
        name: "",
        email: "",
        mobile: "",
        date_of_birth: new Date(),
        nationality: "",
        avatar: "",
      });
    }
  }, [userMetaData]);

  const disableOTP = () => {
    axios
      .post("/accounts/otp/disable", { address: account ? account : signInAddress })
      .then((res) => {})
      .catch((e) => {});
  };

  const verifyOTP = (code) => {
    setTwoFactorSetUpState({ loading: false, error: "" });
    axios
      .post("/accounts/otp/verify", {
        address: account ? account : signInAddress,
        token: code,
      })
      .then((res) => {
        setTwoFactorSetUpState({ loading: false, error: "" });
        setActivated(false);
        updateState();
      })
      .catch((e) => {
        setTwoFactorSetUpState({ loading: false, error: e.response.data });
      });
  };

  async function generateOtp() {
    try {
      await axios
        .post("/accounts/otp/generate", { address: account ? account : signInAddress })
        .then((res) => {
          const { base32, otpauth_url } = res.data;
          setBase32(base32);
          QRCode.toDataURL(otpauth_url).then((data) => setqrCodeUrl(data));
        });
    } catch (err) {
      console.log("generate otp error", err?.message);
    }
  }

  const validate2fa = async (token) => {
    setOtpState({ loading: true, error: "" });

    await axios
      .post("/accounts/otp/validate", {
        token,
        address: signInAddress,
      })
      .then((res) => {
        updateState();
        setOtpState({ loading: false, error: "" });
        dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });
        setProcceed2fa(false);
      })
      .catch((e) => {
        setOtpState({ loading: false, error: e.response.data });
      });
  };
  return (
    <>
      {twoFactorAuth && activated && (
        <TwoFactorAuthentication
          onClick={() => setTwoFactorAuth(false)}
          confirmAuth={(code) => verifyOTP(code)}
          qrcode={qrcodeUrl}
          accountName={"Complend"}
          accountKey={base32}
          twoFactorSetUpState={twoFactorSetUpState}
        />
      )}
      <SideBar open={appState.sideBarOpen}>
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
                connect: () => connect("walletConnect", walletConnect),
              },
            ]}
            signIn={handleSignInBar}
            sideBarClose={handleClose}
          />
        )}
        {sideBar === "connect" && account && (
          <UserOptions
            type={"Metamask"}
            warning={!appState.emailVerified}
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
            emailVerified={appState.emailVerified}
            personalDataState={personalDataState}
            securityDataState={securityDataState}
            resendEmail={(e) => resendEmail(e)}
            hasPasswordSet={appState.hasPasswordSet}
            imgValue={`http://localhost:4000/images/${account}.png`}
            twoFactorAuth={twoFactorAuth}
            handleTwoFactorAuth={(val) => {
              setTwoFactorAuth(val);
              setActivated(val);
              if (!val) disableOTP();
              if (val) {
                generateOtp();
              }
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
            otpEnabled={procceed2fa}
            otpState={otpState}
            handleTFA={(code) => validate2fa(code)}
          />
        )}
        {sideBar === "notifications" && <div>notifications</div>}
      </SideBar>
    </>
  );
};

export default SideBarRight;
