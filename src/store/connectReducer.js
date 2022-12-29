const INIT_STATE = {
  isConnected: false,
  providerType: "",
  walletModal: false,
  balance: 0
};

const connectReducer = (state = INIT_STATE, action) => {
  if (action.type === "TOGGLE_WALLET_CONNECT_MODAL") {
    return {
      ...state,
      walletModal: action.walletModal,
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

  return state;
};

export default connectReducer;
