import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  ClaimedReward,
  CurrentStake,
  Earn,
  TotalStaked,
  TotalUnstaked,
  WalletBalance,
} from "../assets/svg";

import { useStake } from "@cubitrix/cubitrix-react-connect-module";

// hooks
import { useTableParameters } from "../hooks/useTableParameters";

// UI
import { Staking, Button } from "@cubitrix/cubitrix-react-ui-module";

// api
import axios from "../api/axios";

const Stake = () => {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  var Router = "0xd472C9aFa90046d42c00586265A3F62745c927c0"; // Staking contract Address
  var tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb"; // Staking Token Address
  const {
    approve,
    stake,
    unstake,
    harvest,
    setMaxWithdrawal,
    handleTimeperiodDate,
    handleDepositAmount,
    handleTimePeriod,
    account,
  } = useStake({ Router, tokenAddress });

  const dispatch = useDispatch();

  const {
    depositAmount,
    balance,
    stakersInfo,
    stackContractInfo,
    timeperiod,
    stakersRecord,
    isAllowance,
    loading,
    timeperiodDate,
  } = useSelector((state) => state.stake);

  const handleConnect = () => {
    if (sideBarOpen) {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen },
      });
    } else {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen, sideBar: "connect" },
      });
    }
  };

  const th = [
    {
      name: "Staked Amount",
      width: 15,
      mobileWidth: 45,
      id: 0,
    },
    {
      name: "Stake Date ",
      width: 15,
      id: 1,
    },
    {
      name: "Unstake Date",
      width: 15,
      id: 2,
    },
    {
      name: "Earn Reward",
      width: 15,
      id: 3,
    },
    {
      name: "Harvest",
      width: 15,
      mobileWidth: 45,
      id: 4,
    },
    {
      name: "",
      width: 10,
      id: 5,
      mobileWidth: 35,
      position: "right",
      className: "buttons-th",
      onClick: (index) => unstake(index),
    },
    {
      name: "",
      width: 10,
      id: 6,
      mobileWidth: 35,
      position: "right",
      className: "buttons-th",
      onClick: (index) => harvest(index),
    },
  ];

  const { mobile, mobileExpand, mobileExpandFunc, width, durationOptions } =
    useTableParameters("staking");

  const accountSummaryData = [
    [
      {
        icon: <CurrentStake />,
        title: "Current Stake",
        value: parseFloat(stakersInfo.currentStaked).toFixed(5),
      },
      {
        icon: <Earn />,
        title: "Earn",
        value: parseFloat(stakersInfo.realtimeReward).toFixed(10),
      },
      {
        icon: <ClaimedReward />,
        title: "Claimed Reward",
        value: parseFloat(stakersInfo.totalClaimedRewardTokenUser).toFixed(5),
      },
    ],
    [
      {
        icon: <WalletBalance />,
        title: "Your Wallet Balance",
        value: balance.toFixed(5),
      },
      {
        icon: <TotalStaked />,
        title: "Total Staked",
        value: parseFloat(stakersInfo.totalStakedTokenUser).toFixed(5),
      },
      {
        icon: <TotalUnstaked />,
        title: "Total Unstaked",
        value: parseFloat(stakersInfo.totalUnstakedTokenUser).toFixed(5),
      },
    ],
  ];

  let tableData = useMemo(() => {
    if (stakersRecord?.length > 0) {
      return stakersRecord.map((item, index) => {
        return (
          <div
            className={`table-parent ${mobileExpand === item.id ? "active" : ""}`}
            key={index}
            onClick={() => {
              mobileExpandFunc(item.id);
            }}
          >
            <div className={"table"}>
              {th?.slice(0, 5).map((i, index) => (
                <div
                  key={index}
                  className={`td col ${i.mobileWidth ? true : false}`}
                  style={{ width: `${mobile ? i.mobileWidth : i.width}%` }}
                >
                  <span>
                    {
                      [
                        item.amount,
                        item.staketime,
                        item.unstaketime,
                        "CML",
                        parseFloat(item.realtimeRewardPerBlock).toFixed(10),
                      ][index]
                    }
                  </span>
                </div>
              ))}
              {width > 940 &&
                th.slice(5, 7).map((i, index) => (
                  <div
                    key={index}
                    className={`td col ${i.position} ${i.mobileWidth ? true : false}`}
                    style={{
                      width: `${mobile ? i.mobileWidth : i.width}%`,
                      marginRight: `${width < 1450 ? "10px" : "0"}`,
                    }}
                  >
                    <Button
                      element={"staking-button"}
                      label={index === 0 ? "Unstake" : "Harvest"}
                      active={index === 0}
                      customStyles={{ borderRadius: "32px" }}
                      onClick={() => i.onClick(index)}
                      disabled={index === 0 ? item.unstaked : item.withdrawan}
                    />
                  </div>
                ))}
            </div>
            <div className="table-more" />
            <div className="icon-place">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.299 1.33325L6.47141 5.16089C6.01937 5.61293 5.27968 5.61293 4.82764 5.16089L1 1.33325"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="table-mobile">
              <div className="table-mobile-content">
                {[1, 2, 3].map((index) => (
                  <div className="td" key={index}>
                    <div className="mobile-ttl">{th[index].name}</div>
                    <span>
                      {index === 1 && item.staketime}
                      {index === 2 && item.unstaketime}
                      {index === 3 && "CML"}
                    </span>
                  </div>
                ))}
                {width <= 940 && (
                  <div className="table-buttons">
                    {[5, 6].map((index) => (
                      <div className="td" key={index}>
                        <Button
                          element="staking-button"
                          label={index === 5 ? "Unstake" : "Harvest"}
                          active={index === 5}
                          customStyles={{ borderRadius: "32px" }}
                          onClick={() => th[index].onClick(index)}
                          disabled={index === 5 ? item.unstaked : item.withdrawan}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      });
    }
    // eslint-disable-next-line
  }, [stakersRecord]);

  const handleSubmit = () => {
    if (!account) {
      handleConnect();
    }
    if (account && isAllowance) {
      approve();
    }
    if (account && !isAllowance) {
      stake(async () => {
        await axios.post(
          "/api/accounts/activate-account",
          {
            address: account,
          }
        );
      });
    }
  };

  return (
    <>
      <Staking
        account={account}
        durationOptions={durationOptions}
        stackContractInfo={stackContractInfo}
        loading={loading}
        isAllowance={isAllowance}
        handleCalculatorSubmit={handleSubmit}
        timeperiod={timeperiod}
        handleTimePeriod={handleTimePeriod}
        depositAmount={depositAmount}
        handleDepositAmount={handleDepositAmount}
        handleTimeperiodDate={handleTimeperiodDate}
        timeperiodDate={timeperiodDate}
        handleMaxClick={setMaxWithdrawal}
        accountSummaryData={accountSummaryData}
        tableData={tableData}
        tableHead={th}
      />
    </>
  );
};

export default Stake;
