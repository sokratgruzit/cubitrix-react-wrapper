import React, { useState, useEffect, useRef, useMemo } from "react";

import { Dashboard as DashboardUI } from "@cubitrix/cubitrix-react-ui-module";
import { useSelector, useDispatch } from "react-redux";

import { useMobileWidth } from "../hooks/useMobileWidth";
import { NoHistoryIcon } from "../assets/svg";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import axios from "../api/axios";

const Dashboard = () => {
  const [rebatesTableData, setRebatesTableData] = useState([]);
  const [transactionsData, setTransactionsData] = useState({});
  const [totalTransactions, setTotalTransactions] = useState({});

  const [totalReferralData, setTotalReferralData] = useState(false);

  const [referralHistoryTableLoading, setReferralHistoryTableLoading] = useState(false);
  const [transactionsTableLoading, setTransactionsTableLoading] = useState(false);
  const extensions = useSelector((state) => state.extensions.activeExtensions);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const accountsData = useSelector((state) => state.appState?.accountsData);
  const accountType = useSelector((state) => state.appState?.dashboardAccountType);
  const userData = useSelector((state) => state.appState?.userData);
  const appState = useSelector((state) => state.appState);
  const dashboardTransactionsDataReload = useSelector(
    (state) => state.appState?.dashboardTransactionsDataReload,
  );

  const [referralHistoryType, setReferralHistoryType] = useState("uni");

  const mainAccount = useMemo(
    () => accountsData.find((acc) => acc.account_category === "main"),
    [accountsData],
  );

  const { account, active } = useConnect();

  const { width } = useMobileWidth();

  const dispatch = useDispatch();

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
        received: amountsToFrom.toSum || 0,
        spent: amountsToFrom.fromSum || 0,
      });

      setTransactionsTableLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let getTotalData = async () => {
    try {
      const { data } = await axios.post("/api/referral/get_reerral_global_data");
      setTotalReferralData(data);
    } catch (err) {
      console.log(err);
    }
  };
  const [referralLeftRight, setReferralLeftRight] = useState({});
  async function generateReferralLeftRight() {
    try {
      const [binaryCommissionResponse, uniCommissionResponse] = await Promise.all([
        axios.post("/api/referral/binary_comission_count_user", {
          address: userData?.address?.toLowerCase(),
        }),
        axios.post("/api/referral/uni_comission_count_user", {
          address: userData?.address?.toLowerCase(),
        }),
      ]);

      const binaryResults = binaryCommissionResponse.data.results;
      const uniResults = uniCommissionResponse.data.results;

      setReferralLeftRight({ ...binaryResults, uni: uniResults });
    } catch (e) {
      console.error("An error occurred:", e);
    }
  }

  const prevDashboardTransactionsDataReload = useRef(dashboardTransactionsDataReload);

  useEffect(() => {
    if (prevDashboardTransactionsDataReload.current !== dashboardTransactionsDataReload) {
      generateTransactionsData();
      prevDashboardTransactionsDataReload.current = dashboardTransactionsDataReload;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTransactionsDataReload]);

  useEffect(() => {
    if (appState?.accountSigned) {
      generateTransactionsData();
      getTotalData();
      generateReferralLeftRight();
    }
    // eslint-disable-next-line
  }, [appState?.accountSigned]);

  const transactionHeader = [
    {
      name: "From",
      mobileWidth: width >= 500 ? 45 : 100,
      width: 16.6,
      id: 0,
      height: "40px",
    },
    {
      name: "To",
      width: 16.6,
      // mobileWidth: 45,
      id: 1,
      height: "40px",
    },
    {
      name: "Type",
      width: 16.6,
      id: 2,
      height: "40px",
    },
    {
      name: "Time",
      width: 16.6,
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
      width: 16.6,
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
    {
      name: "Status",
      width: 16.6,
      mobileWidth: width >= 500 ? 45 : false,
      id: 5,
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

  const referralHistoryTh = useMemo(() => {
    if (referralHistoryType === "uni") {
      return [
        {
          name: "User Address",
          width: 15,
          mobileWidth: 45,
          id: 0,
        },
        {
          name: "User Level",
          width: 15,
          id: 1,
        },
        {
          name: "Amount",
          width: 15,
          id: 2,
        },
        {
          name: "Date",
          width: 15,
          mobileWidth: 45,
          id: 3,
        },
      ];
    } else {
      return [
        {
          name: "Amount",
          width: 15,
          mobileWidth: 45,
          id: 0,
        },
        {
          name: "Position",
          width: 15,
          id: 1,
        },
        {
          name: "Date",
          width: 15,
          id: 2,
        },
      ];
    }
  }, [referralHistoryType]);

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
    usdc: "/img/dashboard/usdc.png",
    gold: "/img/dashboard/gold.png",
    platinum: "/img/dashboard/platinum.png",
  };

  const handleSidebarOpen = (sideBar, accountType) => {
    if (sideBar === "exchange" && accountType) {
      dispatch({
        type: "SET_EXCHANGE_ACCOUNT_TYPE",
        payload: accountType,
      });
    } else if (sideBar === "withdraw" && accountType) {
      dispatch({
        type: "SET_EXCHANGE_ACCOUNT_TYPE",
        payload: accountType,
      });
    } else if (sideBar === "stake" && accountType) {
      dispatch({
        type: "SET_EXCHANGE_ACCOUNT_TYPE",
        payload: accountType,
      });
    } else if (sideBar === "transfer" && accountType) {
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

  useEffect(() => {
    if (appState?.accountSigned) {
      getReferralHistory(referralHistoryType ?? "uni");
    }
  }, [appState?.accountSigned, referralHistoryType]);

  async function getReferralHistory(type) {
    try {
      setReferralHistoryTableLoading(true);
      axios
        .post(
          type === "uni"
            ? `/api/referral/get_referral_uni_transactions`
            : `/api/referral/get_referral_binary_transactions`,
          {
            limit: 3,
            page: 1,
          },
        )
        .then((res) => {
          setRebatesTableData(res.data.transaction);
          setReferralHistoryTableLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setReferralHistoryTableLoading(false);
        });
    } catch (e) {
      console.log(e?.response);
    }
  }

  const referralHistoryRightButtons = (
    <div className={`referral-inner-table-more`}>
      <div
        className={`referral-table-more-svg ${
          referralHistoryType === "uni" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => {
          setReferralHistoryType("uni");
        }}>
        Uni
      </div>
      <div
        className={`referral-table-more-svg ${
          referralHistoryType === "binary" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => setReferralHistoryType("binary")}>
        Binary
      </div>
    </div>
  );

  // useEffect(() => {
  //   axios
  //     .post("/api/accounts/manage_extensions", {
  //       address: account,
  //       extensions: { staking: "true", trade: "true" },
  //     })
  //     .then((res) => {
  //       if (res?.data?.account) {
  //         dispatch({
  //           type: "UPDATE_ACTIVE_EXTENSIONS",
  //           payload: res.data.account.extensions,
  //         });
  //       }
  //       // activateAccount();
  //     })
  //     .catch((e) => {
  //       // activateAccount();
  //       console.log(e.response);
  //     });
  // }, []);

  return (
    <DashboardUI
      accountType={accountType}
      setAccountType={setAccountType}
      transactionsData={transactionsData}
      transactionHeader={transactionHeader}
      referralHistoryHeader={referralHistoryTh}
      referralHistoryTableType={
        referralHistoryType === "uni" ? "referral-history" : "referral-history-binary"
      }
      rebatesTableData={rebatesTableData}
      totalTransactions={totalTransactions}
      referralHistoryTableEmpty={referralRebatesTableEmpty}
      transactionsTableEmpty={transactionsTableEmpty}
      referralHistoryTableLoading={referralHistoryTableLoading}
      transactionsTableLoading={transactionsTableLoading}
      accountsData={accountsData}
      cardImgs={cardImgs}
      handleDeposit={() => handleSidebarOpen("deposit")}
      handleExchange={(a, b) => handleSidebarOpen("exchange", b)}
      handleWithdraw={(a, b) => handleSidebarOpen("withdraw", b)}
      handleTransfer={(a, b) => handleSidebarOpen("transfer", b)}
      handleStake={(a, b) => handleSidebarOpen("stake", b)}
      referralHistoryButtonsRight={referralHistoryRightButtons}
      tier={userData?.tier?.value}
      extensions={extensions}
      stakedTotal={userData?.stakedTotal}
      referralTotal={referralLeftRight}
    />
  );
};

export default Dashboard;
