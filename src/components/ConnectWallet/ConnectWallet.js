import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useConnect from '../../hooks/use-connect';

import styles from './ConnectWallet.module.css';

const ConnectWallet = () => {
    const dispatch = useDispatch();

    const { 
        connect, 
        disconnect, 
        account, 
        walletModal, 
        handleWalletModal,
        library
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

    useEffect(() => {
        if (account !== undefined || account !== "") {
            dispatch({
                type: "GET_ACCOUNT",
                account: account
            });

            library?.eth.getBalance(account).then(res => {
                dispatch({
                    type: "GET_BALANCE",
                    balance: res
                });
            });
        }
    }, [account]);

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