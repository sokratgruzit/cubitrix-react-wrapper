const INIT_STATE = {
  sideBarOpen: false,
  sideBar: "",
  userData: null,
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

  return state;
};

export default appStateReducer;