import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import STACK_ABI from "../abi/stack.json";
import WBNB from "../abi/WBNB.json";
import moment from "moment";

// import { useConnect } from "@cubitrix/cubitrix-react-connect-module";
import { useConnect } from "./use-connect";

import { INIT_STATE } from "../store/stakeReducer";

export const useStake = ({ Router, tokenAddress }) => {
  const { library } = useConnect();
  var web3Obj = library;

  const { account } = useSelector((state) => state.connect);

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
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });
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
      var allowance = await tokenContract.methods.allowance(account, Router).call();

      if (allowance <= 2) {
        dispatch({
          type: "UPDATE_STAKE_STATE",
          payload: {
            isAllowance: true,
          },
        });
      }
      if (depositAmount > 0) {
        var amount = depositAmount * pow;
        if (allowance < amount) {
          dispatch({
            type: "UPDATE_STAKE_STATE",
            payload: {
              isAllowance: true,
            },
          });
        }
      }
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          loading: false,
        },
      });
    } catch (err) {
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          loading: false,
        },
      });
    }
  };

  const approve = async (callback) => {
    console.log("goes to approve");
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });
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
              loading: false,
            },
          });
        });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          loading: false,
        },
      });
      notify(true, err.message);
    }
  };

  const stake = async (callback) => {
    if (isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      notify(true, "Error! please enter amount");
      return;
    }
    await checkAllowance();
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });

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
              loading: false,
              depositAmount: INIT_STATE.depositAmount,
              timeperiodDate: INIT_STATE.timeperiodDate,
              timeperiod: INIT_STATE.timeperiod,
            },
          });
          if (callback) callback();
          notify(false, "Staking process complete.");
        });
    } catch (err) {
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          loading: false,
        },
      });
      notify(true, err.message);
    }
  };

  const unstake = async (index) => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });
    try {
      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      await contract.methods
        .unstake(index.toString())
        .send({ from: account })
        .then((result) => {
          getStackerInfo();
          dispatch({
            type: "UPDATE_STAKE_STATE",
            payload: {
              loading: false,
            },
          });
          notify(false, "successfully unstake");
        });
    } catch (err) {
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          loading: false,
        },
      });
      notify(true, "unstake fail");
    }
  };

  const harvest = async (index) => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });
    try {
      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      await contract.methods
        .harvest(index.toString())
        .send({ from: account })
        .then((err) => {
          getStackerInfo();
          dispatch({
            type: "UPDATE_STAKE_STATE",
            payload: {
              loading: false,
            },
          });
          checkAllowance();
          notify(false, "Reward successfully harvested");
        });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          loading: false,
        },
      });
      notify(true, err.message);
    }
  };

  const getStackerInfo = async () => {
    dispatch({
      type: "UPDATE_STAKE_STATE",
      payload: {
        loading: true,
      },
    });
    try {
      var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      var decimals = await tokenContract.methods.decimals().call();
      var getBalance = await tokenContract.methods.balanceOf(account.toString()).call();
      var pow = 10 ** decimals;
      var balanceInEth = getBalance / pow;
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          balance: balanceInEth,
        },
      });

      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      var totalStakedToken = await contract.methods.totalStakedToken.call().call();
      var totalStakers = await contract.methods.totalStakers.call().call();
      var realtimeReward = await contract.methods.realtimeReward(account).call();
      var Stakers = await contract.methods.Stakers(account).call();

      var totalStakedTokenUser = Stakers.totalStakedTokenUser / pow;
      var totalUnstakedTokenUser = Stakers.totalUnstakedTokenUser / pow;
      var currentStaked = totalStakedTokenUser - totalUnstakedTokenUser;
      totalStakedToken = totalStakedToken / pow;

      Stakers.totalStakedTokenUser = totalStakedTokenUser;
      Stakers.totalUnstakedTokenUser = totalUnstakedTokenUser;
      Stakers.currentStaked = currentStaked;
      Stakers.realtimeReward = realtimeReward / pow;
      Stakers.totalClaimedRewardTokenUser = Stakers.totalClaimedRewardTokenUser / pow;
      var stakersRecord = [];
      for (var i = 0; i < parseInt(Stakers.stakeCount); i++) {
        var stakersRecordData = await contract.methods.stakersRecord(account, i).call();

        var realtimeRewardPerBlock = await contract.methods
          .realtimeRewardPerBlock(account, i.toString())
          .call();

        stakersRecordData.realtimeRewardPerBlock = realtimeRewardPerBlock[0] / pow;

        stakersRecordData.unstaketime = moment
          .unix(stakersRecordData.unstaketime)
          .format("DD/MM/YYYY h:mm A");
        stakersRecordData.staketime = moment
          .unix(stakersRecordData.staketime)
          .format("DD/MM/YYYY h:mm A");
        stakersRecord.push(stakersRecordData);
      }
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          stakersInfo: Stakers,
          stakersRecord,
          stackContractInfo: {
            totalStakers,
            totalStakedToken,
          },
          loading: false,
        },
      });
    } catch (err) {
      // console.log(err);

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

  useEffect(() => {
    if (account) {
      checkAllowance();
      getStackerInfo();
    } else {
      dispatch({
        type: "UPDATE_STAKE_STATE",
        payload: {
          ...INIT_STATE,
        },
      });
    }
    // eslint-disable-next-line
  }, [account, depositAmount]);

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
