import React from "react";
import axios from "../../../api/axios";
import { useSelector, useDispatch } from "react-redux";

import {
  Connect,
  SideBar,
  UserAccount,
  UserOptions,
  SignIn,
} from "@cubitrix/cubitrix-react-ui-module";
// import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { MetaMask, WalletConnect } from "../../../assets/svg";
import { useConnect } from "../../../hooks/use-connect";
import { useEffect } from "react";
import { useState } from "react";

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

  const [signInState, setSignInState] = useState({ loading: false, error: false });

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
    const personalData = userData;
    personalData.avatar = account;
    setPersonalDataState((prev) => ({ ...prev, loading: true, error: "" }));
    axios
      .post("/accounts/update_profile", { ...personalData, address: account })
      .then((res) => {
        if (res.data === "email sent") {
          setPersonalDataState((prev) => ({ ...prev, emailSent: true }));
        }
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
  };

  const handleLogin = ({ email, password }) => {
    if (email !== "" && password !== "") {
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
  return (
    <>
      <SideBar open={sideBarOpen}>
        {sideBar === "connect" && !account && (
          <Connect
            ConnectOptions={[
              {
                label: "Metamask",
                svg: <MetaMask />,
                connect: () => connect("metaMask"),
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
