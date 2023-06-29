const INIT_STATE = {
  sideBarOpen: false,
  sideBar: "",
  userData: null,
  triedReconnect: false,
  isExtensionsLoaded: false,
};

const appStateReducer = (state = INIT_STATE, action) => {
  if (action.type === "SET_SIDE_BAR") {
    return { ...state, ...action.payload };
  }
  if (action.type === "SET_USER_DATA") {
    return {
      ...state,
      userData: action.payload,
      emailVerified: action.payload?.meta[0]?.email ? true : false,
      hasPasswordSet: action.payload.hasPasswordSet,
      otp_enabled: action.payload.otp_enabled,
      otp_verified: action.payload.otp_verified,
    };
  }

  if (action.type === "SET_SYSTEM_ACCOUNT_DATA") {
    return {
      ...state,
      userData: { ...state?.userData, system: [action.payload] },
    };
  }

  if (action.type === "UPDATE_ACTIVE_EXTENSIONS") {
    return {
      ...state,
      userData: {
        ...state?.userData,
        extensions: { ...state?.userData?.extensions, ...action.payload },
      },
    };
  }

  if (action.type === "SET_TRIED_RECONNECT") {
    return {
      ...state,
      triedReconnect: action.payload,
    };
  }

  if (action.type === "SET_EXTENSIONS_LOADED") {
    return {
      ...state,
      isExtensionsLoaded: action.payload,
    };
  }

  return state;
};

export default appStateReducer;
