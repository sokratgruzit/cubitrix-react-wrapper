import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useConnect from "../../hooks/use-connect";

import styles from "./ConnectWallet.module.css";
import { Link } from "react-router-dom";

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const walletModalOpen = useSelector((state) => state.connect.walletModalOpen);

  const { connect, disconnect, account } = useConnect();

  const handleModalOpen = (state) => {
    dispatch({ type: "TOGGLE_WALLET_CONNECT_MODAL", payload: state });
  };

  let cBtn = (
    <div className={styles.button} onClick={() => handleModalOpen(true)}>
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
      <Link to="/recovery">recovery login</Link>
      <div
        style={{ display: walletModalOpen ? "flex" : "none" }}
        className={styles.modalContainer}
      >
        <div onClick={() => handleModalOpen(false)} className={styles.closeModal}>
          X
        </div>
        <div
          className={styles.leftBtn}
          onClick={() => {
            handleModalOpen(false);
            connect("metaMask");
          }}
        >
          Metamask
        </div>
        <div
          className={styles.rightBtn}
          onClick={() => {
            handleModalOpen(false);
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
