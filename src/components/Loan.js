import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";

const Loan = () => {
  const account = useSelector((state) => state.connect.account);

  const [loans, setLoans] = useState([]);
  const [userLoanOffers, setUserLoanOffers] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const data = {
    borrower: "",
    lender: account,
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
        setUserLoanOffers((prev) => [...prev, res.data.result]);
      })
      .catch((e) => console.log(e));
  };

  const getLoanMarketOffers = () => {
    axios
      .get("/api//loan-market-offers", data)
      .then((res) => {
        setLoans(res.data?.result);
      })
      .catch((e) => console.log(e.message));
  };

  function getUserCreatedLoans() {
    axios
      .get(`/api/user-created-loans/${account}`)
      .then((res) => {
        setUserLoanOffers(res.data?.result);
      })
      .catch((e) => console.log(e.message));
  }

  function getUserLoans() {
    axios
      .get(`/api/user-loans/${account}`)
      .then((res) => {
        setUserLoans(res.data?.result);
      })
      .catch((e) => console.log(e.message));
  }

  function takeLoan(loanId) {
    axios
      .post("/api/take-loan", {
        id: "63fde87727b972bedffa5210",
        borrower: account,
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
        borrower: account,
        repayAmount: 1,
      })
      .then((res) => {
        setUserLoans((prev) =>
          prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        );
      })
      .catch((e) => console.log(e.message));
  }

  function defaultLoan(loanId) {
    axios
      .post("/api/default-loan", {
        id: loanId,
        borrower: account,
      })
      .then((res) => {
        setUserLoans((prev) =>
          prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        );
      })
      .catch((e) => console.log(e.message));
  }

  function deleteLoanOffer(loanId) {
    axios
      .post(`/api/delete-loan-offer`, { id: loanId, lender: account })
      .then((res) => {
        setUserLoanOffers((prev) =>
          prev.filter((loan) => loan._id !== res.data.deletedID),
        );
      })
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    getLoanMarketOffers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (account) {
      getUserCreatedLoans();
      getUserLoans();
    }
    // eslint-disable-next-line
  }, [account]);

  return (
    <div style={{ paddingTop: "100px", display: "flex", gap: "100px" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "45%" }}>
        loans
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
                <p
                  style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {loan.lender}
                </p>
              </div>
              <div>
                <p>borrower</p>
                <p
                  style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {loan.borrower}
                </p>
              </div>
              <div>
                <p>status</p>
                <p>{loan.status}</p>
              </div>
              <button onClick={() => takeLoan(loan._id)}>take loan</button>
            </div>
          );
        })}
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", width: "45%", gap: "40px" }}
      >
        <p>lone profile side</p>
        <div>
          <p>my active loans</p>
          userLoans
          {userLoans.map((loan) => {
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
                  <p
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {loan.lender}
                  </p>
                </div>
                <div>
                  <p>borrower</p>
                  <p
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {loan.borrower}
                  </p>
                </div>
                <div>
                  <p>status</p>
                  <p>{loan.status}</p>
                </div>
                <button onClick={() => repayLoan(loan._id)}>repay loan</button>
                <button onClick={() => defaultLoan(loan._id)}>default loan</button>
              </div>
            );
          })}
        </div>
        <div>
          <p>my created loan offers</p>
          userLoanOffers
          {userLoanOffers.map((loan) => {
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
                  <p
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {loan.lender}
                  </p>
                </div>
                <div>
                  <p>borrower</p>
                  <p
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {loan.borrower}
                  </p>
                </div>
                <div>
                  <p>status</p>
                  <p>{loan.status}</p>
                </div>
                <button onClick={() => deleteLoanOffer(loan._id)}>
                  delete loan offer
                </button>
              </div>
            );
          })}
          <button onClick={createLoan}>create new loan offer</button>
        </div>
        <div>
          <p>borrowers offers</p>
        </div>
      </div>
    </div>
  );
};

export default Loan;
