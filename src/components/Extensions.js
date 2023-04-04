import React from "react";

import { useSelector } from "react-redux";

import axios from "../api/axios";

const Extensions = () => {
  const account = useSelector((state) => state.connect.account);
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
    </div>
  );
};

export default Extensions;
