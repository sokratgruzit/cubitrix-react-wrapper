import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  SideBar,
  SideBarConnect,
  SideBarWelcome,
  SideBarAccount,
} from "@brilliant_emporium/ui";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { MetaMask, WalletConnect } from "../../../assets/svg";

const SideBarRight = () => {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const account = useSelector((state) => state.connect.account);
  const { connect, disconnect } = useConnect();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBarOpen: false } });
  };

  const handleSignIn = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "SingIn" } });
  };

  const handleUserAccount = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "UserAccount" } });
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
                image: null,
              },
            ]}
            signIn={handleSignIn}
            sideBarClose={handleClose}
          />
        )}
        {sideBar === "connect" && account && (
          <SideBarWelcome
            type={"Metamask"}
            warning={true}
            completeAccount={handleUserAccount}
            sideBarClose={handleClose}
            disconnect={disconnect}
            userAccount={handleUserAccount}
          />
        )}
        {sideBar === "UserAccount" && (
          <SideBarAccount
            sideBarClose={handleClose}
            goBack={() =>
              dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "connect" } })
            }
            handlePersonalData={(formData) => console.log(formData)}
            handleSecurityData={(formData) => console.log(formData)}
            response={"response"}
          />
        )}
        {sideBar === "notifications" && <div>notifications</div>}
      </SideBar>
    </>
    // <div className={`${styles.container} ${sideBarOpen && "sideOpen"}`}>

    //   {sideBar === "userAccount" && <UserAccBar />}
    //   {sideBar === "signIn" && <div>sign in</div>}
    // </div>
  );
};

export default SideBarRight;
