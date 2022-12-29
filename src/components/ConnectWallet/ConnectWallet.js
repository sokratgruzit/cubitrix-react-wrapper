import React from 'react';
import useConnect from '../../hooks/use-connect';

import styles from './ConnectWallet.module.css';

const ConnectWallet = () => {
    const { 
        connect, 
        disconnect, 
        account, 
        walletModal, 
        handleWalletModal,
        isConnected
    } = useConnect();

    const handleModal = () => {
        handleWalletModal(true);
    };

    const handleClose = () => {
        handleWalletModal(false);
    };

    let cBtn = <div className={styles.button} onClick={handleModal}>Connect Wallet</div>;

    if (account !== undefined) {
        cBtn = <div className={styles.button} onClick={() => disconnect()}>Disconnect</div>;
    }

    return (
        <>
            <p>{account}</p>
            {cBtn}
            <div style={{ display: walletModal ? "flex" : "none" }} className={styles.modalContainer}>
                <div onClick={handleClose} className={styles.closeModal}>X</div>
                <div 
                    className={styles.leftBtn}
                    onClick={() => {
                        handleWalletModal(false);
                        connect("metaMask");
                    }}
                >Metamask</div>
                <div 
                    className={styles.rightBtn}
                    onClick={() => {
                        handleWalletModal(false);
                        connect("walletConnect");
                    }}
                >WalletConnect</div>
            </div>
        </>
    );
};

export default ConnectWallet;