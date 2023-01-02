import React from "react";
import useConnect from "../../hooks/use-connect";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ConnectWallet.module.css";

const ConnectWallet = () => {
  const { connect, disconnect, account, isConnected } = useConnect();

  const walletModalActive = useSelector((state) => state.connect.walletModalActive);
  const dispatch = useDispatch();

  const handleModalChange = (stateChange) => {
    dispatch({
      type: "TOGGLE_WALLET_CONNECT_MODAL",
      payload: stateChange,
    });
  };

  let cBtn = (
    <div className={styles.button} onClick={() => handleModalChange(true)}>
      Connect Wallet
    </div>
  );

  if (account !== undefined) {
    cBtn = (
      <div className={styles.button} onClick={() => disconnect()}>
        Disconnect
      </div>
    );
  }

  return (
    <>
      <p>{account}</p>
      {cBtn}
      <div
        style={{ display: walletModalActive ? "flex" : "none" }}
        className={styles.modalContainer}
      >
        <div onClick={() => handleModalChange(false)} className={styles.closeModal}>
          X
        </div>
        <div
          className={styles.leftBtn}
          onClick={() => {
            handleModalChange(false);
            connect("metaMask");
          }}
        >
          Metamask
        </div>
        <div
          className={styles.rightBtn}
          onClick={() => {
            handleModalChange(false);
            connect("walletConnect");
          }}
        >
          WalletConnect
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;
