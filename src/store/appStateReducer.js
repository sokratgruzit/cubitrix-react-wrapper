const INIT_STATE = {
  sideBarOpen: false,
  sideBar: "",
  userData: null,
  triedReconnect: false,
  isExtensionsLoaded: false,
  coinbaseLoading: false,
};

const appStateReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_SIDE_BAR":
      return { ...state, ...action.payload };

    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
        emailVerified: action.payload?.meta?.email ? true : false,
        hasPasswordSet: action.payload.hasPasswordSet,
        otp_enabled: action.payload.otp_enabled,
        otp_verified: action.payload.otp_verified,
      };

    case "SET_SYSTEM_ACCOUNT_DATA":
      return {
        ...state,
        userData: { ...state?.userData, system: [action.payload] },
      };

    case "UPDATE_ACTIVE_EXTENSIONS":
      return {
        ...state,
        userData: {
          ...state?.userData,
          extensions: { ...state?.userData?.extensions, ...action.payload },
        },
      };

    case "SET_TRIED_RECONNECT":
      return {
        ...state,
        triedReconnect: action.payload,
      };

    case "SET_EXTENSIONS_LOADED":
      return {
        ...state,
        isExtensionsLoaded: action.payload,
      };

    case "UPDATE_COINBASE_LOADING": // add this case
      return {
        ...state,
        coinbaseLoading: action.payload.value,
      };

    default:
      return state;
  }
};

export default appStateReducer;
