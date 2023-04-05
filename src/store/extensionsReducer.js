const INIT_STATE = {
  activeExtensions: {
    trade: "false",
    loan: "false",
    notify: "false",
    staking: "false",
    referral: "false",
    connect: "false",
  },
};

const extensionsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_ACTIVE_EXTENSIONS":
      return {
        ...state,
        activeExtensions: {
          ...state.activeExtensions,
          ...action.payload,
        },
      };
    case "UPDATE_ACTIVE_EXTENSIONS":
      console.log(action.payload);
      return {
        ...state,
        activeExtensions: {
          ...state.activeExtensions,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default extensionsReducer;
