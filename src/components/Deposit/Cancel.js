import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";

const Cancel = () => {
  const { jwtToken } = useParams();
  const account = useSelector((state) => state.connect.account);

  // useEffect(() => {
  //   axios
  //     .post("/api/transactions/cancel_coinbase_deposit_transaction", {
  //       address: account,
  //       jwtToken: jwtToken,
  //     })
  //     .then((res) => {})
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Cancel
    </div>
  );
};

export default Cancel;
