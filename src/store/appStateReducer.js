const INIT_STATE = {
  sideBarOpen: false,
  sideBar: "",
};

const appStateReducer = (state = INIT_STATE, action) => {
  if (action.type === "SET_SIDE_BAR") {
    return { ...state, ...action.payload };
  }

  return state;
};

export default appStateReducer;
