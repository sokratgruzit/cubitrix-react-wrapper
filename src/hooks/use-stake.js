import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import STACK_ABI from "../abi/stack.json";
import WBNB from "../abi/WBNB.json";
import moment from "moment";

// import { INIT_STATE } from "../reducers/stakeReducer";

import { useWeb3React } from "@web3-react/core";

const INIT_STATE = {
  stackContractInfo: {
    totalStakers: 0,
    totalStakedToken: 0,
  },
  stakersInfo: {
    totalStakedTokenUser: 0,
    totalUnstakedTokenUser: 0,
    totalClaimedRewardTokenUser: 0,
    currentStaked: 0,
    realtimeReward: 0,
    stakeCount: 0,
    alreadyExists: false,
  },
  depositAmount: "",
  timeperiod: 0,
  balance: 0,
  stakersRecord: [],
  isAllowance: false,
  loading: false,
  hasMoreData: false,
  timeperiodDate: moment().add(30, "days").format("DD/MM/YYYY h:mm A"),
};

export const useStake = ({ Router, tokenAddress }) => {
  let { account, library } = useWeb3React();
  var web3Obj = library;

  const { depositAmount, timeperiod } = useSelector((state) => state.stake);

  const dispatch = useDispatch();

  const notify = (isError, msg) => {
    if (isError) {
      console.log("error", msg);
    } else {
      console.log("success", msg);
    }
  };

  const checkAllowance = async () => {
    try {
      var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      var decimals = await tokenContract.methods.decimals().call();
      var getBalance = await tokenContract.methods.balanceOf(account).call();

      var pow = 10 ** decimals;
      var balanceInEth = getBalance / pow;
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          balance: balanceInEth,
        },
      });
      var allowance =
        (await tokenContract.methods.allowance(account, Router).call()) / pow;

      const depositNumber = Number(depositAmount);
      if (allowance < 1 || (depositNumber > 0 && allowance < depositNumber)) {
        dispatch({
          type: "UPDATE_STAKE_STATE",
          payload: {
            isAllowance: true,
          },
        });
      } else if (allowance > 1e30) {
        dispatch({
          type: "UPDATE_STAKE_STATE",
          payload: {
            isAllowance: true,
          },
        });
      } else {
        dispatch({
          type: "UPDATE_STAKE_STATE",
          payload: {
            isAllowance: false,
          },
        });
      }
    } catch (err) {
      console.log("isAlowance error", err);
    }
  };

  const approve = async (callback, errCallback) => {
    try {
      var contract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      var amountIn = 10 ** 69;
      amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });
      await contract.methods
        .approve(Router, amountIn.toString())
        .send({ from: account })
        .then(() => {
          if (callback) callback();
          dispatch({
            type: "UPDATE_STAKE_STATE",
            payload: {
              isAllowance: false,
            },
          });
        });
    } catch (err) {
      if (errCallback) errCallback(err);
      notify(true, err.message);
    }
  };

  const stake = async (callback, errCallback) => {
    if (isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      notify(true, "Error! please enter amount");
      return;
    }
    await checkAllowance();
    try {
      var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      const decimals = await tokenContract.methods.decimals().call();

      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);

      var pow = 10 ** decimals;
      var amountIn = depositAmount * pow;
      amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });

      await contract.methods
        .stake(amountIn.toString(), timeperiod.toString())
        .send({ from: account })
        .then((err) => {
          getStackerInfo();
          dispatch({
            type: "UPDATE_STAKE_STATE",
            payload: {
              depositAmount: INIT_STATE.depositAmount,
              timeperiodDate: INIT_STATE.timeperiodDate,
              timeperiod: INIT_STATE.timeperiod,
            },
          });
          if (callback) callback();
          notify(false, "Staking process complete.");
        });
    } catch (err) {
      if (errCallback) errCallback(err);
      notify(true, err.message);
    }
  };

  const unstake = async (index, callback, errCallback) => {
    try {
      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      await contract.methods
        .unstake(index.toString())
        .send({ from: account })
        .then((result) => {
          if (callback) callback(index);
          getStackerInfo();
          notify(false, "successfully unstake");
        });
    } catch (err) {
      if (errCallback) errCallback(err);
      notify(true, "unstake fail");
    }
  };

  const harvest = async (index, callback, errCallback) => {
    try {
      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      await contract.methods
        .harvest(index.toString())
        .send({ from: account })
        .then((err) => {
          if (callback) callback(index);
          getStackerInfo();
          checkAllowance();
          notify(false, "Reward successfully harvested");
        });
    } catch (err) {
      if (errCallback) errCallback(err);
      notify(true, err.message);
    }
  };

  const getStackerInfo = async (startIndex, count) => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });

    try {
      const tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      const contract = new web3Obj.eth.Contract(STACK_ABI, Router);

      let [
        decimals,
        getBalance,
        totalStakedToken,
        totalStakers,
        realtimeReward,
        Stakers,
      ] = await Promise.all([
        tokenContract.methods.decimals().call(),
        tokenContract.methods.balanceOf(account.toString()).call(),
        contract.methods.totalStakedToken.call().call(),
        contract.methods.totalStakers.call().call(),
        contract.methods.realtimeReward(account).call(),
        contract.methods.Stakers(account).call(),
      ]);

      const pow = 10 ** decimals;
      const balanceInEth = getBalance / pow;

      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          balance: balanceInEth,
        },
      });

      let totalStakedTokenUser = Stakers.totalStakedTokenUser / pow;
      let totalUnstakedTokenUser = Stakers.totalUnstakedTokenUser / pow;
      let currentStaked = totalStakedTokenUser - totalUnstakedTokenUser;
      totalStakedToken = totalStakedToken / pow;

      Stakers.totalStakedTokenUser = totalStakedTokenUser;
      Stakers.totalUnstakedTokenUser = totalUnstakedTokenUser;
      Stakers.currentStaked = currentStaked;
      Stakers.realtimeReward = realtimeReward / pow;
      Stakers.totalClaimedRewardTokenUser = Stakers.totalClaimedRewardTokenUser / pow;

      const stakersRecord = [];
      const endIndex = Math.min(startIndex + count, parseInt(Stakers.stakeCount));

      const recordsPromises = [];
      for (let i = startIndex; i < endIndex; i++) {
        recordsPromises.push(contract.methods.stakersRecord(account, i).call());
        recordsPromises.push(
          contract.methods.realtimeRewardPerBlock(account, i.toString()).call(),
        );
      }

      const recordsResults = await Promise.all(recordsPromises);

      for (let i = 0; i < recordsResults.length; i += 2) {
        let stakersRecordData = recordsResults[i];
        let realtimeRewardPerBlock = recordsResults[i + 1];

        stakersRecordData.realtimeRewardPerBlock = realtimeRewardPerBlock[0] / pow;
        stakersRecordData.unstaketime = moment
          .unix(stakersRecordData.unstaketime)
          .format("DD/MM/YYYY h:mm A");
        stakersRecordData.staketime = moment
          .unix(stakersRecordData.staketime)
          .format("DD/MM/YYYY h:mm A");
        stakersRecord.push(stakersRecordData);
      }

      const hasMoreData = endIndex < parseInt(Stakers.stakeCount);

      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          stakersInfo: Stakers,
          stackContractInfo: {
            totalStakers,
            totalStakedToken,
          },
          hasMoreData,
          loading: false,
        },
      });
      dispatch({
        type: "UPDATE_STAKERS_RECORD",
        payload: {
          stakersRecord,
        },
      });
    } catch (err) {
      // Handle error
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          stakersInfo: {
            totalStakedTokenUser: 0,
            totalUnstakedTokenUser: 0,
            totalClaimedRewardTokenUser: 0,
            currentStaked: 0,
            realtimeReward: 0,
            stakeCount: 0,
            alreadyExists: false,
          },
          stakersRecord: [],
          setStackContractInfo: {
            totalStakers: 0,
            totalStakedToken: 0,
          },
          loading: false,
          balance: 0,
        },
      });

      console.error(err);
    }
  };

  const setMaxWithdrawal = async () => {
    var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
    var decimals = await tokenContract.methods.decimals().call();
    var getBalance = await tokenContract.methods.balanceOf(account.toString()).call();
    var pow = 10 ** decimals;
    var balanceInEth = getBalance / pow;
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        depositAmount: balanceInEth.toFixed(5),
      },
    });
  };

  const handleTimeperiodDate = (period) => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      timeperiodDate: moment().add(period, "days").format("DD/MM/YYYY h:mm A"),
    });
  };

  const handleDepositAmount = (depositAmount) => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        depositAmount,
      },
    });
  };

  const handleTimePeriod = (timeperiod) => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        timeperiod,
      },
    });
  };

  const values = useMemo(
    () => ({
      checkAllowance,
      approve,
      stake,
      unstake,
      harvest,
      getStackerInfo,
      setMaxWithdrawal,
      handleTimeperiodDate,
      handleDepositAmount,
      handleTimePeriod,
      account,
    }),
    // eslint-disable-next-line
    [account, depositAmount, timeperiod],
  );

  return values;
};
