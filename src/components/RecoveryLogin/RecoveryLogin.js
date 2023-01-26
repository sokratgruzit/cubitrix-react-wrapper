import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";

const RecoveryLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const address = useSelector((state) => state.connect.account);
  // const dispatch = useDispatch();

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
          // onClick={handleLogin}
          style={{ background: "blue", width: "100px", height: "42px" }}
        >
          Login
        </div>
      </div>
    </>
  );
};

export default RecoveryLogin;
