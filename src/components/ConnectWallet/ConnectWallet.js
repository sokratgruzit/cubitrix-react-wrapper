import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConnect from '../../hooks/use-connect';

import styles from './ConnectWallet.module.css';
import axios from "../../api/axios";
import { Link } from 'react-router-dom';

const ConnectWallet = () => {
    const dispatch = useDispatch();
    const balance = useSelector(state => state.connect.balance);

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
        if (account !== undefined || account !== "" || account !== undefined) {
            library?.eth.getBalance(account).then(res => {
                dispatch({
                    type: "GET_BALANCE",
                    balance: res
                });

                dispatch({
                    type: "GET_ACCOUNT",
                    account: account
                });
            });

            const fetchData = async () => {
                await axios.post("/accounts/login",
                { 
                    account: account, 
                    balance: balance
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            }

            fetchData();
        }
    }, [account, balance, library]);

    return (
        <>
            <p>{account}</p>
            {cBtn}
            <Link to="/recovery">recovery login</Link>
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