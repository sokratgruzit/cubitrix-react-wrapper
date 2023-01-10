import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ValidateAuth from "../TwoFactorAuth/ValidateAuth";
import axios from "axios";
import styles from "./RecoveryLogin.module.css";

const RecoveryLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const address = useSelector((state) => state.connect.account);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (email !== "" && password !== "") {
      axios
        .post("/accounts/recovery/login", {
          address,
          email,
          password,
        })
        .then((res) => {
          console.log(res, "shit");
          if (res) {
            dispatch({
              type: "GET_OTP_ENABLED",
              otp_enabled: res,
            });
          }
        })
        .catch((e) => console.log(e?.response));
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Recovery Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div onClick={handleLogin} className={styles.submitBtn}>
          Login
        </div>
      </div>
      <ValidateAuth />
    </>
  );
};

export default RecoveryLogin;
