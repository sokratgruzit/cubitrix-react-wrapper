import React, { useEffect, useState } from "react";

import axios from "axios";

const Loan = () => {
  const [loans, setLoans] = useState([]);
  const data = {
    borrower: "",
    lender: "0x2",
    amount: 100,
    interest: 10,
    duration: 10,
    status: "active",
    collateral: [],
  };
  const createLoan = () => {
    axios
      .post("/api/create-loan", data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  };

  const getLoans = () => {
    axios
      .get("/api/loans", data)
      .then((res) => {
        setLoans(res.data);
      })
      .catch((e) => console.log(e.message));
  };

  function takeLoan(loanId) {
    axios
      .post("/api/take-loan", {
        id: loanId,
        borrower: "0x123",
        collateral: ["big nft"],
      })
      .then((res) => {
        setLoans((prev) =>
          prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        );
      })
      .catch((e) => console.log(e.message));
  }

  function repayLoan(loanId) {
    axios
      .post("/api/repay-loan", {
        id: loanId,
        borrower: "0x123",
        repayAmount: 3,
      })
      .then((res) => {
        setLoans((prev) =>
          prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        );
      })
      .catch((e) => console.log(e.message));
  }

  function defaultLoan(loanId) {
    axios
      .post("/api/default-loan", {
        id: loanId,
        borrower: "0x123",
      })
      .then((res) => {
        setLoans((prev) =>
          prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        );
      })
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    getLoans();
  }, []);

  return (
    <div style={{ paddingTop: "100px" }}>
      <button onClick={createLoan}>create loan</button>
      <div>
        shit
        {loans.map((loan) => {
          return (
            <div
              key={loan._id}
              style={{
                display: "flex",
                gap: "10px",
                height: "44px",
                alignItems: "center",
              }}
            >
              <div>
                <p>amount</p>
                <p>{loan.amount}</p>
              </div>
              <div>
                <p>duration</p>
                <p>{loan.duration}</p>
              </div>
              <div>
                <p>lender</p>
                <p>{loan.lender}</p>
              </div>
              <div>
                <p>borrower</p>
                <p>{loan.borrower}</p>
              </div>
              <div>
                <p>status</p>
                <p>{loan.status}</p>
              </div>
              <button onClick={() => takeLoan(loan._id)}>take loan</button>
              <button onClick={() => repayLoan(loan._id)}>repay loan</button>
              <button onClick={() => defaultLoan(loan._id)}>default loan</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Loan;
