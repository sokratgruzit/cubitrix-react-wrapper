const INIT_STATE = {
  isConnected: false,
  providerType: "",
  walletModal: false,
  account: "",
  balance: 0,
  chainId: undefined,
};

const connectReducer = (state = INIT_STATE, action) => {
  if (action.type === "TOGGLE_WALLET_CONNECT_MODAL") {
    return {
      ...state,
      walletModal: action.walletModal,
    };
  }

  if (action.type === "GET_ACCOUNT") {
    return {
      ...state,
      account: action.account,
    };
  }

  if (action.type === "GET_BALANCE") {
    return {
      ...state,
      balance: action.balance,
    };
  }

  if (action.type === "CONNECT") {
    return {
      ...state,
      isConnected: action.payload.isConnected,
      providerType: action.payload.providerType,
    };
  }
  if (action.type === "UPDATE_STATE") {
    console.log(action);
    return {
      ...state,
      ...action,
    };
  }
  return state;
};

export default connectReducer;
