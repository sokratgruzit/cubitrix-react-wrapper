import React, { useState, useEffect } from "react";

import { Transactions as TransactionsUI } from "@cubitrix/cubitrix-react-ui-module";
import { useSelector } from "react-redux";

import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import { useMobileWidth } from "../hooks/useMobileWidth";
import { NoHistoryIcon } from "../assets/svg";

import axios from "../api/axios";

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState({});
  const [totalTransactions, setTotalTransactions] = useState({});
  const [filterObject, setFilterObject] = useState({
    type: "",
    account: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const [transactionsPaginationTotal, setTransactionsPaginationTotal] = useState(1);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);

  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const { account, active } = useConnect();
  const { width } = useMobileWidth();

  const generateTransactionsData = async () => {
    setLoading(true);

    try {
      const apiUrl = "/api/transactions/get_transactions_of_user";
      const time = filterObject?.time;
      let year, month, day;

      if (time instanceof Date) {
        year = time.getFullYear();
        month = time.getMonth();
        day = time.getDate();
      }

      const requestBody = {
        address: account?.toLowerCase(),
        limit: 5,
        page: transactionsCurrentPage,
        ...filterObject,
        account: filterObject?.account === "main" ? "main" : filterObject?.account,
        time:
          time instanceof Date
            ? `${year}-${(month + 1).toString().padStart(2, "0")}-${day
                .toString()
                .padStart(2, "0")}`
            : filterObject?.time,
      };

      const response = await axios.post(apiUrl, requestBody);

      const data = response.data;

      const amountsToFrom = data?.amounts_to_from?.[0] || {};
      setTransactionsPaginationTotal(data?.total_pages);
      setTransactionsData(data);
      setTotalTransactions({
        total_transaction: data?.total_transaction || 0,
        received: amountsToFrom?.toCount || 0,
        spent: amountsToFrom?.fromSum || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (account && active && triedReconnect) {
      generateTransactionsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterObject?.type,
    filterObject?.time,
    filterObject?.account,
    transactionsCurrentPage,
    account,
    active,
    triedReconnect,
  ]);

  const transactionHeader = [
    {
      name: "From",
      mobileWidth: width >= 500 ? 45 : 100,
      width: 20,
      id: 0,
      height: "40px",
    },
    {
      name: "To",
      width: 20,
      // mobileWidth: 45,
      id: 1,
      height: "40px",
    },
    {
      name: "Type",
      width: 20,
      id: 2,
      height: "40px",
    },
    {
      name: "Time",
      width: 20,
      id: 3,
      height: "40px",
      icon: (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: "2px" }}>
          <path
            d="M7.78064 2.4178L6.44314 1.0803L5.62647 0.259469C5.46007 0.0933205 5.23453 0 4.99939 0C4.76424 0 4.5387 0.0933205 4.3723 0.259469L2.21397 2.4178C1.93064 2.70114 2.1348 3.18447 2.53064 3.18447H7.46397C7.86397 3.18447 8.06397 2.70114 7.78064 2.4178Z"
            fill="white"
          />
          <path
            d="M7.78259 7.5822L6.44509 8.9197L5.62842 9.74053C5.46202 9.90668 5.23649 10 5.00134 10C4.76619 10 4.54066 9.90668 4.37426 9.74053L2.21592 7.5822C1.93259 7.29886 2.13676 6.81553 2.53259 6.81553H7.46592C7.86592 6.81553 8.06592 7.29886 7.78259 7.5822Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "Amount",
      width: 20,
      mobileWidth: width >= 500 ? 45 : false,
      id: 4,
      height: "40px",
      icon: (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: "2px" }}>
          <path
            d="M7.78064 2.4178L6.44314 1.0803L5.62647 0.259469C5.46007 0.0933205 5.23453 0 4.99939 0C4.76424 0 4.5387 0.0933205 4.3723 0.259469L2.21397 2.4178C1.93064 2.70114 2.1348 3.18447 2.53064 3.18447H7.46397C7.86397 3.18447 8.06397 2.70114 7.78064 2.4178Z"
            fill="white"
          />
          <path
            d="M7.78259 7.5822L6.44509 8.9197L5.62842 9.74053C5.46202 9.90668 5.23649 10 5.00134 10C4.76619 10 4.54066 9.90668 4.37426 9.74053L2.21592 7.5822C1.93259 7.29886 2.13676 6.81553 2.53259 6.81553H7.46592C7.86592 6.81553 8.06592 7.29886 7.78259 7.5822Z"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  const footer = {
    link: "/referral",
    label: "All Code",
  };

  const rightPanelData = [
    {
      title: "Recieved",
      value: totalTransactions?.received,
    },
    {
      title: "Spent",
      value: totalTransactions?.spent,
    },
  ];

  const inputs = [
    {
      title: "Choose Account",
      name: "account",
      type: "lable-input-select",
      options: [
        { name: "All", value: "all" },
        { name: "Main", value: "main" },
        { name: "Trade", value: "trade" },
        { name: "Loan", value: "loan" },
      ],
      defaultAny: "Any Account",
      onChange: (e) =>
        setFilterObject((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
    {
      title: "Choose Type",
      name: "type",
      type: "lable-input-select",
      options: [
        { name: "All", value: "all" },
        { name: "Payment", value: "payment" },
        { name: "Deposit", value: "deposit" },
        { name: "Transfer", value: "transfer" },
        { name: "Internal Transaction", value: "internal_transaction" },
        { name: "Withdrawal", value: "withdrawal" },
        { name: "Referral Bonus", value: "referral_bonus" },
      ],
      defaultAny: "Any Type",
      onChange: (e) =>
        setFilterObject((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
    {
      title: "Choose Time",
      name: "time",
      type: "date-picker-input",
      defaultAny: "Any Time",
      onChange: (e) =>
        setFilterObject((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    },
  ];

  const transactionsTableEmpty = {
    label: "No Transaction History",
    icon: <NoHistoryIcon />,
  };
  return (
    <TransactionsUI
      header={"Transactions"}
      description={
        <p className="font-14">
          Total number of operations:{" "}
          <span className="dashboard-transactions-span">
            {totalTransactions?.total_transaction}
          </span>
        </p>
      }
      rightPanelData={rightPanelData}
      footer={footer}
      tableHead={transactionHeader}
      data={transactionsData?.transactions}
      paginationCurrent={transactionsCurrentPage}
      paginationTotal={transactionsPaginationTotal}
      paginationEvent={(page) => setTransactionsCurrentPage(page)}
      inputs={inputs}
      currentObject={filterObject}
      loading={loading}
      tableEmpty={transactionsTableEmpty}
    />
  );
};

export default Transactions;
