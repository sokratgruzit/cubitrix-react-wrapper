const INIT_STATE = {
  isConnected: false,
  providerType: "",
  walletModalActive: false,
  balance: 0,
};

const connectReducer = (state = INIT_STATE, action) => {
  if (action.type === "TOGGLE_WALLET_CONNECT_MODAL") {
    return {
      ...state,
      walletModalActive: action.payload,
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
      ...action.payload,
      // isConnected: action.payload.isConnected,
      // providerType: action.payload.providerType,
    };
  }

  return state;
};

export default connectReducer;
