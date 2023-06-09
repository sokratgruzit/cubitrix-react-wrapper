import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";

import { Loan as LoanTest } from "@cubitrix/cubitrix-react-ui-module";
// import { injected } from "../connector";

const Loan = () => {
  const account = useSelector((state) => state.connect.account);

  const [allLoanOffers, setAllLoanOffers] = useState([]);
  const [yourLending, setYourLending] = useState([]);
  const [yourBorrowing, setYourBorrowing] = useState([]);

  // const { connect } = useConnect();
  // () => connect("metaMask", injected)

  // const [loans, setLoans] = useState([]);
  // const [userLoanOffers, setUserLoanOffers] = useState([]);
  // const [userLoans, setUserLoans] = useState([]);
  // const data = {
  //   borrower: "",
  //   lender: account,
  //   amount: 100,
  //   interest: 10,
  //   duration: 10,
  //   status: "active",
  //   collateral: [],
  // };

  const getLoanMarketOffers = () => {
    axios
      .get("/api/loan/loan-market-offers")
      .then((res) => {
        setAllLoanOffers(res.data?.result);
      })
      .catch((e) => console.log(e.message));
  };

  function getUserCreatedLoans() {
    axios
      .get(`/api/loan/user-created-loans?address=${account}`)
      .then((res) => {
        setYourLending(res.data?.result);
      })
      .catch((e) => console.log(e.message));
  }

  function getUserLoans() {
    axios
      .get(`/api/loan/user-loans?address=${account}`)
      .then((res) => {
        setYourBorrowing(res.data?.result);
      })
      .catch((e) => console.log(e.message));
  }

  function handleCreateNewLoanOffering(loan) {
    const mutatedLoan = { ...loan, lender: account };

    axios
      .post("/api/loan/create-loan", mutatedLoan)
      .then((res) => {
        console.log(res.data);
        // setUserLoanOffers((prev) => [...prev, res.data.result]);
      })
      .catch((e) => console.log(e));
  }

  // function takeLoan(loanId) {
  // axios
  //   .post("/api/take-loan", {
  //     id: "63fde87727b972bedffa5210",
  //     borrower: account,
  //     collateral: ["big nft"],
  //   })
  //   .then((res) => {
  //     setLoans((prev) =>
  //       prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
  //     );
  //   })
  //   .catch((e) => console.log(e.message));
  // }

  function handleTakeLoan(loanId) {
    const mutatedLoan = {
      id: loanId,
      borrower: account,
    };
    axios
      .post("/api/loan/take-loan", mutatedLoan)
      .then((res) => {
        console.log(res.data);
        // setLoans((prev) =>
        //   prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        // );
      })
      .catch((e) => console.log(e.message));
  }

  // function repayLoan(loanId) {
  // axios
  //   .post("/api/repay-loan", {
  //     id: loanId,
  //     borrower: account,
  //     repayAmount: 1,
  //   })
  //   .then((res) => {
  //     setUserLoans((prev) =>
  //       prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
  //     );
  //   })
  //   .catch((e) => console.log(e.message));
  // }

  function handleRepayLoan(data) {
    data.borrower = account;
    axios
      .post("/api/loan/repay-loan", data)
      .then((res) => {
        console.log(res.data);
        // setUserLoans((prev) =>
        //   prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
        // );
      })
      .catch((e) => console.log(e.message));
  }

  function handleMakeOffer(loan) {
    const data = { ...loan, borrower: account };

    console.log(data);

    // axios
    //   .post("/api/loan/send-loan-offer", data)
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((e) => console.log(e.message));
  }

  // function defaultLoan(loanId) {
  //   axios
  //     .post("/api/default-loan", {
  //       id: loanId,
  //       borrower: account,
  //     })
  //     .then((res) => {
  //       setUserLoans((prev) =>
  //         prev.map((loan) => (loan._id === loanId ? res.data.result : loan)),
  //       );
  //     })
  //     .catch((e) => console.log(e.message));
  // }

  // function deleteLoanOffer(loanId) {
  // axios
  //   .post(`/api/delete-loan-offer`, { id: loanId, lender: account })
  //   .then((res) => {
  //     setUserLoanOffers((prev) =>
  //       prev.filter((loan) => loan._id !== res.data.deletedID),
  //     );
  //   })
  //   .catch((e) => console.log(e.message));
  // }

  function handleDeleteLoanOffer(loanId) {
    const data = { id: loanId, lender: account };

    axios
      .post(`/api/loan/delete-loan-offer`, { data })
      .then((res) => {
        console.log(res.data);
        // setUserLoanOffers((prev) =>
        //   prev.filter((loan) => loan._id !== res.data.deletedID),
        // );
      })
      .catch((e) => console.log(e.message));
  }

  function handleRescindOffer(loanId) {
    const data = { id: loanId, borrower: account, offerId: "not yet defined" };

    console.log(data);

    // fetch("http://localhost:4000/api/loan/rescind-loan-offer", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error(error));
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

  useEffect(() => {}, []);

  // return (
  //   <div style={{ paddingTop: "100px", display: "flex", gap: "100px" }}>
  //     <div style={{ display: "flex", flexDirection: "column", width: "45%" }}>
  //       loans
  //       {loans.map((loan) => {
  //         return (
  //           <div
  //             key={loan._id}
  //             style={{
  //               display: "flex",
  //               gap: "10px",
  //               height: "44px",
  //               alignItems: "center",
  //             }}
  //           >
  //             <div>
  //               <p>amount</p>
  //               <p>{loan.amount}</p>
  //             </div>
  //             <div>
  //               <p>duration</p>
  //               <p>{loan.duration}</p>
  //             </div>
  //             <div>
  //               <p>lender</p>
  //               <p
  //                 style={{
  //                   maxWidth: "100px",
  //                   overflow: "hidden",
  //                   textOverflow: "ellipsis",
  //                 }}
  //               >
  //                 {loan.lender}
  //               </p>
  //             </div>
  //             <div>
  //               <p>borrower</p>
  //               <p
  //                 style={{
  //                   maxWidth: "100px",
  //                   overflow: "hidden",
  //                   textOverflow: "ellipsis",
  //                 }}
  //               >
  //                 {loan.borrower}
  //               </p>
  //             </div>
  //             <div>
  //               <p>status</p>
  //               <p>{loan.status}</p>
  //             </div>
  //             <button onClick={() => takeLoan(loan._id)}>take loan</button>
  //           </div>
  //         );
  //       })}
  //     </div>
  //     <div
  //       style={{ display: "flex", flexDirection: "column", width: "45%", gap: "40px" }}
  //     >
  //       <p>lone profile side</p>
  //       <div>
  //         <p>my active loans</p>
  //         userLoans
  //         {userLoans.map((loan) => {
  //           return (
  //             <div
  //               key={loan._id}
  //               style={{
  //                 display: "flex",
  //                 gap: "10px",
  //                 height: "44px",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <div>
  //                 <p>amount</p>
  //                 <p>{loan.amount}</p>
  //               </div>
  //               <div>
  //                 <p>duration</p>
  //                 <p>{loan.duration}</p>
  //               </div>
  //               <div>
  //                 <p>lender</p>
  //                 <p
  //                   style={{
  //                     maxWidth: "100px",
  //                     overflow: "hidden",
  //                     textOverflow: "ellipsis",
  //                   }}
  //                 >
  //                   {loan.lender}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p>borrower</p>
  //                 <p
  //                   style={{
  //                     maxWidth: "100px",
  //                     overflow: "hidden",
  //                     textOverflow: "ellipsis",
  //                   }}
  //                 >
  //                   {loan.borrower}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p>status</p>
  //                 <p>{loan.status}</p>
  //               </div>
  //               <button onClick={() => repayLoan(loan._id)}>repay loan</button>
  //               <button onClick={() => defaultLoan(loan._id)}>default loan</button>
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div>
  //         <p>my created loan offers</p>
  //         userLoanOffers
  //         {userLoanOffers.map((loan) => {
  //           return (
  //             <div
  //               key={loan._id}
  //               style={{
  //                 display: "flex",
  //                 gap: "10px",
  //                 height: "44px",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <div>
  //                 <p>amount</p>
  //                 <p>{loan.amount}</p>
  //               </div>
  //               <div>
  //                 <p>duration</p>
  //                 <p>{loan.duration}</p>
  //               </div>
  //               <div>
  //                 <p>lender</p>
  //                 <p
  //                   style={{
  //                     maxWidth: "100px",
  //                     overflow: "hidden",
  //                     textOverflow: "ellipsis",
  //                   }}
  //                 >
  //                   {loan.lender}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p>borrower</p>
  //                 <p
  //                   style={{
  //                     maxWidth: "100px",
  //                     overflow: "hidden",
  //                     textOverflow: "ellipsis",
  //                   }}
  //                 >
  //                   {loan.borrower}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p>status</p>
  //                 <p>{loan.status}</p>
  //               </div>
  //               <button onClick={() => deleteLoanOffer(loan._id)}>
  //                 delete loan offer
  //               </button>
  //             </div>
  //           );
  //         })}
  //         <button onClick={createLoan}>create new loan offer</button>
  //       </div>
  //       <div>
  //         <p>borrowers offers</p>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <LoanTest
      account={account}
      allLoanOffers={allLoanOffers}
      yourLending={yourLending}
      yourBorrowing={yourBorrowing}
      createNewLoanOffering={handleCreateNewLoanOffering}
      handleDeleteLoanOffer={handleDeleteLoanOffer}
      handleTakeLoan={handleTakeLoan}
      handleRepayLoan={handleRepayLoan}
      makeOffer={handleMakeOffer}
      rescindOffer={handleRescindOffer}
    />
  );
};

export default Loan;
