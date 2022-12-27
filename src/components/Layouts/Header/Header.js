import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "./Header.module.css";

const Header = () => {
    const exts = useSelector(state => state.connect.activeExtensions);
  
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <p>Logo</p>
            </div>
            <div className={styles.center}>
                <Link className={styles.link} to="/">Dashboard</Link>
                <Link style={{ display: exts.trade === "true" ? "block" : "none" }} className={styles.link} to="/trade">Trade</Link>
                <Link style={{ display: exts.loan === "true" ? "block" : "none" }} className={styles.link} to="/loan">Loan</Link>
                <Link style={{ display: exts.referal === "true" ? "block" : "none" }} className={styles.link} to="/referal">Referal</Link>
                <Link style={{ display: exts.staking === "true" ? "block" : "none" }} className={styles.link} to="/staking">Staking</Link>
                <Link className={styles.link} to="/extensions">Extensions</Link>
            </div>
            <div className={styles.right}>
                <p style={{ display: exts.notify === "true" ? "block" : "none" }}>notify</p>
                <p style={{ display: exts.connect === "true" ? "block" : "none" }}>Connect Wallet</p>
            </div>
        </div>
    )
};

export default Header;