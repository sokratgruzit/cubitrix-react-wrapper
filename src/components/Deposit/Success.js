import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../api/axios";
import Web3 from "web3";
import { useParams } from "react-router-dom";

const Success = () => {
  const account = useSelector((state) => state.connect.account);
  const { hash } = useParams();

  useEffect(() => {
    console.log(hash);
  }, []);

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
