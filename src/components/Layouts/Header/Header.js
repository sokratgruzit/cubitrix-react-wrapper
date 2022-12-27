import React from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css";

const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <p>Logo</p>
            </div>
            <div className={styles.center}>
                <Link className={styles.link} to="/">Dashboard</Link>
                <Link className={styles.link} to="/trade">Trade</Link>
                <Link className={styles.link} to="/loan">Loan</Link>
                <Link className={styles.link} to="/referal">Referal</Link>
                <Link className={styles.link} to="/staking">Staking</Link>
            </div>
            <div className={styles.right}>
                <p>notify</p>
                <p>Connect Wallet</p>
            </div>
        </div>
    )
};

export default Header;