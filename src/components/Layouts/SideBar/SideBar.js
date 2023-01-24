import React from "react";
import axios from "../../../api/axios";
import { useSelector, useDispatch } from "react-redux";

import {
  Connect,
  SideBar,
  UserAccount,
  UserOptions,
} from "@cubitrix/cubitrix-react-ui-module";
// import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { MetaMask, WalletConnect } from "../../../assets/svg";
import { useConnect } from "../../../hooks/use-connect";
import { useEffect } from "react";
import { useState } from "react";

const SideBarRight = () => {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const emailVerified = useSelector((state) => state.appState.emailVerified);
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
  });

  console.log(personalDataState);

  const handleClose = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBarOpen: false } });
  };

  const handleSignIn = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "SingIn" } });
  };

  const handleUserAccount = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });
  };

  const handleSecurityData = (formData) => {
    axios
      .post("/accounts/update_profile_auth", { ...formData, address: account })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e?.response));
  };

  const handlePersonalData = (userData) => {
    setPersonalDataState((prev) => ({ ...prev, loading: true }));
    axios
      .post("/accounts/update_profile", { ...userData, address: account })
      .then((res) => {
        if (res.data?.message === "email sent") {
          setPersonalDataState((prev) => ({ ...prev, emailSent: true }));
        }
        setPersonalDataState((prev) => ({ ...prev, loading: false, saved: true }));
        setTimeout(() => {
          setPersonalDataState((prev) => ({ ...prev, saved: false }));
        }, 3000);
      })
      .catch((e) => {
        setPersonalDataState((prev) => ({ ...prev, loading: false }));
        console.log(e?.response);
      });
  };

  useEffect(() => {
    if (userMetaData) {
      setPersonalData({
        name: userMetaData?.name,
        email: userMetaData?.email,
        mobile: userMetaData?.mobile,
        date_of_birth: userMetaData.date_of_birth,
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
            signIn={handleSignIn}
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
            resendEmail={() => console.log("resent email")}
          />
        )}
        {sideBar === "notifications" && <div>notifications</div>}
      </SideBar>
    </>
  );
};

export default SideBarRight;
