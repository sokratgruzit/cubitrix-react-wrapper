import React, { useState, useEffect, useRef } from "react";

import { Dashboard as DashboardUI } from "@cubitrix/cubitrix-react-ui-module";
import { useSelector, useDispatch } from "react-redux";

import { useMobileWidth } from "../hooks/useMobileWidth";
import { NoHistoryIcon } from "../assets/svg";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import axios from "../api/axios";

const Dashboard = () => {
  const [codesTableData, setCodesTableData] = useState([]);
  const [rebatesTableData, setRebatesTableData] = useState([]);
  const [transactionsData, setTransactionsData] = useState({});
  const [totalTransactions, setTotalTransactions] = useState({});

  const [totalReferralData, setTotalReferralData] = useState({
    uni: {
      levelUser: 0,
      totalComission: 0,
    },
    binary: {
      levelUser: 0,
      totalComission: 0,
    },
  });
  const [referralCodeTableLoading, setReferralCodeTableLoading] = useState(false);
  const [referralHistoryTableLoading, setReferralHistoryTableLoading] = useState(false);
  const [transactionsTableLoading, setTransactionsTableLoading] = useState(false);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const accountsData = useSelector((state) => state.appState?.accountsData);
  const accountType = useSelector((state) => state.appState?.dashboardAccountType);
  const dashboardTransactionsDataReload = useSelector(
    (state) => state.appState?.dashboardTransactionsDataReload,
  );

  const { account, active } = useConnect();

  const { width } = useMobileWidth();

  const dispatch = useDispatch();

  const generateTableData = async (table, page) => {
    if (table === "codes") {
      setReferralCodeTableLoading(true);
    } else {
      setReferralHistoryTableLoading(true);
    }

    try {
      const apiUrl = `/api/referral/${
        table === "codes"
          ? "get_referral_code_of_user"
          : "get_referral_rebates_history_of_user"
      }`;

      const requestBody = {
        address: account?.toLowerCase(),
        limit: 3,
        page: 1,
      };

      const response = await axios.post(apiUrl, requestBody);

      const data = response.data;

      if (table === "codes") {
        setCodesTableData(data.referral_code);
        setReferralCodeTableLoading(false);
      } else {
        setRebatesTableData(data.referral_rebates_history);
        setReferralHistoryTableLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateTransactionsData = async () => {
    setTransactionsTableLoading(true);

    try {
      const apiUrl = "/api/transactions/get_transactions_of_user";

      const requestBody = {
        address: account?.toLowerCase(),
        limit: 3,
        page: 1,
      };

      const response = await axios.post(apiUrl, requestBody);

      const data = response.data;
      const amountsToFrom = data?.amounts_to_from?.[0] || {};
      setTransactionsData(data);
      setTotalTransactions({
        total_transaction: data?.total_transaction || 0,
        received: amountsToFrom.toCount || 0,
        spent: amountsToFrom.fromSum || 0,
      });

      setTransactionsTableLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateTotalReferralData = async () => {
    try {
      const apiUrl = "/api/referral/get_referral_code_of_user_dashboard";
      const requestBody = {
        address: account?.toLowerCase(),
      };

      const response = await axios.post(apiUrl, requestBody);

      const data = response.data;

      setTotalReferralData((prev) => ({
        ...prev,
        uni: {
          levelUser: data?.referral_count_binary || 0,
          totalComission: data?.referral_sum_uni[0]?.amount || 0,
        },
        binary: {
          levelUser: data?.referral_count_uni || 0,
          totalComission: data?.referral_sum_binary[0]?.amount || 0,
        },
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const prevDashboardTransactionsDataReload = useRef(dashboardTransactionsDataReload);

  useEffect(() => {
    if (prevDashboardTransactionsDataReload.current !== dashboardTransactionsDataReload) {
      generateTransactionsData();
      prevDashboardTransactionsDataReload.current = dashboardTransactionsDataReload;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTransactionsDataReload]);

  const generateAccountsData = async () => {
    try {
      const apiUrl = "/api/accounts/get_account_balances";
      const requestBody = {
        address: account?.toLowerCase(),
      };

      const response = await axios.post(apiUrl, requestBody);
      const data = response.data;
      dispatch({
        type: "SET_ACCOUNTS_DATA",
        payload: data?.data,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (account && triedReconnect && active) {
      generateAccountsData();
      generateTransactionsData();
      generateTotalReferralData();
      generateTableData("codes");
      generateTableData("rebates");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, triedReconnect, active]);

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

  const referralCodeHeader = [
    {
      id: 0,
      name: "My Referral Code",
      width: 15,
      height: "40px",
    },
    {
      id: 1,
      name: "User Address",
      width: 15,
      mobileWidth: width >= 500 ? 45 : 100,
      height: "40px",
    },
    {
      id: 2,
      name: "User Level",
      width: 15,
      height: "40px",
    },
    {
      id: 3,
      name: "Rate",
      width: 15,
      height: "40px",
    },
    {
      id: 4,
      name: "Total Earned",
      width: 15,
      mobileWidth: width >= 500 ? 45 : false,
      height: "40px",
    },
  ];

  const referralHistoryHeader = [
    {
      id: 0,
      name: "From",
      width: 15,
      mobileWidth: width >= 500 ? 45 : 100,
      height: "40px",
    },
    {
      id: 1,
      name: "Referral Code",
      width: 15,
      height: "40px",
    },
    {
      id: 2,
      name: "Referral Level",
      width: 15,
      height: "40px",
    },
    {
      id: 3,
      name: "Amount",
      width: 15,
      mobileWidth: width >= 500 ? 45 : false,
      height: "40px",
    },
  ];

  const referralCardsData = [
    {
      title: "Uni",
      data: [
        {
          title: "Level User",
          value: totalReferralData?.uni?.levelUser,
        },
        {
          title: "Total Comission",
          value: totalReferralData?.uni?.totalComission,
        },
      ],
    },
    {
      title: "Binary",
      active: true,
      data: [
        {
          title: "Level User",
          value: totalReferralData?.binary?.levelUser,
        },
        {
          title: "Total Comission",
          value: totalReferralData?.binary?.totalComission,
        },
      ],
    },
  ];

  const referralCodeTableEmpty = {
    label: "No Referral Code History",
    icon: <NoHistoryIcon />,
  };

  const referralRebatesTableEmpty = {
    label: "No Referral Rebates History",
    icon: <NoHistoryIcon />,
  };

  const transactionsTableEmpty = {
    label: "No Transaction History",
    icon: <NoHistoryIcon />,
  };

  const cardImgs = {
    atar: "/img/dashboard/atar.png",
    btc: "/img/dashboard/btc.png",
    eth: "/img/dashboard/eth.png",
    usdt: "/img/dashboard/usdt.png",
    gold: "/img/dashboard/gold.png",
    platinum: "/img/dashboard/platinum.png",
  };

  const handleSidebarOpen = (sideBar, accountType) => {
    if (sideBar === "exchange" && accountType) {
      dispatch({
        type: "SET_EXCHANGE_ACCOUNT_TYPE",
        payload: accountType,
      });
    }
    console.log(sideBar, accountType);
    if (sideBar === "withdraw" && accountType) {
      dispatch({
        type: "SET_EXCHANGE_ACCOUNT_TYPE",
        payload: accountType,
      });
    }
    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: true, sideBar },
    });
  };

  function setAccountType(type) {
    dispatch({
      type: "SET_DASHBOARD_ACCOUNT_TYPE",
      payload: type,
    });
  }
  return (
    <DashboardUI
      accountType={accountType}
      setAccountType={setAccountType}
      transactionsData={transactionsData}
      transactionHeader={transactionHeader}
      referralCodeHeader={referralCodeHeader}
      referralHistoryHeader={referralHistoryHeader}
      referralCardsData={referralCardsData}
      codesTableData={codesTableData}
      rebatesTableData={rebatesTableData}
      totalTransactions={totalTransactions}
      referralCodeTableEmpty={referralCodeTableEmpty}
      referralHistoryTableEmpty={referralRebatesTableEmpty}
      transactionsTableEmpty={transactionsTableEmpty}
      referralCodeTableLoading={referralCodeTableLoading}
      referralHistoryTableLoading={referralHistoryTableLoading}
      transactionsTableLoading={transactionsTableLoading}
      accountsData={accountsData}
      cardImgs={cardImgs}
      handleDeposit={() => handleSidebarOpen("deposit")}
      handleExchange={(a, b) => handleSidebarOpen("exchange", b)}
      handleWithdraw={(a, b) => handleSidebarOpen("withdraw", b)}
      handleTransfer={() => handleSidebarOpen("transfer")}
    />
  );
};

export default Dashboard;
