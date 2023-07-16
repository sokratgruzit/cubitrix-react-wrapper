// import React from "react";

// import { useSelector, useDispatch } from "react-redux";
// import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

// import axios from "../api/axios";

// const Test = () => {
//   // const account = useSelector((state) => state.connect.account);
//   const dispatch = useDispatch();

//   const { library, account } = useConnect();

//   function openLoanAccount() {
//     axios
//       .post("/api/accounts/create_different_accounts", {
//         address: account,
//         type: "loan",
//       })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((e) => console.log(e.response));
//   }

//   function startTransition() {
//     axios
//       .post("/api/transactions/deposit_transaction", {
//         tx_type: "deposit",
//         from: account,
//         amount: 20,
//         tx_currency: "ether",
//       })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((e) => console.log(e.response));
//   }

//   function testChangeExtension() {
//     axios
//       .post("/api/accounts/manage_extensions", {
//         address: account,
//         extensions: { referral: "true" },
//       })
//       .then((res) => {
//         if (res?.data?.account) {
//           dispatch({
//             type: "UPDATE_ACTIVE_EXTENSIONS",
//             payload: res.data.account.extensions,
//           });
//         }
//       })
//       .catch((e) => console.log(e.response));
//   }

//   async function direct_deposit() {
//     try {
//       // axios
//       //   .post("/api/transactions/direct_deposit", {
//       //     address: account,
//       //     amount: 10,
//       //   })
//       //   .then((res) => {
//       //     console.log(res.data);
//       //   })
//       //   .catch((e) => console.log(e.response));
//       // const response = await fetch("/api/transactions/direct_deposit", {
//       // const response = await fetch("/test", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({
//       //     address: "0xA3403975861B601aE111b4eeAFbA94060a58d0CA",
//       //     amount: 10,
//       //   }),
//       // });
//       // if (response.ok) {
//       //   const { success, receipt } = await response.json();
//       //   if (success) {
//       //     // Transaction successful
//       //     console.log("Transaction receipt:", receipt);
//       //     // You can display a success message or perform any other actions
//       //   } else {
//       //     // Handle transaction failure
//       //     console.error("Transaction failed:", receipt);
//       //     // You can display an error message or perform any other error handling
//       //   }
//       // } else {
//       //   // Handle non-200 response
//       //   console.error("Server error:", response.status);
//       //   // You can display an error message or perform any other error handling
//       // }
//     } catch (error) {
//       // Handle fetch or other client-side errors
//       console.error("Client error:", error.message);
//       // You can display an error message or perform any other error handling
//     }
//   }
//   return (
//     <div
//       style={{
//         paddingTop: "100px",
//         paddingLeft: "20px",
//         background: "#2f3674",
//         display: "flex",
//         flexDirection: "column",
//         gap: "20px",
//       }}>
//       <button onClick={openLoanAccount}> open load account</button>
//       <button onClick={startTransition}>
//         send balance from main to loan account 20 tokens
//       </button>
//       <button onClick={testChangeExtension}> shit shit shit</button>

//       <button onClick={direct_deposit}> direct deposit</button>
//     </div>
//   );
// };

// export default Test;

import React, { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState(0);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (value > 500) {
      const multiplesOf5k = [];
      for (let i = 5000; i <= 500000; i += 5000) {
        if (i > value) {
          multiplesOf5k.push(i);
        }
      }
      setOptions(multiplesOf5k);
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, [value]);

  const handleChange = (event) => {
    const num = parseInt(event.target.value, 10);
    if (isNaN(num)) {
      setError("Please enter a valid number");
      setValue(0);
    } else if (num < 100) {
      setError("Value must be at least 100");
      setValue(num);
    } else if (num > 500000) {
      setError("Value must be less than or equal to 500,000");
      setValue(num);
    } else if (num > 500 && num < 5000) {
      setError("Values between 500 and 5000 are not allowed");
      setValue(num);
    } else if (num >= 5000 && num % 5000 !== 0) {
      setError("Value must be a multiple of 5000 if it is more than 5000");
      setValue(num);
    } else {
      setError(null);
      setValue(num);
    }
  };

  const handleOptionClick = (option) => {
    setValue(option);
    setShowOptions(false);
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <input
        style={{ color: "black" }}
        type="number"
        value={value}
        onChange={handleChange}
      />
      {error && <p>{error}</p>}
      {showOptions && (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              zIndex: "999",
            }}>
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                style={{ padding: "5px" }}>
                {`${option / 1000}k`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
