import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

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
      <div>
        <h1>Recovery Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={{
            width: "150px",
            height: "42px",
            border: "1px solid red",
            color: "black",
          }}
        />
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          style={{
            width: "150px",
            height: "42px",
            border: "1px solid red",
            color: "black",
          }}
        />
        <div
          onClick={handleLogin}
          style={{ background: "blue", width: "100px", height: "42px" }}
        >
          Login
        </div>
      </div>
    </>
  );
};

export default RecoveryLogin;
