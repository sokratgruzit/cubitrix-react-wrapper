import React from "react";

import { useSelector, useDispatch } from "react-redux";

import axios from "../api/axios";

const Test = () => {
  const account = useSelector((state) => state.connect.account);
  const dispatch = useDispatch();

  function openLoanAccount() {
    axios
      .post("/api/accounts/create_different_accounts", {
        address: account,
        type: "loan",
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => console.log(e.response));
  }

  function startTransition() {
    axios
      .post("/api/transactions/deposit_transaction", {
        tx_type: "deposit",
        from: account,
        to: "0xA3403975861B601aE111b4eeAFbA94060a58d0CA",
        amount: 20,
        tx_currency: "ether",
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => console.log(e.response));
  }

  function testChangeExtension() {
    axios
      .post("/api/accounts/manage_extensions", {
        address: account,
        extensions: { referral: "true" },
      })
      .then((res) => {
        if (res?.data?.account) {
          dispatch({
            type: "UPDATE_ACTIVE_EXTENSIONS",
            payload: res.data.account.extensions,
          });
        }
      })
      .catch((e) => console.log(e.response));
  }
  return (
    <div
      style={{
        paddingTop: "100px",
        paddingLeft: "20px",
        background: "#2f3674",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <button onClick={openLoanAccount}> open load account</button>
      <button onClick={startTransition}>
        send balance from main to loan account 20 tokens
      </button>
      <button onClick={testChangeExtension}> shit shit shit</button>
    </div>
  );
};

export default Test;
