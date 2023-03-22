import moment from "moment";

export const INIT_STATE = {
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
  timeperiodDate: moment().add(30, "days").format("DD/MM/YYYY h:mm A"),
};

export const stakeReducer = (state = INIT_STATE, { type, payload }) => {
  if (type === "UPDATE_STAKE_STATE") {
    return {
      ...state,
      ...payload,
    };
  }

  return state;
};
