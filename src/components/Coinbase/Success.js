import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../api/axios";
import Web3 from "web3";

const Success = () => {
  const account = useSelector((state) => state.connect.account);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (account) {
      const fetchData = async () => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const contract = new web3.eth.Contract([], account);

        const pastEvents = await contract.getPastEvents("Transfer", {
          filter: { from: account },
          fromBlock: 0,
          toBlock: "latest",
        });

        setTransactions(pastEvents);
        // await axios
        //   .post("/api/accounts/login", {
        //     address: account,
        //   })
        //   .then((res) => {})
        //   .catch((err) => {});
      };
      fetchData();
    }
  }, []);

  console.log(transactions);

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
      Success
    </div>
  );
};

export default Success;
