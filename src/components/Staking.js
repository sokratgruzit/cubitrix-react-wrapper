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
  // useStake,
  STAKE_INIT_STATE,
  useConnect,
} from "@cubitrix/cubitrix-react-connect-module";
import { useStake } from "../hooks/use-stake";

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
import { toast } from "react-toastify";

const Staking = () => {
  const [createStakingPopUpActive, setCreateStakingPopUpActive] = useState(false);
  const [approveResonse, setApproveResonse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);
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
      getStackerInfo(0 + 5 * fetchCount, 10 + 5 * fetchCount)
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

  async function refetchStakersRecord() {
    try {
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          stakersRecord: [],
        },
      });
      setLoading(true);
      setIsFetching(false);
      await getStackerInfo(0, 10 + 5 * fetchCount);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

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

  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [harvestLoading, setHarvestLoading] = useState(false);
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
      onClick: (index) => {
        setUnstakeLoading(true);
        unstake(
          index,
          () => {
            setUnstakeLoading(false);
            axios
              .post("api/transactions/unstake_transaction", {
                address: account,
                index,
              })
              .then((res) => {
                refetchStakersRecord();
              })
              .catch((e) => {
                console.log(e);
              });
          },
          () => {
            setUnstakeLoading(false);
          },
        );
      },
    },
    {
      name: "",
      width: 7,
      id: 6,
      mobileWidth: 20,
      className: "table-button-none",
      onClick: (index) => {
        setHarvestLoading(true);
        harvest(
          index,
          () => {
            setHarvestLoading(false);
            refetchStakersRecord();
          },
          () => {
            setHarvestLoading(false);
          },
        );
      },
    },
  ];

  const { durationOptions } = useTableParameters("staking");

  const accountSummaryData = [
    [
      {
        icon: <CurrentStake />,
        title: "Current Stake",
        value: stakersInfo.currentStaked,
      },
      {
        icon: <Earn />,
        title: "Earn",
        value: stakersInfo.realtimeReward,
      },
      {
        icon: <ClaimedReward />,
        title: "Claimed Reward",
        value: stakersInfo.totalClaimedRewardTokenUser,
      },
    ],
    [
      {
        icon: <WalletBalance />,
        title: "Your Wallet Balance",
        value: balance,
      },
      {
        icon: <TotalStaked />,
        title: "Total Staked",
        value: stakersInfo.totalStakedTokenUser,
      },
      {
        icon: <TotalUnstaked />,
        title: "Total Unstaked",
        value: stakersInfo.totalUnstakedTokenUser,
      },
    ],
  ];

  const [stakingLoading, setStakingLoading] = useState(false);
  const handleCalculatorSubmit = async () => {
    setApproveResonse(null);
    if (!account) {
      handleConnect();
    }

    setStakingLoading(true);
    if (account && isAllowance) {
      approve(
        () => {
          setStakingLoading(false);
          toast.success("Approved successfully, please stake desired amount.", {
            autoClose: 8000,
          });
        },
        () => {
          setStakingLoading(false);
          toast.error("Approval failed, please try again.", {
            autoClose: 8000,
          });
        },
      );
    }
    if (account && !isAllowance) {
      stake(
        async () => {
          await axios
            .post(
              "/api/accounts/activate-account",
              {
                address: account,
              },
              {
                timeout: 120000,
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
          setStakingLoading(false);
          refetchStakersRecord();
          toast.success("Staked successfully.", {
            autoClose: 8000,
          });
          handleDepositAmount("");
          handleTimePeriod(0);
          setTimeout(() => {
            setCreateStakingPopUpActive(false);
          }, 3000);
        },
        () => {
          setStakingLoading(false);
          toast.error("Staking failed, please try again.", {
            autoClose: 8000,
          });
        },
      );
    }
  };

  const tableEmptyData = {
    label: "Stake to earn Complend reward",
    button: (
      <Button
        element={"referral-button"}
        label={"Create Staking"}
        icon={<AddSquareIcon />}
        onClick={handlePopUpOpen}
        customStyles={{ height: "44px", flexDirection: "row" }}
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
      setFetchCount((prevCount) => prevCount + 1);
    }
  }, [isLoadMoreButtonOnScreen]);

  return (
    <>
      <input 
      />
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
        unstakeLoading={unstakeLoading}
        harvestLoading={harvestLoading}
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
                stakingLoading,
              }}
              approveResonse={approveResonse}
            />
          }
          label={"Staking Calculator"}
          handlePopUpClose={handleClose}
          description={"Stake Complend to earn Complend reward"}
        />
      )}
    </>
  );
};

export default Staking;
