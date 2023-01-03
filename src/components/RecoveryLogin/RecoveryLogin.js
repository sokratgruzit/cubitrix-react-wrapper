import React, { useState } from "react";

import styles from "./RecoveryLogin.module.css";

const RecoveryLogin = () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleLogin = () => {
        if (email !== "" && password !== "") {
            console.log(email, password);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Recovery Login</h1>
            <input 
                type="email" 
                placeholder="Enter your email" 
                onChange={e => setEmail(e.target.value)}
                value={email}
            />
            <input 
                type="password" 
                placeholder="Enter your password" 
                onChange={e => setPassword(e.target.value)}
                value={password}
            />
            <div onClick={handleLogin} className={styles.submitBtn}>Login</div>
        </div>
    );
};

export default RecoveryLogin;