import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./SideBar.module.css";

// import ConnectBar from "../../SideBar/ConnectBar/ConnectBar";
import WelcomeBar from "../../SideBar/WelcomeBar/WelcomeBar";
import UserAccBar from "../../SideBar/UserAccBar/UserAccBar";

import { SideBarConnect, SideBar } from "@cubitrix/cubitrix-react-ui-module";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { MetaMask, WalletConnect } from "../../../assets/svg";

const SideBarRight = () => {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const account = useSelector((state) => state.connect.account);
  const { connect, loading } = useConnect();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBarOpen: false } });
  };

  const handleSignIn = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "SingIn" } });
  };

  return (
    <>
      <SideBar open={sideBarOpen}>
        {sideBar === "connect" && !account && (
          <SideBarConnect
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
        {sideBar === "connect" && account && <WelcomeBar />}
      </SideBar>
    </>
    // <div className={`${styles.container} ${sideBarOpen && "sideOpen"}`}>

    //   {sideBar === "userAccount" && <UserAccBar />}
    //   {sideBar === "signIn" && <div>sign in</div>}
    // </div>
  );
};

export default SideBarRight;
