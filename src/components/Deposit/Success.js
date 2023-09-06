import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../api/axios";
import Web3 from "web3";
import { useParams } from "react-router-dom";

const Success = () => {
  const account = useSelector((state) => state.connect.account);
  const dispatch = useDispatch();
  const { hash } = useParams();

  const currentLoadingState = useSelector((state) => state.appState.coinbaseLoading);

  const checkTransactionStatus = async () => {
    if (hash) {
      // try {
      //   const res = await axios.post("/api/transactions/get_transaction_by_hash", {
      //     hash,
      //   });
      //   console.log(res?.data?.transaction?.tx_status);
      //   if (res?.data?.transaction?.tx_status === "pending" && !currentLoadingState) {
      //     dispatch({
      //       type: "UPDATE_COINBASE_LOADING",
      //       payload: { value: true },
      //     });
      //   } else if (
      //     res?.data?.transaction?.tx_status === "cancelled" &&
      //     currentLoadingState
      //   ) {
      //     dispatch({
      //       type: "UPDATE_COINBASE_LOADING",
      //       payload: { value: false },
      //     });
      //   }
      // } catch (e) {
      //   console.log(e.response);
      // }
    }
  };

  useEffect(() => {
    checkTransactionStatus();
    const intervalId = setInterval(checkTransactionStatus, 1000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, dispatch]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(43,49,95,1)",
      }}
    >
      Success
    </div>
  );
};

export default Success;
