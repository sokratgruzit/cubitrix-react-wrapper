import React from "react";
import styles from "./ConnectBar.module.css";
import { CloseCircle, MetaMask, WalletConnect } from "../../../assets/svg";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";
import { Button } from "@cubitrix/cubitrix-react-ui-module";
import { useDispatch } from "react-redux";

const ConnectBar = () => {
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
      <header className={styles.header}>
        <h3>Connect Your Wallet</h3>
        <span className={styles.close} onClick={handleClose}>
          <CloseCircle />
        </span>
      </header>
      <div className={styles.barBody}>
        <button className={styles.optionBtn} onClick={() => connect("metaMask")}>
          <span className={styles.optionIcon}>
            <MetaMask />
          </span>
          {loading ? "Connecting..." : "MetaMask"}
        </button>
        <button className={styles.optionBtn} onClick={() => connect("walletConnect")}>
          <span className={styles.optionIcon}>
            <WalletConnect />
          </span>
          {loading ? "Connecting..." : "WalletConnect"}
        </button>
        <div className={styles.orBorder}>
          <span className={styles.border}></span>
          <p>or</p>
          <span className={styles.border}></span>
        </div>
        <div className={styles.verified}>
          <p>If you are verified user</p>
          <Button
            element="button"
            label="Sign in"
            type="btn-secondary"
            size="btn-sm"
            className={styles.signIn}
            customStyles={{ width: "100%" }}
            onClick={handleSignIn}
          />
        </div>
      </div>
    </>
  );
};

export default ConnectBar;
