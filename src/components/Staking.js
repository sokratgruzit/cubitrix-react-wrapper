import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  ClaimedReward,
  CurrentStake,
  Earn,
  TotalStaked,
  TotalUnstaked,
  WalletBalance,
  AddSquareIcon,
} from "../assets/svg";

// hooks
import {
  useStake,
  STAKE_INIT_STATE,
  useConnect,
} from "@cubitrix/cubitrix-react-connect-module";
import { useTableParameters } from "../hooks/useTableParameters";
import { useMobileWidth } from "../hooks/useMobileWidth";
import { useOnScreen } from "../hooks/useOnScreen";

// UI
import {
  Staking as StakingUI,
  Button,
  Popup,
  Calculator,
} from "@cubitrix/cubitrix-react-ui-module";

// api
import axios from "../api/axios";
import { useEffect } from "react";
import { createRef } from "react";

const Staking = () => {
  const [createStakingPopUpActive, setCreateStakingPopUpActive] = useState(false);
  const [approveResonse, setApproveResonse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(10);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const { active, account } = useConnect();
  const hasMoreData = useSelector((state) => state.stake.hasMoreData);

  const { width } = useMobileWidth();

  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  var Router = "0xd472C9aFa90046d42c00586265A3F62745c927c0"; // Staking contract Address
  var tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb"; // Staking Token Address
  const {
    approve,
    stake,
    unstake,
    harvest,
    setMaxWithdrawal: handleMaxClick,
    handleTimeperiodDate,
    handleDepositAmount,
    handleTimePeriod,
    getStackerInfo,
    checkAllowance,
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
    timeperiodDate,
  } = useSelector((state) => state.stake);

  useEffect(() => {
    if (account && triedReconnect && active) {
      getStackerInfo(0, fetchCount)
        .then(() => {
          setIsFetching(false);
          setLoading(false);
        })
        .catch((error) => {
          setIsFetching(false);
          setLoading(false);
        });
    }
  }, [account, triedReconnect, active, fetchCount]);

  useEffect(() => {
    if (account && triedReconnect && active) {
      checkAllowance();
    }
    // eslint-disable-next-line
  }, [account, triedReconnect, active, depositAmount]);

  useEffect(() => {
    if (!account && triedReconnect && !active) {
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          ...STAKE_INIT_STATE,
        },
      });
    }
    // eslint-disable-next-line
  }, [account, triedReconnect, active]);

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

  const handlePopUpOpen = () => {
    setCreateStakingPopUpActive(true);
  };

  const th = [
    {
      name: "Staked Amount",
      width: 25,
      mobileWidth: width > 400 ? 45 : 100,
      id: 0,
    },
    {
      name: "Stake Date",
      width: 25,
      id: 1,
    },
    {
      name: "Unstake Date",
      width: 25,
      id: 2,
    },
    {
      name: "Harvest",
      width: 25,
      mobileWidth: width > 400 ? 45 : false,
      id: 4,
    },
    {
      name: "",
      width: 10,
      id: 5,
      mobileWidth: 35,
      className: "table-button-none",
      onClick: (index) => unstake(index),
    },
    {
      name: "",
      width: 7,
      id: 6,
      mobileWidth: 20,
      className: "table-button-none",
      onClick: (index) => harvest(index),
    },
  ];

  const { durationOptions } = useTableParameters("staking");

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

  const handleCalculatorSubmit = async () => {
    setApproveResonse(null);
    if (!account) {
      handleConnect();
    }

    if (account && isAllowance) {
      approve(() => {
        setApproveResonse({
          status: "success",
          message: "Approved successfully, please stake desired amount.",
        });
      });
    }
    if (account && !isAllowance) {
      stake(async () => {
        await axios
          .post(
            "/api/accounts/activate-account",
            {
              address: account,
            },
            {
              timeout: 60000,
            },
          )
          .then((res) => {
            if (res.data?.account) {
              dispatch({
                type: "SET_SYSTEM_ACCOUNT_DATA",
                payload: res.data.account,
              });
            }
          })
          .catch((e) => {});
        handleTimePeriod(0);
        handleDepositAmount("");
        setCreateStakingPopUpActive(false);
      });
    }
  };

  const tableEmptyData = {
    label: "Stake to earn Complend reward",
    button: (
      <Button
        element={"referral-button"}
        label={"Create Staking"}
        icon={<AddSquareIcon color={`#00C6FF`} />}
        onClick={handlePopUpOpen}
      />
    ),
  };

  const handleClose = () => {
    handleTimePeriod(0);
    handleDepositAmount("");
    setCreateStakingPopUpActive(false);
  };

  const infiniteScrollRef = createRef();
  const isLoadMoreButtonOnScreen = useOnScreen(infiniteScrollRef);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoadMoreButtonOnScreen) {
      setIsFetching(true);
      setFetchCount((prevCount) => prevCount + 5);
    }
  }, [isLoadMoreButtonOnScreen]);

  return (
    <>
      <StakingUI
        account={account}
        stackContractInfo={stackContractInfo}
        loading={loading}
        accountSummaryData={accountSummaryData}
        tableHead={th}
        stakersRecord={stakersRecord}
        tableEmptyData={tableEmptyData}
        handlePopUpOpen={handlePopUpOpen}
        hasMoreData={hasMoreData}
        infiniteScrollRef={infiniteScrollRef}
        isFetching={isFetching}
      />
      {createStakingPopUpActive && (
        <Popup
          popUpElement={
            <Calculator
              {...{
                durationOptions,
                handleCalculatorSubmit,
                handleMaxClick,
                loading,
                isAllowance,
                account,
                timeperiod,
                handleTimePeriod,
                depositAmount,
                handleDepositAmount,
                timeperiodDate,
                handleTimeperiodDate,
              }}
              approveResonse={approveResonse}
            />
          }
          label={"Staking Calculator"}
          handlePopUpClose={handleClose}
          description={"Stake Complend to earn Complend reward"}
          headerCustomStyles={{ background: "#272C57" }}
        />
      )}
    </>
  );
};

export default Staking;
