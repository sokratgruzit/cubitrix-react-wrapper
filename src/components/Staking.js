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
  const appState = useSelector((state) => state.appState);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const { active, account } = useConnect();
  const hasMoreData = useSelector((state) => state.stake.hasMoreData);
  const isActive = appState?.userData?.active;

  const { width } = useMobileWidth();

  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  var Router = process.env.REACT_APP_STAKING_CONTRACT_ADDRESS;
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
  } = useStake({ Router, tokenAddress: process.env.REACT_APP_TOKEN_ADDRESS });

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

  const updateState = async (callback) => {
    await axios
      .post("/api/accounts/get_account", {})
      .then((res) => {
        let exts1 = res.data.data?.accounts?.[0].extensions;
        if (res.data.data?.accounts?.[0]?.active) {
          exts1.dashboard = "true";
        }

        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.data.accounts[0],
        });
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: exts1,
        });
        dispatch({
          type: "SET_EXTENSIONS_LOADED",
          payload: true,
        });
        dispatch({
          type: "SET_ACCOUNTS_DATA",
          payload: res.data.data.accountBalances,
        });
        if (callback) callback();
      })
      .catch((e) => {
        console.log(e);
      });
  };

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

  const currencyStakesTableHead = [
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
      name: "Percentage",
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
  const handleCalculatorSubmit = async (stakeAfterApprove) => {
    setApproveResonse(null);
    if (!account) {
      handleConnect();
    }

    async function handleStake() {
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
                updateState();
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

    setStakingLoading(true);
    if (account && isAllowance) {
      approve(
        () => {
          setStakingLoading(false);
          toast.success("Approved successfully, please stake desired amount.", {
            autoClose: 8000,
          });
          if (stakeAfterApprove) {
            handleStake();
          }
        },
        () => {
          setBalanceStakeLoading(false);
          setStakingLoading(false);
          toast.error("Approval failed, please try again.", {
            autoClose: 8000,
          });
        },
      );
    }
    if (account && !isAllowance) {
      handleStake();
    }
  };

  const tableEmptyData = {
    label: "Stake to earn A1 reward",
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

  const [currencyStakes, setCurrencyStakes] = useState([]);
  const [currencyStakesLoading, setCurrencyStakesLoading] = useState(false);
  useEffect(() => {
    async function getCurrencyStakes() {
      setCurrencyStakesLoading(true);
      axios
        .post("/api/transactions/get_currency_stakes", {})
        .then((res) => {
          setCurrencyStakes(res?.data);
          setCurrencyStakesLoading(false);
        })
        .catch((e) => {
          setCurrencyStakesLoading(false);
        });
    }
    getCurrencyStakes();
  }, []);

  const [balanceStakeLoading, setBalanceStakeLoading] = useState(false);
  async function handleWalletSubmit() {
    setBalanceStakeLoading(true);
    try {
      axios
        .post("/api/transactions/make_withdrawal", {
          address_to: account,
          amount: +depositAmount + 2,
          accountType: "ATAR",
          rate: appState?.rates?.["atr"]?.usd,
        })
        .then((res) => {
          toast.success(
            "A1 tokens successfully withdrawn. Now you can continue staking.",
            {
              autoClose: 8000,
            },
          );
          handleCalculatorSubmit(true);
        })
        .catch((e) => {
          toast.error(
            e?.response?.data?.message ?? "Withdrawal failed, please try again.",
            {
              autoClose: 8000,
            },
          );
          setBalanceStakeLoading(false);
        });
    } catch {}
  }

  return (
    <>
      <StakingUI
        account={account}
        stackContractInfo={stackContractInfo}
        loading={loading || balanceStakeLoading}
        accountSummaryData={accountSummaryData}
        tableHead={th}
        currencyStakesTableHead={currencyStakesTableHead}
        stakersRecord={stakersRecord}
        tableEmptyData={tableEmptyData}
        handlePopUpOpen={handlePopUpOpen}
        hasMoreData={hasMoreData}
        infiniteScrollRef={infiniteScrollRef}
        isFetching={isFetching}
        unstakeLoading={unstakeLoading}
        harvestLoading={harvestLoading}
        isActive={isActive}
        currencyStakes={currencyStakes}
        currencyStakesLoading={currencyStakesLoading}
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
                handleWalletSubmit,
              }}
              approveResonse={approveResonse}
              isActive={isActive}
            />
          }
          label={"Staking Calculator"}
          handlePopUpClose={handleClose}
          description={"Stake A1 to earn A1 reward"}
        />
      )}
    </>
  );
};

export default Staking;
