import React from "react";
import styles from "./WelcomeBar.module.css";

import {
  CloseCircle,
  MetaMask,
  Bolt,
  Disconnect,
  Copy,
  Warning,
} from "../../../assets/svg";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";
import { Button } from "@cubitrix/cubitrix-react-ui-module";
import { useDispatch, useSelector } from "react-redux";

const WelcomeBar = () => {
  const account = useSelector((state) => state.connect.account);
  const { disconnect } = useConnect();

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBarOpen: false } });
  };

  const handleUserAcc = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBar: "userAccount" } });
  };

  return (
    <>
      <header className={styles.header}>
        <h3>Wellcome!</h3>
        <span className={styles.close} onClick={handleClose}>
          <CloseCircle />
        </span>
      </header>
      <div className={styles.barBody}>
        <div className={styles.completeAcc}>
          <p>Complete the onboarding flow to start trading on COMPLEND</p>
          <Button
            element="button"
            label="Complete Account"
            type="btn-primary"
            size="btn-sm"
            onClick={handleUserAcc}
          />
        </div>
        <span className={styles.borderFull}></span>
        <div className={styles.row}>
          <p>Your Address</p>
          <span className={styles.metaMaskWrapper}>
            <MetaMask />
            MetaMask
          </span>
        </div>
        <div className={styles.accWrapper}>
          <span className={styles.copyWrapper}>
            <Copy />
          </span>
          <p className={styles.address}>{account}</p>
        </div>
        <span className={styles.borderFull}></span>
      </div>
      <div className={styles.userActions}>
        <span className={styles.hoverBorder}></span>
        <div className={styles.actionTitle} onClick={handleUserAcc}>
          <span className={styles.userAcc}>
            <Bolt /> <p>User Account</p>
          </span>{" "}
          <Warning />
        </div>
      </div>
      <div className={styles.userActions}>
        <span className={styles.hoverBorder}></span>
        <div className={styles.actionTitle} onClick={() => disconnect()}>
          <span className={styles.userAcc}>
            <Disconnect /> <p>Disconnect</p>
          </span>
        </div>
      </div>
    </>
  );
};

export default WelcomeBar;
